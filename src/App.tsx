import { useEffect, useState } from 'react'
import {
  Bot,
  Check,
  ChevronDown,
  Code2,
  Download,
  FileText,
  FolderKanban,
  ImageIcon,
  Laptop,
  Menu,
  Monitor,
  MonitorUp,
  Presentation,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Workflow,
  X,
  Zap,
} from 'lucide-react'
import './App.css'

const releases = [
  {
    id: 'windows-x64',
    platform: 'Windows x64',
    architecture: 'x64',
    version: '2.0.8',
    fileName: 'LokSystem-2.0.8-win-x64.exe',
    fileSize: '413.26 MB',
    status: '正式版',
    icon: Monitor,
  },
  {
    id: 'macos-arm64',
    platform: 'macOS Apple 芯片',
    architecture: 'arm64',
    version: '2.0.8',
    fileName: 'LokSystem-2.0.8-mac-arm64.dmg',
    fileSize: '331.52 MB',
    status: '测试版',
    icon: Laptop,
  },
  {
    id: 'macos-x64',
    platform: 'macOS Intel',
    architecture: 'x64',
    version: '2.0.8',
    fileName: 'LokSystem-2.0.8-mac-x64.dmg',
    fileSize: '344.84 MB',
    status: '测试版',
    icon: Laptop,
  },
] as const

type ReleaseId = (typeof releases)[number]['id']
type DownloadSource = 'hero' | 'download_section' | 'final_cta'

const release = releases[0]
const trackedDownloadUrl = (platform: ReleaseId, source: DownloadSource) =>
  `https://api.lokai.net.cn/download/${platform}?source=${source}`

const capabilities = [
  {
    icon: Bot,
    title: '多模型与多 Agent',
    description:
      '统一接入 LokCLI、Codex、Claude Code、Qwen Code 与自定义助手，为不同任务快速切换合适的执行角色。',
    detail: '模型管理 / Agent 切换 / 助手预设',
  },
  {
    icon: FolderKanban,
    title: '真实文件工作区',
    description:
      '关联本地项目与资料，让 Agent 读取、生成和修改真实文件，结果直接沉淀到你可见、可控的工作区。',
    detail: '文件上下文 / 变更查看 / 本地交付',
  },
  {
    icon: Workflow,
    title: '持续推进任务',
    description:
      '从需求澄清到计划、执行、检查和交付，完整过程都在同一条任务链路中呈现，随时可以接着做。',
    detail: '步骤追踪 / 工具调用 / 结果回收',
  },
  {
    icon: Presentation,
    title: '文档与表格交付',
    description:
      '处理 Word、Excel、PPT 和 PDF，把资料分析、内容生成与格式整理推进为可继续编辑的办公成果。',
    detail: 'Word / Excel / PPT / PDF',
  },
  {
    icon: Zap,
    title: '自定义自动化',
    description:
      '按业务需要创建定时、周期或一次性任务，将日报、研究、信息整理等重复工作沉淀为稳定流程。',
    detail: '定时任务 / 周期执行 / 自定义流程',
  },
  {
    icon: ImageIcon,
    title: '图片与视频创作',
    description:
      '从文字或参考素材生成图片与视频，支持创意扩展、视觉修改和多媒体内容交付。',
    detail: '图片生成 / 图片编辑 / 视频生成',
  },
]

const workflow = [
  {
    step: '01',
    title: '连接工作区',
    description: '选择项目文件夹、业务资料或现有会话，让任务从真实上下文开始。',
    icon: FolderKanban,
  },
  {
    step: '02',
    title: '组织 Agent 执行',
    description: '选择模型、助手与技能，查看计划、工具调用和每一步文件变更。',
    icon: Bot,
  },
  {
    step: '03',
    title: '检查并沉淀成果',
    description: '预览文档、表格、代码和多媒体结果，把高频流程继续转为自动化。',
    icon: ShieldCheck,
  },
]

const scenarios = [
  {
    icon: Code2,
    title: '研发与发布',
    description: '需求拆解、代码修改、自动化测试、发布检查与问题复盘。',
    meta: '项目文件夹 · CLI Agent · 变更追踪',
  },
  {
    icon: MonitorUp,
    title: '数据分析与报表',
    description: '整理业务数据、分析变化趋势、生成图表，并输出可继续编辑的分析结果。',
    meta: 'Excel · 数据分析 · 可视化',
  },
  {
    icon: FileText,
    title: '研究与内容交付',
    description: '资料分析、报告生成、表格处理、演示文稿与多媒体内容。',
    meta: 'Word · Excel · PPT · PDF',
  },
  {
    icon: Zap,
    title: '自定义自动化',
    description: '将日报、资料汇总、监测和重复操作配置为按时自动执行的任务。',
    meta: '定时任务 · 周期执行 · 结果归档',
  },
  {
    icon: Video,
    title: '图片与视频创作',
    description: '从创意描述或参考素材生成图片和视频，并继续完成修改、组合与交付。',
    meta: '图片生成 · 视觉编辑 · 视频生成',
  },
  {
    icon: Users,
    title: '团队与个人业务',
    description: '沉淀个人高频任务，再通过自动化、Team Mode 和远程通道扩展到团队。',
    meta: '自动化 · 团队协作 · 远程管理',
  },
]

const comparisons = [
  ['工作对象', '一次对话', '单个命令或项目', '任务、文件与交付物'],
  ['任务推进', '以问答为主', '偏执行', '计划、执行、检查、回收'],
  ['本地文件', '通常需上传', '支持', '围绕工作区持续沉淀'],
  ['多 Agent 协作', '有限', '通常无', 'Leader + 成员协作'],
  ['结果交付', '停留在对话', '代码与日志', '文档、表格、代码与多媒体'],
]

const faqs = [
  {
    question: 'LokSystem 是什么类型的产品？',
    answer:
      'LokSystem 是面向真实任务的 AI Agent 统一协作工作台。它把模型、Agent、技能、本地文件、执行过程和最终交付放进同一个工作区，让 AI 不只回答问题，还能持续推进任务。',
  },
  {
    question: 'LokSystem 可以接入哪些模型和 Agent？',
    answer:
      '可以统一管理 LokCLI、Hermes、Codex、Claude Code、Qwen Code 与自定义助手，并为不同任务切换合适的模型和执行角色。实际可用范围取决于本地版本、模型服务和相关配置。',
  },
  {
    question: '它如何使用本地文件和项目资料？',
    answer:
      '你可以关联项目文件夹、上传资料或选择工作区。获得相应权限后，Agent 可以读取、生成和修改真实文件，并将结果直接保存到用户可见的工作区中。',
  },
  {
    question: '可以处理 Word、Excel、PPT 和 PDF 吗？',
    answer:
      '可以。LokSystem 能围绕文档、表格、演示文稿和 PDF 完成读取、整理、分析、生成与格式处理，并输出可继续编辑的文件。具体效果取决于所选 Agent、模型和技能。',
  },
  {
    question: '支持图片和视频相关任务吗？',
    answer:
      '支持。你可以从文字描述或参考素材开始生成图片、编辑视觉内容和生成视频，并把相关素材与结果保存在同一工作区。可用能力取决于接入的模型、技能和服务。',
  },
  {
    question: '什么是自定义自动化？',
    answer:
      '你可以把日报、资料汇总、研究监测和其他重复工作配置为一次性、定时或周期任务，让固定流程按计划执行，并在任务记录中查看和复用结果。',
  },
  {
    question: '任务执行过程是否可以查看和接续？',
    answer:
      '可以。计划、任务步骤、工具调用、进度、文件变更和交付结果会在工作区中呈现。你可以检查当前状态、继续补充要求，并基于已有上下文接着推进。',
  },
  {
    question: '多个 Agent 如何协同完成一个任务？',
    answer:
      '在 Team Mode 中，Leader Agent 可以拆解主任务并分派给不同成员 Agent 并行执行，再统一回收阶段结果。成员共享任务上下文和工作区文件，便于保持主线一致。',
  },
  {
    question: '可以用于代码开发、测试和发布吗？',
    answer:
      '可以。LokSystem 能围绕项目目录组织代码 Agent，支持需求拆解、代码修改、命令执行、自动化测试、发布检查和问题复盘。具体操作仍受工作区权限和所选工具限制。',
  },
  {
    question: '支持 WebUI 和远程触达吗？',
    answer:
      '支持按需接入 WebUI、远程管理和常用消息通道，用于查看任务状态或触发工作流。具体入口与可用通道取决于当前版本和部署配置。',
  },
  {
    question: '生成的结果可以继续编辑和复用吗？',
    answer:
      '可以。文档、表格、代码、图片和视频等结果可在工作区中预览、检查和继续修改，也可以把成熟的操作方式沉淀为助手预设、技能或自动化任务。',
  },
  {
    question: '本地文件和模型服务之间的数据边界是什么？',
    answer:
      '本地文件默认在你选择的工作区中管理。任务是否会把内容发送给外部模型服务，取决于所选模型、服务商和权限配置；处理敏感资料前应确认对应服务的数据政策与工作区权限。',
  },
]

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="LokSystem 首页">
      <img src="/brand/app-icon.png" alt="" />
      <span>LokSystem</span>
    </a>
  )
}

function App() {
  useEffect(() => {
    const viewBeacon = new Image()
    viewBeacon.src =
      'https://api.lokai.net.cn/telemetry/website-view.gif?page=homepage'
  }, [])

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(0)
  const [selectedReleaseId, setSelectedReleaseId] =
    useState<ReleaseId>('windows-x64')
  const selectedRelease =
    releases.find((item) => item.id === selectedReleaseId) ?? release

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="site-shell">
      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="主导航">
          <a href="#capabilities" onClick={closeMenu}>核心能力</a>
          <a href="#workflow" onClick={closeMenu}>任务交互</a>
          <a href="#scenarios" onClick={closeMenu}>使用场景</a>
          <a href="#faq" onClick={closeMenu}>常见问题</a>
          <a className="nav-download" href="#download" onClick={closeMenu}>
            <Download size={16} aria-hidden="true" />
            立即下载
          </a>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? '关闭导航' : '打开导航'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <div className="version-pill">
            <span aria-hidden="true" />
            Windows 与 macOS · v{release.version}
          </div>
          <h1>LokSystem</h1>
          <p className="hero-title">为执行真实任务而生的 AI Agent 统一协作工作台</p>
          <p className="hero-lede">
            把模型、智能体、技能和本地文件放进同一个工作区，覆盖文档、表格、代码、图片与视频生成，让 AI 从理解需求走向多模态交付。
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#download">
              <Download size={19} aria-hidden="true" />
              选择下载版本
            </a>
          </div>
          <div className="hero-proof" aria-label="产品特性">
            <span><Check size={15} />本地优先</span>
            <span><Check size={15} />多 Agent 协作</span>
            <span><Check size={15} />图片生成</span>
            <span><Check size={15} />视频生成</span>
          </div>
        </div>

        <div className="product-showcase" aria-label="LokSystem 产品界面">
          <figure className="product-visual">
            <div className="visual-caption">
              <span className="visual-brand"><span aria-hidden="true" />LokSystem Desktop</span>
              <span className="visual-meta">Workspace / v{release.version}</span>
            </div>
            <img
              src="/product/loksystem-app-screenshot.png"
              alt="LokSystem 桌面工作台实际界面，包含模型、技能、任务和本地文件入口"
            />
          </figure>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section className="capability-section section" id="capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading">
          <p className="eyebrow">核心能力</p>
          <h2 id="capabilities-title">不只是对话，<br />而是完整的任务交互</h2>
          <p>模型、Agent、文件上下文、工具调用和最终交付都在同一工作区中呈现，便于检查、继续编辑和复用。</p>
        </div>
        <div className="capability-list">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon
            return (
              <article className="capability-item" key={capability.title}>
                <span className="item-number">0{index + 1}</span>
                <div className="icon-box"><Icon aria-hidden="true" /></div>
                <div>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <span className="item-detail">{capability.detail}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="workflow-band" id="workflow" aria-labelledby="workflow-title">
        <div className="section workflow-inner">
          <div className="section-heading light">
            <p className="eyebrow">任务交互</p>
            <h2 id="workflow-title">从上下文到交付，<br />每一步都看得见</h2>
            <p>你始终知道 Agent 正在使用什么、修改什么，以及最终产物放在哪里。</p>
          </div>
          <div className="workflow-steps">
            {workflow.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.step}>
                  <div className="step-top">
                    <span>{item.step}</span>
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="team-section section" aria-labelledby="team-title">
        <div className="team-copy">
          <p className="eyebrow">团队协作</p>
          <h2 id="team-title">一个任务，多个 Agent 协同推进</h2>
          <p>Leader 负责拆解和回收，成员 Agent 并行处理研究、开发和内容任务。共享工作区让上下文、文件与成果保持在同一条主线上。</p>
          <ul>
            <li><Check />并行执行多个子任务</li>
            <li><Check />Leader 统一回收阶段结果</li>
            <li><Check />共享文件与任务上下文</li>
          </ul>
        </div>
        <div className="team-flow" aria-label="Team Mode 协作流程示意">
          <div className="leader-node">
            <span>主任务</span>
            <strong>Leader Agent</strong>
            <small>拆解 · 分派 · 回收</small>
          </div>
          <div className="flow-line" aria-hidden="true" />
          <div className="member-grid">
            <div><Code2 /><strong>开发 Agent</strong><span>接口与实现</span></div>
            <div><MonitorUp /><strong>研究 Agent</strong><span>资料与验证</span></div>
            <div><Presentation /><strong>内容 Agent</strong><span>文档与交付</span></div>
          </div>
          <div className="flow-status"><Zap size={16} />3 个子任务并行执行</div>
        </div>
      </section>

      <section className="comparison-section section" aria-labelledby="comparison-title">
        <div className="section-heading centered">
          <p className="eyebrow">产品定位</p>
          <h2 id="comparison-title">为什么是 AI Agent 工作台</h2>
          <p>它连接对话、执行和交付，不是另一个孤立的聊天窗口。</p>
        </div>
        <div className="comparison-wrap">
          <table>
            <thead>
              <tr><th>维度</th><th>传统 AI 对话</th><th>单一 CLI 工具</th><th>LokSystem</th></tr>
            </thead>
            <tbody>
              {comparisons.map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={index === 3 ? 'highlight' : ''}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="scenario-section section" id="scenarios" aria-labelledby="scenario-title">
        <div className="section-heading">
          <p className="eyebrow">使用场景</p>
          <h2 id="scenario-title">先解决高频任务，再沉淀团队能力</h2>
        </div>
        <div className="scenario-grid">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon
            return (
              <article key={scenario.title}>
                <Icon aria-hidden="true" />
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
                <span>{scenario.meta}</span>
              </article>
            )
          })}
        </div>
      </section>

      <section className="download-section" id="download" aria-labelledby="download-title">
        <div className="section download-inner">
          <div className="download-main">
            <p className="eyebrow">下载中心</p>
            <h2 id="download-title">下载 LokSystem</h2>
            <p>提供 Windows x64、macOS Apple 芯片与 macOS Intel 版本。</p>
            <div className="platform-selector" role="group" aria-label="选择下载平台">
              {releases.map((item) => {
                const Icon = item.icon
                const selected = item.id === selectedReleaseId
                return (
                  <button
                    type="button"
                    aria-pressed={selected}
                    className={selected ? 'selected' : ''}
                    onClick={() => setSelectedReleaseId(item.id)}
                    key={item.id}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.platform}</span>
                  </button>
                )
              })}
            </div>
            <div className="download-actions">
              <a
                className="button primary"
                href={trackedDownloadUrl(selectedRelease.id, 'download_section')}
              >
                <Download size={19} />下载 {selectedRelease.platform}
              </a>
            </div>
            {selectedRelease.id !== 'windows-x64' && (
              <p className="release-note">
                当前 macOS 测试版使用临时签名，尚未完成 Apple 公证。
              </p>
            )}
          </div>
          <div className="release-panel">
            <div className="release-panel-head">
              <div><span>{selectedRelease.status}</span><strong>v{selectedRelease.version}</strong></div>
              <span className="ready"><span />可下载</span>
            </div>
            <dl>
              <div><dt>平台</dt><dd>{selectedRelease.platform}</dd></div>
              <div><dt>架构</dt><dd>{selectedRelease.architecture}</dd></div>
              <div><dt>文件</dt><dd>{selectedRelease.fileName}</dd></div>
              <div><dt>大小</dt><dd>{selectedRelease.fileSize}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="faq-section section" id="faq" aria-labelledby="faq-title">
        <div className="section-heading">
          <p className="eyebrow">常见问题</p>
          <h2 id="faq-title">全面了解 LokSystem 的能力</h2>
        </div>
        <div className="faq-form">
          <label htmlFor="faq-question">选择你想了解的问题</label>
          <div className="faq-select-wrap">
            <select
              id="faq-question"
              value={activeFaq}
              onChange={(event) => setActiveFaq(Number(event.target.value))}
            >
              {faqs.map((faq, index) => (
                <option value={index} key={faq.question}>{faq.question}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" />
          </div>
          <article className="faq-answer" aria-live="polite">
            <span>问题 {String(activeFaq + 1).padStart(2, '0')} / {faqs.length}</span>
            <h3>{faqs[activeFaq].question}</h3>
            <p>{faqs[activeFaq].answer}</p>
          </article>
        </div>
      </section>

      <section className="final-cta">
        <div>
          <Sparkles aria-hidden="true" />
          <h2>让 AI 开始推进真实任务</h2>
          <p>下载 LokSystem，把模型、Agent、技能和本地文件放进同一个工作区。</p>
        </div>
        <a className="button light-button" href="#download">
          <Download size={19} />查看全部版本
        </a>
      </section>

      <footer className="site-footer">
        <div><Brand /><span>© 2026 LokSystem</span></div>
        <nav aria-label="法律与发布链接">
          <a href="/legal/user-agreement/">用户协议</a>
          <a href="/legal/privacy-policy/">隐私政策</a>
          <a href="mailto:lok24357@gmail.com">问题反馈</a>
          <a href="https://beian.miit.gov.cn/">粤ICP备2026107083号</a>
        </nav>
      </footer>
    </main>
  )
}

export default App
