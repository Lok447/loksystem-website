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
  fileSize: '413.26 MB',
  publishedAt: '2026-08-05',
  downloadUrl:
    'https://update.lokai.net.cn/stable/LokSystem-2.0.8-win-x64.exe',
  githubReleaseUrl:
    'https://github.com/Lok447/loksystem-releases/releases/tag/v2.0.8',
  releaseNotesUrl: '/releases/latest.json',
  sha256: '940329D1E55637C68335080E605EF8EF763782DC95239A19A7EE284C4E710422',
}

const heroStats = [
  { value: '多 Agent', label: '统一工作入口' },
  { value: '本地优先', label: '文件与交付物' },
  { value: `v${release.version}`, label: 'Windows 公测版' },
]

const capabilities: Capability[] = [
  {
    accent: '01',
    title: '多模型与多 Agent，统一管理',
    description:
      '在同一个桌面工作台接入主流模型、LokCLI/Hermes、Codex、Claude Code、Qwen Code 与自定义助手，减少终端、网页和配置文件之间的切换。',
    points: ['模型管理', 'Agent 切换', '助手预设'],
  },
  {
    accent: '02',
    title: '围绕本地文件持续推进任务',
    description:
      '关联项目文件夹、上传资料并保留会话上下文，让 Agent 能够读取、生成和修改真实文件，结果直接落到用户可见的工作区。',
    points: ['文件夹上下文', '文件预览', '本地交付'],
  },
  {
    accent: '03',
    title: '过程可见，结果可继续编辑',
    description:
      '在会话中查看推理、工具调用、文件变更与任务进度，生成的文档、表格、代码和多媒体内容可以继续预览、修改与复用。',
    points: ['步骤追踪', '变更查看', '交付物预览'],
  },
  {
    accent: '04',
    title: '办公内容与多模态生产',
    description:
      '支持 Word、Excel、PPT、PDF、图片和视频相关任务，把资料分析、内容生成与文件交付放进同一条工作链路。',
    points: ['文档表格', '演示材料', '图片视频'],
  },
  {
    accent: '05',
    title: '定时任务与会议整理',
    description:
      '将日报、研究和信息整理变成可回看的定时任务；也可导入或录制会议音频，生成摘要、行动项与决议。',
    points: ['任务日历', '会议转写', '行动项'],
  },
  {
    accent: '06',
    title: '从个人使用扩展到团队',
    description:
      '通过 Team Mode、共享任务和消息流组织多个 Agent，再按需要接入 WebUI、远程管理与常用消息通道。',
    points: ['Team Mode', 'WebUI', '远程通道'],
  },
]

const scenarios: TextBlock[] = [
  {
    title: '研发、测试与发布',
    description:
      '把命令行 Agent 放进桌面工作区，围绕项目目录完成需求拆解、代码修改、自动化测试、发布检查和问题复盘。',
  },
  {
    title: '研究、资料与内容交付',
    description:
      '围绕文档、表格、PPT、PDF、图片和视频组织上下文，让 Agent 从信息收集走向结构化、可继续编辑的交付成果。',
  },
  {
    title: '个人业务与小团队协作',
    description:
      '先把高频个人任务沉淀为稳定流程，再用定时任务、Team Mode、WebUI 和远程通道扩展到更多成员。',
  },
]

const workflow: WorkflowItem[] = [
  {
    step: '01',
    title: '安装桌面工作台',
    description: '从官网获取 Windows x64 公测版，安装前核对文件名、大小与 SHA-256。',
  },
  {
    step: '02',
    title: '配置模型与 Agent',
    description:
      '配置模型供应商、LokCLI/Hermes、技能与工作区权限，为不同任务选择合适的执行角色。',
  },
  {
    step: '03',
    title: '完成任务并沉淀结果',
    description:
      '在会话中检查执行过程和文件变更，将结果保存在工作区，再把高频任务转为自动化或团队流程。',
  },
]

const trustItems = [
  '桌面端代码采用 Apache-2.0 许可证；公开发布记录和下载资产可在 GitHub Releases 核对。',
  '主下载使用国内更新通道，GitHub Releases 提供备用发布页和历史版本。',
  '官网公布版本号、文件名、大小、发布时间和 SHA-256，方便安装前核对来源。',
  '本地文件默认在用户选择的工作区中处理；具体数据边界以隐私政策和所接入模型服务为准。',
]

const faqs: FaqItem[] = [
  {
    question: '现在可以直接下载 LokSystem 吗？',
    answer:
      '可以。当前公开版本是 2.0.8 Windows x64 公测版，官网提供国内下载入口，GitHub Releases 提供备用发布页和历史版本。',
  },
  {
    question: '官网展示的是实际产品界面吗？',
    answer:
      '是的。首屏产品图使用当前 LokSystem 桌面端实际界面截图，后续版本更新时只需要替换 public/product/loksystem-app-screenshot.png。',
  },
  {
    question: '安装后可以自动更新吗？',
    answer:
      '可以。2.0.8 已接入正式更新通道，后续发布兼容版本时可在应用内检查、下载并安装更新。建议更新前保留重要工作区备份。',
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
  {
    question: '遇到问题如何反馈？',
    answer:
      '请将可复现步骤、系统版本和必要日志发送至 lok24357@gmail.com；请勿在邮件或截图中包含账号密码、API Key 等敏感信息。',
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
          <a href="#product">能力</a>
          <a href="#scenarios">场景</a>
          <a href="#download">下载</a>
          <a href="#faq">FAQ</a>
          <a href={release.githubReleaseUrl}>GitHub</a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-content">
          <p className="eyebrow">Windows Public Beta · v{release.version}</p>
          <h1>LokSystem AI Agent 桌面工作台</h1>
          <p className="hero-lede">
            把多模型、智能体、技能和本地文件放进一个工作区。从需求到执行过程，再到文档、表格、代码与多媒体交付，
            让 AI 不只回答问题，而是持续推进真实任务。
          </p>
          <div className="hero-actions">
            <a className="primary-action" href={release.downloadUrl} download>
              下载 Windows x64
            </a>
            <a className="secondary-action" href={release.githubReleaseUrl}>
              查看发布记录
            </a>
          </div>
          <p className="hero-release-note">
            当前为 Windows x64 公测版，安装时可能显示“未知发布者”。请从官方入口下载并核对 SHA-256。
          </p>
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
        <span>Apache-2.0 许可</span>
        <span>本地文件工作区</span>
        <span>执行过程可追踪</span>
        <span>国内下载与自动更新</span>
      </section>

      <section className="product-section" id="product" aria-labelledby="product-title">
        <div className="section-heading wide">
          <p className="eyebrow">What You Can Do</p>
          <h2 id="product-title">从一次提问，走向一条可持续执行的工作流</h2>
          <p>
            LokSystem 不替用户隐藏过程。模型、Agent、文件上下文、工具调用、变更记录和最终交付都在同一工作区中呈现，
            便于检查、继续编辑和复用。
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
          <h2 id="workflow-title">安装、配置、执行，三步开始真实任务</h2>
          <p>
            不需要先搭建复杂平台。选择一个可用模型和工作区，就可以从熟悉的桌面环境开始。
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
          <h2 id="scenarios-title">先解决高频任务，再逐步沉淀团队能力</h2>
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
          <h2 id="download-title">下载 LokSystem {release.version}</h2>
          <p>
            主下载入口通过国内更新通道分发，GitHub Releases 提供备用发布页和历史记录。安装前请核对下方信息。
          </p>
        </div>

        <div className="download-grid">
          <article className="download-card">
            <p className="card-kicker">{release.channel}</p>
            <h3>LokSystem {release.version}</h3>
            <p>
              面向个人、OPC 和小团队的公开测试版本。安装完成后可在应用内继续接收后续兼容更新。
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
        <div className="install-notice">
          <strong>安装提示</strong>
          <p>
            当前安装包未进行 Windows 代码签名，SmartScreen 或安装器可能显示“未知发布者”。这不代表文件校验失败；
            请确认下载域名、文件名与 SHA-256 均和本页一致后再继续。
          </p>
        </div>
      </section>

      <section className="trust-section" aria-labelledby="trust-title">
        <div>
          <p className="eyebrow">Open & Verifiable</p>
          <h2 id="trust-title">版本和安装包来源都可以核对</h2>
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
          <h2 id="faq-title">开始使用前常见问题</h2>
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
          <a href="mailto:lok24357@gmail.com">问题反馈</a>
          <a href={release.githubReleaseUrl}>GitHub Release</a>
          <a href="https://beian.miit.gov.cn/">粤ICP备2026107083号</a>
        </nav>
      </footer>
    </main>
  )
}

export default App
