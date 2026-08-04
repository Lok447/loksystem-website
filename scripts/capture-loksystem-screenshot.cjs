const { spawn } = require('child_process')
const { createRequire } = require('module')
const fs = require('fs')
const http = require('http')
const net = require('net')
const os = require('os')
const path = require('path')

const projectRoot = 'D:/loksystem-main'
const projectRequire = createRequire(path.join(projectRoot, 'package.json'))
const { chromium } = projectRequire('playwright')
const executablePath = path.join(projectRoot, 'out', 'win-unpacked', 'LokSystem.exe')
const outputPath = path.resolve(__dirname, '..', 'public', 'product', 'loksystem-app-screenshot.png')
const artifactsDir = path.resolve(__dirname, '..', 'artifacts')
const failedOutputPath = path.join(artifactsDir, 'loksystem-app-screenshot-failed.png')

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function allocatePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Unable to allocate TCP port.')))
        return
      }
      server.close(() => resolve(address.port))
    })
  })
}

async function waitForCdp(port, child, timeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`LokSystem exited before CDP was ready, exit code ${child.exitCode}.`)
    }

    const ok = await new Promise((resolve) => {
      const req = http.get(`http://127.0.0.1:${port}/json/version`, { timeout: 1500 }, (res) => {
        res.resume()
        resolve(res.statusCode === 200)
      })
      req.on('error', () => resolve(false))
      req.on('timeout', () => {
        req.destroy()
        resolve(false)
      })
    })

    if (ok) return
    await wait(250)
  }

  throw new Error(`Timed out waiting for LokSystem CDP on port ${port}.`)
}

function isMainPage(page) {
  const url = page.url().toLowerCase()
  return !url.startsWith('devtools://') && !url.includes('/ambient/') && !url.includes('/pet/')
}

async function resolveMainPage(browser, timeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const pages = browser.contexts().flatMap((context) => context.pages())
    const page = pages.find((candidate) => !candidate.isClosed() && isMainPage(candidate))
    if (page) {
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => undefined)
      await page.waitForSelector('body', { timeout: 10000 }).catch(() => undefined)
      return page
    }
    await wait(500)
  }
  throw new Error('Unable to resolve LokSystem main window.')
}

async function completeForcedPasswordChangeIfNeeded(page, passwordState) {
  const currentPassword = page.locator('#current-password')
  const needsPasswordChange = await currentPassword.isVisible().catch(() => false)
  if (!needsPasswordChange) return

  await currentPassword.waitFor({ state: 'visible', timeout: 10000 })
  if (passwordState.current) {
    await currentPassword.fill(passwordState.current)
  } else {
    passwordState.current = await currentPassword.inputValue()
  }

  const nextPassword = 'LokSystemWebsite@12345'
  await page.locator('#new-password').fill(nextPassword)
  await page.locator('#confirm-password').fill(nextPassword)
  await page.locator('button[type="submit"].login-page__submit').click({ force: true })
  passwordState.current = nextPassword
  await page
    .waitForFunction(() => window.location.hash.includes('/guid') || !document.querySelector('#current-password'), {
      timeout: 15000,
    })
    .catch(() => undefined)
}

async function completeLoginIfNeeded(page) {
  const passwordState = { current: process.env.E2E_PASSWORD || '' }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    await completeForcedPasswordChangeIfNeeded(page, passwordState)

    const usernameInput = page.locator('#username.login-page__input')
    const needsLogin = await usernameInput.isVisible().catch(() => false)
    if (!needsLogin) {
      return
    }

    const passwordInput = page.locator('#password')
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 })
    if (!(await usernameInput.inputValue())) {
      await usernameInput.fill(process.env.E2E_USERNAME || 'admin')
    }

    if (passwordState.current) {
      await passwordInput.fill(passwordState.current)
    } else {
      passwordState.current = await passwordInput.inputValue()
    }

    if (!passwordState.current) {
      throw new Error('Login page did not expose a generated password.')
    }

    await passwordInput.press('Enter')
    const leftLogin = await page
      .waitForFunction(
        () => Boolean(document.querySelector('#current-password')) || !document.querySelector('#username.login-page__input'),
        { timeout: 7000 }
      )
      .then(() => true)
      .catch(() => false)

    if (!leftLogin) {
      const submit = page.locator('button[type="submit"].login-page__submit')
      if (await submit.isVisible().catch(() => false)) {
        await submit.click({ force: true })
      }
    }

    await page
      .waitForFunction(
        () => Boolean(document.querySelector('#current-password')) || !document.querySelector('#username.login-page__input'),
        { timeout: 15000 }
      )
      .catch(() => undefined)
  }

  await completeForcedPasswordChangeIfNeeded(page, passwordState)

  if (await page.locator('#username.login-page__input').isVisible().catch(() => false)) {
    throw new Error('Authentication did not leave the login page.')
  }
}

async function completeDataDirOnboardingIfNeeded(page) {
  const keepDefaultButton = page.locator('button').filter({ hasText: /使用默认目录|Use default directory/i }).first()
  const visible = await keepDefaultButton
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false)
  if (!visible) return

  await keepDefaultButton.click({ force: true })
  await keepDefaultButton.waitFor({ state: 'detached', timeout: 15000 }).catch(() => undefined)
}

async function main() {
  if (!fs.existsSync(executablePath)) {
    throw new Error(`LokSystem executable not found: ${executablePath}`)
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.mkdirSync(artifactsDir, { recursive: true })

  const port = await allocatePort()
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'loksystem-website-shot-'))
  const logPath = path.join(artifactsDir, 'capture-loksystem-screenshot.log')
  const logStream = fs.createWriteStream(logPath, { flags: 'w' })
  const child = spawn(executablePath, [`--user-data-dir=${userDataDir}`], {
    cwd: path.dirname(executablePath),
    env: {
      ...process.env,
      LOKSYSTEM_CDP_PORT: String(port),
      LOKSYSTEM_DISABLE_AUTO_UPDATE: '1',
      LOKSYSTEM_DISABLE_DEVTOOLS: '1',
      LOKSYSTEM_E2E_TEST: '1',
      LOKSYSTEM_E2E_USER_DATA_DIR: userDataDir,
      NODE_ENV: 'production',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  })

  child.stdout.pipe(logStream, { end: false })
  child.stderr.pipe(logStream, { end: false })

  let browser
  try {
    await waitForCdp(port, child, 60000)
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`, { timeout: 10000 })
    const page = await resolveMainPage(browser, 30000)
    await page.setViewportSize({ width: 1440, height: 920 })
    await completeLoginIfNeeded(page)
    await completeDataDirOnboardingIfNeeded(page)
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => undefined)
    await wait(3000)
    const stillOnLogin = await page.locator('.login-page').isVisible().catch(() => false)
    if (stillOnLogin) {
      await page.screenshot({ path: failedOutputPath, fullPage: false })
      throw new Error(`LokSystem is still on the login page. Kept failed capture at: ${failedOutputPath}`)
    }
    await page.screenshot({ path: outputPath, fullPage: false })
    console.log(`Captured LokSystem screenshot: ${outputPath}`)
  } finally {
    await browser?.close().catch(() => undefined)
    child.kill()
    await wait(500)
    logStream.end()
    fs.rmSync(userDataDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
