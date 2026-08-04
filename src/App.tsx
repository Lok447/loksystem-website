import { useEffect, useState } from 'react'
import './App.css'

type ReleaseInfo = {
  version: string
  channel: string
  platform: string
  fileName: string
  fileSize: string
  publishedAt: string
  downloadUrl: string
  githubReleaseUrl: string
  releaseNotesUrl: string
  sha256: string
}

type TextBlock = {
  title: string
  description: string
}

type Capability = TextBlock & {
  accent: string
  points: string[]
}

type WorkflowItem = TextBlock & {
  step: string
}

type FaqItem = {
  question: string
  answer: string
}

const release: ReleaseInfo = {
  version: '2.0.8',
  channel: 'Latest',
  platform: 'Windows x64',
  fileName: 'LokSystem-2.0.8-win-x64.exe',
  fileSize: '构建完成后公布',
  publishedAt: '2026-08-05',
  downloadUrl:
    'https://update.lokai.net.cn/stable/LokSystem-2.0.8-win-x64.exe',
  githubReleaseUrl:
    'https://github.com/Lok447/loksystem-releases/releases/tag/v2.0.8',
  releaseNotesUrl: '/releases/latest.json',
  sha256: '待 2.0.8 安装包构建完成后公布',
}

const heroStats = [
  { value: '多 Agent', label: '统一入口' },
  { value: '本地文件', label: '上下文协作' },
  { value: `v${release.version}`, label: '公开基线版' },
]

const capabilities: Capability[] = [
  {
    accent: '01',
    title: '一个入口管理多类 Agent',
    description:
      '把 LokCLI、研发智能体、办公技能和常用模型放到同一个桌面工作台，用户不用在多个终端、网页和配置文件之间来回切换。',
    points: ['新会话', '模型管理', '智能体管理'],
  },
  {
    accent: '02',
    title: '围绕文件和任务持续工作',
    description:
      '在同一个输入区发消息、上传文件、关联文件夹或创建定时任务，让 Agent 带着上下文推进研究、分析、生成和总结。',
    points: ['关联文件夹', '定时任务', '一键工作总结'],
  },
  {
    accent: '03',
    title: '从个人效率走向团队协作',
    description:
      '桌面端先把个人工作流跑顺，再通过团队协作、远程管理和 WebUI 扩展到更多角色，逐步沉淀组织级 AI 工作方式。',
    points: ['团队协作', '远程管理', 'WebUI'],
  },
]

const scenarios: TextBlock[] = [
  {
    title: '研发与技术交付',
    description:
      '把命令行 Agent 放进桌面工作区，围绕项目目录完成需求拆解、代码修改、发布检查和问题复盘。',
  },
  {
    title: '资料生产与内容交付',
    description:
      '围绕文档、表格、PPT、PDF、图片和视频类任务组织上下文，让 Agent 从问答走向可交付内容生产。',
  },
  {
    title: '团队试点与流程沉淀',
    description:
      '把个人高频任务变成团队可复用流程，再逐步接入远程管理、WebUI 和国内下载分发体系。',
  },
]

const workflow: WorkflowItem[] = [
  {
    step: '01',
    title: '安装桌面工作台',
    description:
      '下载 Windows x64 安装器，完成本地桌面环境初始化，并通过 SHA256 核对文件完整性。',
  },
  {
    step: '02',
    title: '接入模型与智能体',
    description:
      '配置模型供应商、LokCLI、技能和工作区权限，让不同任务拥有合适的执行角色。',
  },
  {
    step: '03',
    title: '沉淀可复用工作流',
    description:
      '围绕文件、会话、定时任务和团队协作形成稳定流程，再扩展到 WebUI 与远程访问。',
  },
]

const trustItems = [
  '当前主下载入口使用 LokSystem 国内更新通道，GitHub Releases 提供备用发布页。',
  '官网同步展示版本号、文件名、发布时间和 SHA256 校验值，方便用户核对来源。',
  '安装包存放在独立发布存储中，不进入官网代码仓库，也不会被打包进桌面应用。',
]

const faqs: FaqItem[] = [
  {
    question: '现在可以直接下载 LokSystem 吗？',
    answer:
      '2.0.8 安装包发布后可以。官网主下载使用国内更新通道，GitHub Releases 同时提供备用发布入口。',
  },
  {
    question: '官网展示的是实际产品界面吗？',
    answer:
      '是的。首屏产品图使用当前 LokSystem 桌面端实际界面截图，后续版本更新时只需要替换 public/product/loksystem-app-screenshot.png。',
  },
  {
    question: '为什么要展示 SHA256？',
    answer:
      'SHA256 用于核对下载文件是否完整、是否与发布资产一致，适合企业用户和技术用户做安装前校验。',
  },
  {
    question: '为什么 Windows 显示“未知发布者”？',
    answer:
      '当前公开测试版暂未进行 Windows 代码签名，因此系统可能显示“未知发布者”。请仅从官网或官方 GitHub Release 下载，并在安装前核对 SHA256。',
  },
]

const productScreenshotPath = '/product/loksystem-app-screenshot.png'

function ProductMock() {
  return (
    <div className="product-window" aria-label="LokSystem product interface preview">
      <div className="window-bar">
        <div className="window-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="window-title">LokSystem Desktop</span>
        <span className="window-version">v{release.version}</span>
      </div>

      <div className="window-layout">
        <aside className="workspace-nav">
          <div className="workspace-brand">
            <img src="/brand/app-icon.png" alt="" />
            <span>LokSystem</span>
          </div>
          {['工作台', '会话', 'Agent', '技能', 'WebUI'].map((item, index) => (
            <div className={index === 0 ? 'workspace-link active' : 'workspace-link'} key={item}>
              <span aria-hidden="true" />
              {item}
            </div>
          ))}
        </aside>

        <section className="workspace-main">
          <div className="task-header">
            <div>
              <span className="task-kicker">AI Agent Workspace</span>
              <h2>项目交付计划与资料整理</h2>
            </div>
            <span className="mock-action">生成执行计划</span>
          </div>

          <div className="task-thread">
            <article className="thread-card user-card">
              <span>用户目标</span>
              <p>读取项目资料，整理本周交付计划，并输出可复用的执行清单。</p>
            </article>
            <article className="thread-card agent-card">
              <span>LokSystem</span>
              <p>
                已识别需求文档、工作区文件和历史会话。建议先确认目标，再分解任务、执行检查并沉淀交付物。
              </p>
            </article>
          </div>

          <div className="delivery-grid">
            <article>
              <span>安装包</span>
              <strong>{release.fileSize}</strong>
            </article>
            <article>
              <span>版本</span>
              <strong>{release.version}</strong>
            </article>
            <article>
              <span>状态</span>
              <strong>Ready</strong>
            </article>
          </div>
        </section>

        <aside className="task-rail">
          <h3>任务计划</h3>
          <ol>
            <li>确认 GitHub Release 资源</li>
            <li>整理工作区上下文</li>
            <li>生成任务执行计划</li>
            <li>输出交付与复盘清单</li>
          </ol>
          <div className="rail-status">
            <span aria-hidden="true" />
            发布信息可验证
          </div>
        </aside>
      </div>
    </div>
  )
}

function ProductVisual() {
  const [screenshotReady, setScreenshotReady] = useState(false)

  useEffect(() => {
    const image = new Image()
    image.onload = () => setScreenshotReady(true)
    image.onerror = () => setScreenshotReady(false)
    image.src = productScreenshotPath
  }, [])

  if (screenshotReady) {
    return (
      <figure className="screenshot-frame">
        <img src={productScreenshotPath} alt="LokSystem desktop application screenshot" />
      </figure>
    )
  }

  return <ProductMock />
}

function App() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="LokSystem home">
          <img src="/brand/app-icon.png" alt="" />
          <span>LokSystem</span>
        </a>
        <nav className="nav-links">
          <a href="#product">产品</a>
          <a href="#scenarios">场景</a>
          <a href="#download">下载</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-content">
          <p className="eyebrow">LokSystem Official Release</p>
          <h1>LokSystem AI Agent 桌面工作台</h1>
          <p className="hero-lede">
            一个面向 Windows 用户的 AI 工作入口：统一会话、模型、智能体、技能、文件上下文和团队协作。
            从发消息到上传文件，从深度研究到一键总结，让 AI 真正进入日常工作流。
          </p>
          <div className="hero-actions">
            <a className="primary-action" href={release.downloadUrl} download>
              下载 Windows x64
            </a>
            <a className="secondary-action" href={release.githubReleaseUrl}>
              查看 GitHub Release
            </a>
          </div>
          <div className="hero-stats" aria-label="Current release summary">
            {heroStats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-stage-wrap">
          <ProductVisual />
        </div>
      </section>

      <section className="signal-strip" aria-label="Product signals">
        <span>桌面 Agent 工作台</span>
        <span>多模型与智能体</span>
        <span>文件夹上下文</span>
        <span>团队协作与远程管理</span>
      </section>

      <section className="product-section" id="product" aria-labelledby="product-title">
        <div className="section-heading wide">
          <p className="eyebrow">Product Positioning</p>
          <h2 id="product-title">不是又一个聊天窗口，而是可持续使用的 AI 工作台</h2>
          <p>
            LokSystem 把常用 AI 能力收进桌面应用：新会话、对话搜索、模型管理、智能体管理、技能管理、定时任务和团队协作，
            让用户从单次提问走向连续工作。
          </p>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className="capability-card" key={capability.title}>
              <span className="capability-index">{capability.accent}</span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <div className="capability-tags">
                {capability.points.map((point) => (
                  <span key={point}>{point}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" aria-labelledby="workflow-title">
        <div className="workflow-copy">
          <p className="eyebrow">How It Works</p>
          <h2 id="workflow-title">从安装到协作，把 AI 工作流落在桌面上</h2>
          <p>
            当前版本优先提供稳定的 Windows 桌面工作台、公开安装包和版本校验，并通过独立官网与国内更新通道完成分发。
          </p>
        </div>
        <div className="workflow-grid">
          {workflow.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scenario-section" id="scenarios" aria-labelledby="scenarios-title">
        <div className="section-heading">
          <p className="eyebrow">Use Cases</p>
          <h2 id="scenarios-title">面向真实任务，而不是只停留在演示</h2>
        </div>
        <div className="scenario-grid">
          {scenarios.map((scenario) => (
            <article className="scenario-card" key={scenario.title}>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="download-section" id="download" aria-labelledby="download-title">
        <div className="download-copy">
          <p className="eyebrow">Download Center</p>
          <h2 id="download-title">下载最新公开基线版本</h2>
          <p>
            当前主下载入口通过国内更新通道分发，GitHub Releases 提供备用发布页和历史版本记录。
          </p>
        </div>

        <div className="download-grid">
          <article className="download-card">
            <p className="card-kicker">{release.channel}</p>
            <h3>LokSystem {release.version}</h3>
            <p>
              适用于 {release.platform} 的公开安装器，适合用户下载安装并完成最新版本校验。
            </p>
            <div className="download-actions">
              <a className="download-button" href={release.downloadUrl} download>
                下载 {release.platform}
              </a>
              <a className="release-link" href={release.githubReleaseUrl}>
                发布页
              </a>
            </div>
          </article>

          <dl className="release-table">
            <div>
              <dt>文件名</dt>
              <dd>{release.fileName}</dd>
            </div>
            <div>
              <dt>文件大小</dt>
              <dd>{release.fileSize}</dd>
            </div>
            <div>
              <dt>发布日期</dt>
              <dd>{release.publishedAt}</dd>
            </div>
            <div>
              <dt>发布页面</dt>
              <dd>
                <a href={release.githubReleaseUrl}>GitHub Release</a>
              </dd>
            </div>
            <div>
              <dt>版本元数据</dt>
              <dd>
                <a href={release.releaseNotesUrl}>latest.json</a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="checksum-box">
          <span>SHA256</span>
          <code>{release.sha256}</code>
        </div>
      </section>

      <section className="trust-section" aria-labelledby="trust-title">
        <div>
          <p className="eyebrow">Release Trust</p>
          <h2 id="trust-title">公开发布，必须让用户能核对来源</h2>
        </div>
        <ul>
          {trustItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="faq-section" id="faq" aria-labelledby="faq-title">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">发布与下载说明</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span>LokSystem</span>
          <span>© 2026 LokSystem. All rights reserved.</span>
        </div>
        <nav className="footer-links" aria-label="Legal and filing links">
          <a href="/legal/user-agreement/">用户协议</a>
          <a href="/legal/privacy-policy/">隐私政策</a>
          <a href="https://beian.miit.gov.cn/">粤ICP备2026107083号</a>
        </nav>
      </footer>
    </main>
  )
}

export default App
