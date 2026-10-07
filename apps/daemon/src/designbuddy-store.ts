// DesignBuddy demo layer persistence: the selected workspace role and the
// design review queue. The marketing/demo pages under apps/web/public
// (login.html, role.html, studio.html) read and write these tables through
// the daemon's /api/db/* routes so the role picker, the project list, and the
// PM review queue survive page reloads and browser storage clears — the same
// SQLite database (.od/app.sqlite) that owns projects and conversations.

import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import {
  DESIGNER_COMMERCIAL_STARTERS,
  enhanceLegacyStarterHtml,
} from './designbuddy-commercial-projects.js';
import {
  DESIGNBUDDY_ROLE_STARTERS,
  type DesignBuddyOperationalRole,
  type DesignBuddyRoleStarterBlueprint,
} from './designbuddy-role-projects.js';

type SqliteDb = Database.Database;
type DbRow = Record<string, any>;

export const DESIGNBUDDY_ROLES = ['designer', 'pm', 'dev', 'admin'] as const;
export type DesignBuddyRole = (typeof DESIGNBUDDY_ROLES)[number];

export const DESIGNBUDDY_REVIEW_STATUS_TRANSITIONS = ['pass', 'reject'] as const;
export type DesignBuddyReviewStatus = 'wait' | 'pass' | 'reject';

export interface DesignBuddyReview {
  id: string;
  title: string;
  author: string;
  status: DesignBuddyReviewStatus;
  note: string | null;
  projectId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface DesignBuddyStats {
  projects: number;
  prompts: number;
  promptsThisMonth: number;
  pendingReviews: number;
  quotaTotal: number;
  quotaUsed: number;
  trend: number[];
}

export interface DesignBuddyProfile {
  displayName: string | null;
  hasProfile: boolean;
  mode: 'local-workspace';
}

/* ── AI 生成过程事件流（studio.html 生成视图的持久化）──
   Append-only log per project: user prompts, engine replies, progress steps,
   generated artifacts (self-contained HTML) and finish/stop markers. The
   static studio page replays this log into the chat pane + design-files pane
   so a generation session survives reloads. */

export const DESIGNBUDDY_GEN_EVENT_TYPES = [
  'user',
  'ai',
  'step',
  'artifact',
  'done',
  'stop',
] as const;
export type DesignBuddyGenEventType = (typeof DESIGNBUDDY_GEN_EVENT_TYPES)[number];

/** JSON payload cap per event; generous enough for a full artifact HTML doc. */
export const DESIGNBUDDY_GEN_PAYLOAD_LIMIT = 400_000;

export interface DesignBuddyGenEvent {
  id: string;
  projectId: string;
  seq: number;
  type: DesignBuddyGenEventType;
  payload: Record<string, any> | null;
  createdAt: number;
}

export interface DesignBuddyGenSummary {
  projectId: string;
  status: 'running' | 'succeeded' | 'stopped';
  artifactCount: number;
  latestVersion: number | null;
  kind: string | null;
  name: string | null;
  html: string | null;
  updatedAt: number;
}

export interface DesignBuddyStarterStatus {
  role: DesignBuddyRole;
  initialized: boolean;
  version: number;
  projectIds: string[];
  createdProjectIds: string[];
}

const DESIGNER_STARTER_VERSION = 3;
const ROLE_STARTER_VERSION = 1;
const DESIGNER_STARTER_PREF = 'starter-projects:designer';

function starterPreferenceKey(role: DesignBuddyRole): string {
  return `starter-projects:${role}`;
}

function starterVersionForRole(role: DesignBuddyRole): number {
  return role === 'designer' ? DESIGNER_STARTER_VERSION : ROLE_STARTER_VERSION;
}

interface DesignerStarterBlueprint {
  key: string;
  name: string;
  mode: 'landing' | 'app' | 'deck' | 'poster' | 'dashboard' | 'design-system';
  prompt: string;
  html: string;
  interactive?: boolean;
}

const STARTER_BASE_CSS = `
  *{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:#152019;background:#f5f5ef}
  body{line-height:1.5}.top{height:64px;padding:0 6vw;display:flex;align-items:center;border-bottom:1px solid #dfe5dc;background:rgba(255,255,255,.82);backdrop-filter:blur(18px);position:relative;z-index:2}
  .brand{display:flex;align-items:center;gap:10px;font-weight:850;letter-spacing:-.02em}.mark{width:30px;height:30px;border-radius:10px;background:#18221b;color:#a4f584;display:grid;place-items:center;font-size:13px}
  .nav{margin-left:auto;display:flex;gap:25px;color:#68736c;font-size:13px}.shell{width:min(1120px,88vw);margin:0 auto}.eyebrow{font-size:12px;font-weight:850;letter-spacing:.14em;text-transform:uppercase;color:#4f9135}
  h1,h2,h3,p{margin-top:0}.muted{color:#68736c}.pill{display:inline-flex;align-items:center;padding:7px 12px;border-radius:999px;background:#e8f6df;color:#477b32;font-size:12px;font-weight:750}
  .btn{border:0;border-radius:12px;padding:12px 18px;background:#18221b;color:#fff;font:750 13px inherit}.btn.lime{background:#8be85d;color:#152019}.btn.ghost{background:#fff;color:#253029;border:1px solid #dce3da}
  .card{background:rgba(255,255,255,.88);border:1px solid #e0e5de;border-radius:20px;box-shadow:0 18px 42px rgba(47,67,49,.09)}
  @media(max-width:720px){.nav{display:none}.shell{width:min(92vw,1120px)}}`;

function starterDocument(title: string, body: string, extraCss = ''): string {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${STARTER_BASE_CSS}${extraCss}</style></head><body>${body}</body></html>`;
}

const LEGACY_DESIGNER_STARTERS: DesignerStarterBlueprint[] = [
  {
    key: 'designer.brand-site',
    name: '品牌官网改版',
    mode: 'landing',
    prompt: '为新品牌设计一个响应式官网原型，包含品牌主张、核心能力、案例与行动召唤。',
    html: starterDocument(
      '品牌官网改版',
      `<header class="top"><div class="brand"><span class="mark">N</span>NORTHSTAR</div><nav class="nav"><span>产品</span><span>案例</span><span>关于</span><span>联系</span></nav></header>
       <main><section class="hero shell"><div><span class="pill">新一代创意协作平台</span><h1>让每一次灵感<br><em>都成为作品</em></h1><p>从策略到交付，Northstar 将团队、内容与流程连接在一个清晰的创作空间里。</p><div class="actions"><button class="btn lime">免费开始</button><button class="btn ghost">查看案例</button></div></div><div class="hero-art card"><div class="orb"></div><div class="float f1"><b>12 个页面</b><span>设计进度 86%</span></div><div class="float f2"><b>品牌资产</b><span>自动同步完成</span></div><div class="canvas"><span></span><span></span><span></span></div></div></section>
       <section class="proof shell"><span>深受创新团队信赖</span><b>LOOP</b><b>Arc Studio</b><b>MONO</b><b>Fieldwork</b></section>
       <section class="features shell"><article class="card"><i>01</i><h3>从想法到原型</h3><p>用自然语言快速搭建结构完整、可交互的第一版。</p></article><article class="card"><i>02</i><h3>保持品牌一致</h3><p>自动应用设计令牌、组件和内容规范。</p></article><article class="card"><i>03</i><h3>一起完成交付</h3><p>评审、迭代与版本记录都沉淀在同一个项目中。</p></article></section></main>`,
      `.hero{min-height:540px;display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:7vw;padding:70px 0}.hero h1{font-size:clamp(45px,6vw,78px);line-height:1.02;letter-spacing:-.055em;margin:22px 0}.hero h1 em{font-style:normal;color:#58a636}.hero p{max-width:560px;font-size:17px;color:#68736c}.actions{display:flex;gap:10px;margin-top:28px}.hero-art{height:390px;position:relative;overflow:hidden;background:linear-gradient(145deg,#e1f6d5,#d8eef2)}.orb{position:absolute;width:300px;height:300px;border-radius:50%;background:linear-gradient(145deg,#9af06e,#58c6d8);right:-50px;top:-60px;filter:blur(2px)}.canvas{position:absolute;inset:74px 45px 42px;background:#fff;border-radius:18px;padding:28px;display:grid;grid-template-columns:1fr 1fr;gap:13px;box-shadow:0 25px 50px rgba(37,62,46,.18)}.canvas span{border-radius:12px;background:#eef1ed}.canvas span:first-child{grid-column:1/-1;background:#202a23}.float{position:absolute;z-index:2;background:rgba(255,255,255,.92);padding:12px 15px;border-radius:13px;box-shadow:0 12px 30px rgba(32,52,38,.15)}.float b,.float span{display:block}.float span{font-size:11px;color:#758078}.f1{left:16px;top:35px}.f2{right:15px;bottom:20px}.proof{border-top:1px solid #dfe5dc;border-bottom:1px solid #dfe5dc;min-height:86px;display:flex;align-items:center;justify-content:space-between;color:#758078}.proof b{color:#3f4943;letter-spacing:.08em}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:42px 0 70px}.features article{padding:25px}.features i{font-style:normal;color:#5a9a40;font-size:12px}.features h3{margin:16px 0 8px}.features p{color:#68736c;font-size:14px}@media(max-width:720px){.hero{grid-template-columns:1fr;padding-top:45px}.hero-art{height:320px}.proof{gap:18px;overflow:hidden}.features{grid-template-columns:1fr}}`,
    ),
  },
  {
    key: 'designer.member-app',
    name: '会员中心 App',
    mode: 'app',
    prompt: '设计一套移动端会员中心 App，包括会员等级、积分、权益和活动记录。',
    html: starterDocument(
      '会员中心 App',
      `<main class="app-stage"><section class="copy"><span class="eyebrow">MOBILE EXPERIENCE</span><h1>每一份会员权益，<br>都触手可及。</h1><p>清晰呈现等级、积分和专属权益，让会员知道下一步值得期待什么。</p><div class="tags"><span>会员成长</span><span>积分任务</span><span>专属权益</span></div></section><section class="phone"><div class="status"><b>9:41</b><span>● ● ▰</span></div><div class="appbar"><button>‹</button><b>会员中心</b><span>•••</span></div><div class="member-card"><small>AURORA MEMBER</small><h2>晚上好，小鹿</h2><p>铂金会员 · 还差 680 成长值升级</p><div class="meter"><i></i></div><div class="stats"><span><b>2,860</b><small>积分</small></span><span><b>8</b><small>优惠券</small></span><span><b>12</b><small>足迹</small></span></div></div><h3>本月专属权益 <small>查看全部 →</small></h3><div class="benefits"><span>✦<b>双倍积分</b></span><span>◇<b>生日礼遇</b></span><span>☕<b>免费咖啡</b></span><span>↗<b>优先体验</b></span></div><div class="task card"><span class="task-ic">✓</span><div><b>完善个人资料</b><small>完成任务得 100 积分</small></div><button>去完成</button></div><nav class="tabs"><span>⌂<b>首页</b></span><span>◎<b>发现</b></span><span class="on">♢<b>会员</b></span><span>○<b>我的</b></span></nav></section></main>`,
      `.app-stage{min-height:100vh;background:radial-gradient(circle at 20% 20%,#e1f7d7,transparent 34%),#edf0e9;display:grid;grid-template-columns:1fr 410px;gap:8vw;align-items:center;padding:55px 10vw}.copy{max-width:560px}.copy h1{font-size:clamp(42px,5vw,68px);line-height:1.08;letter-spacing:-.05em;margin:18px 0}.copy p{color:#68736c;font-size:17px;max-width:500px}.tags{display:flex;gap:9px;flex-wrap:wrap;margin-top:25px}.tags span{background:#fff;border:1px solid #dce3da;padding:8px 13px;border-radius:999px;font-size:12px}.phone{width:390px;min-height:780px;background:#fbfcf9;border:9px solid #1d261f;border-radius:48px;padding:12px 20px 18px;box-shadow:0 38px 80px rgba(37,54,40,.25);position:relative;overflow:hidden}.status,.appbar{display:flex;align-items:center;justify-content:space-between}.status{font-size:11px;padding:0 8px 10px}.appbar{height:46px}.appbar button{border:0;background:none;font-size:28px}.member-card{background:linear-gradient(140deg,#253129,#4d6c55);color:#fff;border-radius:24px;padding:23px;margin-top:8px;box-shadow:0 18px 35px rgba(42,62,47,.22)}.member-card small{font-size:9px;letter-spacing:.14em}.member-card h2{margin:10px 0 3px}.member-card p{font-size:11px;color:#d6e2d8}.meter{height:5px;background:#ffffff30;border-radius:9px;margin:16px 0}.meter i{display:block;width:72%;height:100%;background:#a4f584;border-radius:9px}.stats{display:grid;grid-template-columns:repeat(3,1fr);text-align:center}.stats span+span{border-left:1px solid #ffffff22}.stats b,.stats small{display:block}.stats small{color:#cad8ce}.phone>h3{font-size:14px;margin:23px 0 12px}.phone>h3 small{float:right;color:#6b776f;font-weight:500}.benefits{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.benefits span{font-size:21px;text-align:center;background:#f0f3ed;border-radius:14px;padding:11px 4px}.benefits b{display:block;font-size:9px;margin-top:6px}.task{display:flex;align-items:center;gap:10px;padding:13px;margin-top:18px;border-radius:15px;box-shadow:none}.task-ic{width:31px;height:31px;border-radius:10px;background:#dff4d4;display:grid;place-items:center}.task div{flex:1}.task b,.task small{display:block;font-size:11px}.task small{color:#7a857d}.task button{border:0;border-radius:9px;background:#1e2821;color:#fff;font-size:9px;padding:7px}.tabs{position:absolute;bottom:0;left:0;right:0;height:70px;background:#fff;border-top:1px solid #e6e9e4;display:grid;grid-template-columns:repeat(4,1fr);padding:9px 14px}.tabs span{text-align:center;color:#919991;font-size:17px}.tabs b{display:block;font-size:9px}.tabs .on{color:#4f9135}@media(max-width:800px){.app-stage{grid-template-columns:1fr;padding:40px 5vw}.copy{display:none}.phone{margin:auto;transform:scale(.9)}}`,
    ),
  },
  {
    key: 'designer.autumn-deck',
    name: '秋季发布会提案',
    mode: 'deck',
    prompt: '制作一份秋季新品发布会提案，讲清主题、产品亮点、体验策略与发布节奏。',
    html: starterDocument(
      '秋季发布会提案',
      `<main class="deck"><section class="slide cover"><div><span>2026 AUTUMN LAUNCH</span><h1>让日常，<br>重新生长。</h1><p>Aurora 秋季新品发布会创意提案</p></div><b>01</b></section><section class="slide idea"><div><span class="eyebrow">THE BIG IDEA</span><h2>科技不该打断生活，<br>而应安静地融入其中。</h2></div><div class="circles"><i></i><i></i><i></i></div><b>02</b></section><section class="slide products"><div><span class="eyebrow">PRODUCT STORY</span><h2>三种产品，<br>一种自然体验。</h2></div><div class="product-grid"><article><i>01</i><h3>Aurora Air</h3><p>更轻、更安静的个人设备</p></article><article><i>02</i><h3>Aurora Home</h3><p>懂得空间节奏的家庭中枢</p></article><article><i>03</i><h3>Aurora Flow</h3><p>连接工作与生活的服务体验</p></article></div><b>03</b></section><section class="slide end"><span>OCTOBER · SHANGHAI</span><h2>一起见证<br>新的生长。</h2><button>查看发布节奏 →</button><b>04</b></section></main>`,
      `body{background:#1a211c}.deck{width:min(1100px,94vw);margin:0 auto;padding:28px 0;display:grid;gap:22px}.slide{aspect-ratio:16/9;border-radius:22px;position:relative;overflow:hidden;padding:7%;display:flex;flex-direction:column;justify-content:center}.slide>b{position:absolute;right:4%;bottom:4%;font-size:12px}.cover{background:#d8efc9}.cover:after{content:"";position:absolute;width:50%;aspect-ratio:1;border-radius:50%;right:-8%;top:-18%;background:linear-gradient(145deg,#73d94d,#b9f397)}.cover div{position:relative;z-index:1}.cover span,.end>span{font-size:11px;letter-spacing:.18em}.cover h1{font-size:clamp(45px,7vw,86px);line-height:1;letter-spacing:-.06em;margin:30px 0}.cover p{color:#546057}.idea{background:#f2efe7;display:grid;grid-template-columns:1.2fr .8fr;align-items:center}.idea h2,.products h2,.end h2{font-size:clamp(34px,5vw,62px);line-height:1.08;letter-spacing:-.045em;margin-top:22px}.circles{position:relative;height:80%}.circles i{position:absolute;border-radius:50%;mix-blend-mode:multiply}.circles i:nth-child(1){width:180px;height:180px;background:#a4f584;top:5%;left:0}.circles i:nth-child(2){width:145px;height:145px;background:#77cbd7;top:38%;left:36%}.circles i:nth-child(3){width:110px;height:110px;background:#ffad7c;top:10%;right:0}.products{background:#e2e6ef}.product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:25px}.product-grid article{background:#ffffff9c;border:1px solid #fff;padding:18px;border-radius:15px}.product-grid i{font-style:normal;font-size:10px}.product-grid h3{margin:25px 0 4px}.product-grid p{font-size:12px;color:#68736c}.end{background:#f1ad80}.end button{width:max-content;border:1px solid #1f2822;background:transparent;padding:11px 16px;border-radius:99px;font-weight:750}.end h2{font-size:clamp(46px,7vw,90px)}@media(max-width:700px){.slide{border-radius:12px}.product-grid{gap:5px}.product-grid article{padding:8px}.product-grid p{display:none}}`,
    ),
  },
  {
    key: 'designer.community-poster',
    name: '社区招募海报',
    mode: 'poster',
    prompt: '设计一张社区设计师招募海报，突出开放协作、活动日期和报名行动。',
    html: starterDocument(
      '社区招募海报',
      `<main class="poster"><header><span>OPEN CALL · 2026</span><span>SHENZHEN / ONLINE</span></header><section><div class="star">✦</div><p>寻找愿意一起<br>创造新可能的人</p><h1>设计社区<br><em>招募计划</em></h1></section><footer><div><b>10.18 — 11.08</b><span>作品分享 · 设计共创 · 城市漫游</span></div><button>立即加入 ↗</button><div class="code">DB<br>26</div></footer></main>`,
      `body{background:#c9f5ad}.poster{min-height:100vh;padding:5vh 5vw;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 75% 38%,#fff7b1 0 11%,transparent 11.5%),linear-gradient(115deg,transparent 0 62%,#8ed8df 62% 100%);position:relative;overflow:hidden}.poster:before{content:"";position:absolute;width:42vw;height:42vw;border:2px solid #17221a;border-radius:50%;right:-7vw;top:16vh}.poster header,.poster footer{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:800;letter-spacing:.12em;position:relative;z-index:1}.poster section{position:relative;z-index:1}.poster section p{font-size:clamp(13px,1.5vw,19px);font-weight:700;margin:0 0 2vh 1vw}.poster h1{font-size:clamp(62px,11vw,150px);line-height:.82;letter-spacing:-.075em;margin:0;text-transform:uppercase}.poster h1 em{font-style:normal;-webkit-text-stroke:2px #17221a;color:transparent}.star{position:absolute;right:9%;top:-5%;font-size:clamp(50px,8vw,110px);animation:spin 12s linear infinite}.poster footer>div:first-child{display:flex;flex-direction:column;gap:6px}.poster footer b{font-size:17px}.poster footer span{font-size:10px}.poster button{border:0;background:#17221a;color:#fff;padding:15px 24px;border-radius:99px;font-weight:800}.code{width:60px;height:60px;border:2px solid #17221a;display:grid;place-items:center;text-align:center;line-height:1.05;font-size:14px}@keyframes spin{to{transform:rotate(360deg)}}`,
    ),
  },
  {
    key: 'designer.growth-dashboard',
    name: '增长指标 Dashboard',
    mode: 'dashboard',
    prompt: '设计一个增长指标 Dashboard，展示关键指标、趋势、渠道表现和转化漏斗。',
    html: starterDocument(
      '增长指标 Dashboard',
      `<main class="dash"><aside><div class="brand"><span class="mark">A</span>Aurora</div><nav><b>概览</b><span>增长分析</span><span>用户分群</span><span>转化漏斗</span><span>活动管理</span></nav><div class="profile"><i>鹿</i><span><b>小鹿</b><small>Growth Team</small></span></div></aside><section class="content"><header><div><span class="eyebrow">ANALYTICS</span><h1>增长概览</h1></div><button class="btn ghost">过去 30 天⌄</button></header><div class="kpis"><article class="card"><span>活跃用户</span><b>128,430</b><small class="up">↗ 18.2%</small></article><article class="card"><span>新增用户</span><b>24,892</b><small class="up">↗ 12.6%</small></article><article class="card"><span>转化率</span><b>8.42%</b><small>↘ 0.4%</small></article><article class="card"><span>客单价</span><b>¥ 286</b><small class="up">↗ 6.8%</small></article></div><div class="boards"><article class="card chart"><div class="head"><b>用户增长趋势</b><span>● 新增　● 活跃</span></div><div class="plot"><i style="height:35%"></i><i style="height:48%"></i><i style="height:42%"></i><i style="height:61%"></i><i style="height:58%"></i><i style="height:78%"></i><i style="height:88%"></i><i style="height:82%"></i><i style="height:96%"></i></div><div class="axis"><span>9/01</span><span>9/08</span><span>9/15</span><span>9/22</span><span>9/30</span></div></article><article class="card funnel"><b>转化漏斗</b><div><span style="width:100%">访问 100%</span><span style="width:76%">注册 76%</span><span style="width:49%">激活 49%</span><span style="width:28%">付费 28%</span></div></article></div><article class="card channels"><div class="head"><b>渠道表现</b><button>查看全部 →</button></div><table><tr><th>渠道</th><th>访问量</th><th>转化率</th><th>趋势</th></tr><tr><td>自然搜索</td><td>48,290</td><td>9.8%</td><td class="up">+18%</td></tr><tr><td>内容社区</td><td>32,104</td><td>8.5%</td><td class="up">+12%</td></tr><tr><td>合作伙伴</td><td>18,620</td><td>7.1%</td><td>+3%</td></tr></table></article></section></main>`,
      `body{background:#eef1ec}.dash{min-height:100vh;display:grid;grid-template-columns:220px 1fr}.dash aside{background:#1c251f;color:#dfe8e1;padding:28px 20px;display:flex;flex-direction:column}.dash aside .brand{font-size:16px}.dash aside nav{display:flex;flex-direction:column;gap:8px;margin-top:48px}.dash aside nav>*{padding:11px 13px;border-radius:10px;font-size:12px}.dash aside nav b{background:#a4f584;color:#172019}.dash aside nav span{color:#aeb9b1}.profile{margin-top:auto;display:flex;gap:10px;align-items:center}.profile i{width:34px;height:34px;border-radius:12px;background:#ffad7c;color:#222;display:grid;place-items:center;font-style:normal}.profile b,.profile small{display:block;font-size:11px}.profile small{color:#8f9b92}.content{padding:32px 3vw;min-width:0}.content>header{display:flex;justify-content:space-between;align-items:center}.content h1{font-size:28px;margin:5px 0}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:22px 0}.kpis article{padding:18px;box-shadow:none}.kpis span,.kpis small{font-size:11px;color:#77827a}.kpis b{display:block;font-size:25px;margin:10px 0 4px}.up{color:#4f9a31!important}.boards{display:grid;grid-template-columns:1.55fr .75fr;gap:13px}.boards article{padding:19px;box-shadow:none}.head{display:flex;justify-content:space-between;align-items:center}.head span{font-size:9px;color:#77827a}.plot{height:190px;border-bottom:1px solid #dfe5dc;display:flex;align-items:end;gap:3.5%;padding:20px 2% 0}.plot i{flex:1;background:linear-gradient(#8be85d,#dff5d5);border-radius:7px 7px 0 0}.axis{display:flex;justify-content:space-between;font-size:9px;color:#879189;margin-top:8px}.funnel>div{display:flex;flex-direction:column;align-items:center;gap:7px;margin-top:27px}.funnel span{display:block;text-align:center;background:#dff4d4;border-radius:7px;padding:8px;font-size:10px}.funnel span:nth-child(2){background:#bfeaa9}.funnel span:nth-child(3){background:#9bda7c}.funnel span:nth-child(4){background:#6eba4e}.channels{margin-top:13px;padding:19px;box-shadow:none}.channels button{border:0;background:none;color:#568b41;font-size:10px}table{width:100%;border-collapse:collapse;margin-top:12px;font-size:11px}th,td{text-align:left;border-top:1px solid #edf0eb;padding:10px}@media(max-width:850px){.dash{grid-template-columns:70px 1fr}.dash aside .brand{font-size:0}.dash aside nav span,.profile span{display:none}.kpis{grid-template-columns:1fr 1fr}.boards{grid-template-columns:1fr}}`,
    ),
  },
  {
    key: 'designer.aurora-system',
    name: 'Aurora 设计系统',
    mode: 'design-system',
    prompt: '创建 Aurora 产品设计系统，定义色彩、字体、间距以及常用组件规范。',
    html: starterDocument(
      'Aurora 设计系统',
      `<header class="top"><div class="brand"><span class="mark">A</span>Aurora Design</div><nav class="nav"><b>Foundations</b><span>Components</span><span>Patterns</span><span>Resources</span></nav></header><main class="ds shell"><section class="intro"><span class="eyebrow">DESIGN SYSTEM · V1.0</span><h1>清晰、一致，<br>又保留温度。</h1><p>Aurora 是面向多端产品的设计语言，让每一位设计师和开发者更快做出可靠体验。</p></section><section class="block"><div class="block-head"><span>01</span><h2>Color</h2><p>自然中性色构成界面基础，鲜活绿用于关键操作与成功反馈。</p></div><div class="swatches"><article style="--c:#18221b"><i></i><b>Ink</b><small>#18221B</small></article><article style="--c:#8BE85D"><i></i><b>Aurora</b><small>#8BE85D</small></article><article style="--c:#F5F5EF"><i></i><b>Canvas</b><small>#F5F5EF</small></article><article style="--c:#78C9D4"><i></i><b>Sky</b><small>#78C9D4</small></article><article style="--c:#FFAD7C"><i></i><b>Warmth</b><small>#FFAD7C</small></article></div></section><section class="block type"><div class="block-head"><span>02</span><h2>Typography</h2><p>高对比标题建立性格，正文保持舒适、稳定的阅读节奏。</p></div><div><h2>Aurora Display 56</h2><h3>Product Heading 28</h3><p>正文 Body 16 — 设计不是装饰，而是让复杂的事情变得清晰。</p><small>Caption 12 / Metadata and helper text</small></div></section><section class="block"><div class="block-head"><span>03</span><h2>Components</h2><p>组件使用一致的圆角、层级和交互反馈。</p></div><div class="components card"><div><small>BUTTONS</small><p><button class="btn lime">Primary action</button> <button class="btn">Secondary</button> <button class="btn ghost">Ghost</button></p></div><div><small>FORM</small><label>Email address<input value="hello@aurora.design"></label></div><div><small>STATUS</small><p><span class="badge good">● Ready</span><span class="badge warn">● Review</span><span class="badge neutral">Draft</span></p></div></div></section></main>`,
      `.ds{padding:75px 0}.intro{max-width:760px;margin-bottom:90px}.intro h1{font-size:clamp(48px,7vw,88px);line-height:1;letter-spacing:-.06em;margin:20px 0}.intro p{max-width:620px;color:#68736c;font-size:17px}.block{border-top:1px solid #dce3da;padding:35px 0 60px;display:grid;grid-template-columns:280px 1fr;gap:6vw}.block-head>span{font-size:11px;color:#59953f}.block-head h2{font-size:30px;margin:10px 0}.block-head p{font-size:13px;color:#68736c}.swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.swatches article i{display:block;height:150px;border-radius:16px;background:var(--c);margin-bottom:10px}.swatches b,.swatches small{display:block;font-size:11px}.swatches small{color:#7b867e}.type>div:last-child h2{font-size:48px;letter-spacing:-.045em;margin:0 0 30px}.type>div:last-child h3{font-size:28px;margin:0 0 24px}.type>div:last-child p{font-size:16px}.type>div:last-child small{color:#7a857d}.components{padding:28px;display:grid;grid-template-columns:1.2fr 1fr .8fr;gap:28px;box-shadow:none}.components>div>small{font-size:9px;letter-spacing:.12em;color:#79837c}.components input{display:block;width:100%;border:1px solid #d7ded5;border-radius:10px;padding:11px;margin-top:7px;font:13px inherit}.components label{font-size:11px;font-weight:700}.badge{display:inline-flex;padding:6px 9px;border-radius:99px;font-size:10px;margin:3px}.good{background:#e3f7d8;color:#477c32}.warn{background:#fff0d6;color:#8b641c}.neutral{background:#ecefeb;color:#637068}@media(max-width:800px){.block{grid-template-columns:1fr}.swatches article i{height:90px}.components{grid-template-columns:1fr}}`,
    ),
  },
];

const DESIGNER_STARTERS: DesignerStarterBlueprint[] = [
  ...LEGACY_DESIGNER_STARTERS,
  ...DESIGNER_COMMERCIAL_STARTERS,
];

function starterArtifactHtml(starter: DesignerStarterBlueprint): string {
  return starter.interactive
    ? starter.html
    : enhanceLegacyStarterHtml(starter.html, starter.name);
}

const SEED_REVIEWS: Array<{ title: string; author: string; status: DesignBuddyReviewStatus; ageHours: number }> = [
  { title: '官网首页改版', author: '小鹿', status: 'wait', ageHours: 2 },
  { title: '注册流程 v2', author: '阿明', status: 'wait', ageHours: 5 },
  { title: 'Q3 路演演示', author: 'Momo', status: 'wait', ageHours: 26 },
  { title: '移动端改版', author: 'Kevin', status: 'pass', ageHours: 30 },
  { title: '品牌手册', author: 'Lin', status: 'pass', ageHours: 50 },
  { title: '数据看板原型', author: '阿杰', status: 'pass', ageHours: 74 },
];

export function migrateDesignBuddy(db: SqliteDb): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS designbuddy_prefs (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS designbuddy_reviews (
      id         TEXT PRIMARY KEY,
      title      TEXT NOT NULL,
      author     TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'wait',
      note       TEXT,
      project_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_designbuddy_reviews_status
      ON designbuddy_reviews(status, updated_at DESC);

    CREATE TABLE IF NOT EXISTS designbuddy_gen (
      id         TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      seq        INTEGER NOT NULL,
      type       TEXT NOT NULL,
      payload    TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_designbuddy_gen_project
      ON designbuddy_gen(project_id, seq);

    CREATE TRIGGER IF NOT EXISTS trg_designbuddy_gen_project_delete
      AFTER DELETE ON projects
      BEGIN
        DELETE FROM designbuddy_gen WHERE project_id = OLD.id;
      END;
  `);
  const count = (db.prepare('SELECT COUNT(*) AS c FROM designbuddy_reviews').get() as DbRow).c;
  if (count > 0) return;
  // Seed the queue once so the PM home has real rows to act on. After the
  // seed, every mutation comes from the UI and lives only in the database.
  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO designbuddy_reviews (id, title, author, status, note, project_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, NULL, NULL, ?, ?)`,
  );
  db.transaction(() => {
    for (const review of SEED_REVIEWS) {
      const at = now - review.ageHours * 3_600_000;
      insert.run(randomUUID(), review.title, review.author, review.status, at, at);
    }
  })();
}

export function readDesignBuddyRole(db: SqliteDb): { role: DesignBuddyRole | null; hasRole: boolean } {
  const row = db
    .prepare(`SELECT value FROM designbuddy_prefs WHERE key = 'role'`)
    .get() as DbRow | undefined;
  const value = row?.value;
  if ((DESIGNBUDDY_ROLES as readonly string[]).includes(value)) {
    return { role: value as DesignBuddyRole, hasRole: true };
  }
  return { role: null, hasRole: false };
}

export function setDesignBuddyRole(db: SqliteDb, role: DesignBuddyRole): DesignBuddyRole {
  db.prepare(
    `INSERT INTO designbuddy_prefs (key, value, updated_at) VALUES ('role', ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  ).run(role, Date.now());
  return role;
}

export function readDesignBuddyProfile(db: SqliteDb): DesignBuddyProfile {
  const row = db
    .prepare(`SELECT value FROM designbuddy_prefs WHERE key = 'profile:display-name'`)
    .get() as DbRow | undefined;
  const displayName = typeof row?.value === 'string' && row.value.trim()
    ? row.value.trim().replace(/\s+/g, ' ').slice(0, 60)
    : null;
  return { displayName, hasProfile: displayName !== null, mode: 'local-workspace' };
}

export function setDesignBuddyProfile(db: SqliteDb, displayName: string): DesignBuddyProfile {
  const normalized = displayName.trim().replace(/\s+/g, ' ').slice(0, 60);
  if (!normalized) throw new Error('displayName is required');
  db.prepare(
    `INSERT INTO designbuddy_prefs (key, value, updated_at) VALUES ('profile:display-name', ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  ).run(normalized, Date.now());
  return { displayName: normalized, hasProfile: true, mode: 'local-workspace' };
}

function parseStarterPreference(value: unknown): {
  version: number;
  projectIds: string[];
  starterKeys: string[];
} {
  if (typeof value !== 'string' || !value) return { version: 0, projectIds: [], starterKeys: [] };
  try {
    const parsed = JSON.parse(value) as {
      version?: unknown;
      projectIds?: unknown;
      starterKeys?: unknown;
    };
    return {
      version: Number.isFinite(Number(parsed.version)) ? Number(parsed.version) : 0,
      projectIds: Array.isArray(parsed.projectIds)
        ? parsed.projectIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
        : [],
      starterKeys: Array.isArray(parsed.starterKeys)
        ? parsed.starterKeys.filter((key): key is string => typeof key === 'string' && key.length > 0)
        : [],
    };
  } catch {
    const version = Number(value);
    return { version: Number.isFinite(version) ? version : 0, projectIds: [], starterKeys: [] };
  }
}

export function readDesignBuddyStarterStatus(db: SqliteDb, role: DesignBuddyRole): DesignBuddyStarterStatus {
  const row = db.prepare(`SELECT value FROM designbuddy_prefs WHERE key = ?`).get(starterPreferenceKey(role)) as
    | DbRow
    | undefined;
  const parsed = parseStarterPreference(row?.value);
  return {
    role,
    initialized: parsed.version >= starterVersionForRole(role),
    version: parsed.version,
    projectIds: parsed.projectIds,
    createdProjectIds: [],
  };
}

function initializeOperationalRoleStarterProjects(
  db: SqliteDb,
  role: DesignBuddyOperationalRole,
): DesignBuddyStarterStatus {
  const current = readDesignBuddyStarterStatus(db, role);
  if (current.initialized) return current;

  const starters = DESIGNBUDDY_ROLE_STARTERS[role] as readonly DesignBuddyRoleStarterBlueprint[];
  const preferenceKey = starterPreferenceKey(role);
  const preferenceRow = db.prepare(`SELECT value FROM designbuddy_prefs WHERE key = ?`).get(preferenceKey) as
    | DbRow
    | undefined;
  const preference = parseStarterPreference(preferenceRow?.value);
  const existingStarterByKey = new Map<string, string>();
  const existingRows = db
    .prepare(`SELECT id, metadata_json AS metadataJson FROM projects`)
    .all() as Array<{ id: string; metadataJson: string | null }>;
  for (const row of existingRows) {
    try {
      const metadata = JSON.parse(row.metadataJson || '{}') as Record<string, any>;
      if (
        metadata.source === 'starter-project'
        && metadata.designBuddyRole === role
        && typeof metadata.starterKey === 'string'
      ) {
        existingStarterByKey.set(metadata.starterKey, row.id);
      }
    } catch {
      // Malformed user metadata is never treated as a role starter.
    }
  }

  const completedKeys = new Set(preference.starterKeys);
  existingStarterByKey.forEach((_id, key) => completedKeys.add(key));
  const projectIds = Array.from(new Set([
    ...preference.projectIds,
    ...Array.from(existingStarterByKey.values()),
  ]));
  const createdProjectIds: string[] = [];
  const now = Date.now();
  const insertProject = db.prepare(
    `INSERT INTO projects
       (id, name, skill_id, design_system_id, pending_prompt, metadata_json, created_at, updated_at)
     VALUES (?, ?, NULL, NULL, NULL, ?, ?, ?)`,
  );
  const insertEvent = db.prepare(
    `INSERT INTO designbuddy_gen (id, project_id, seq, type, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const writePreference = db.prepare(
    `INSERT INTO designbuddy_prefs (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  );

  db.transaction(() => {
    starters.forEach((starter, index) => {
      if (completedKeys.has(starter.key)) return;
      const projectId = `db-starter-${randomUUID()}`;
      const projectAt = now - (starters.length - index - 1) * 3_600_000 - 5_000;
      const metadata = {
        designBuddyRole: role,
        designBuddyMode: starter.mode,
        source: 'starter-project',
        starterKey: starter.key,
        starterVersion: ROLE_STARTER_VERSION,
      };
      const eventSpecs: Array<{ type: DesignBuddyGenEventType; payload: Record<string, any> }> = [
        { type: 'user', payload: { text: starter.prompt } },
        { type: 'ai', payload: { text: `收到，我会把「${starter.name}」整理成可执行、可回放的角色工作区。` } },
        { type: 'step', payload: { text: '梳理目标、范围、关键记录与验收状态' } },
        { type: 'step', payload: { text: '建立角色专属信息架构与响应式工作流' } },
        { type: 'step', payload: { text: '连接导航、指标、记录详情和推进反馈' } },
        {
          type: 'artifact',
          payload: {
            name: starter.name,
            version: 1,
            kind: starter.mode,
            html: starter.html,
            interactive: true,
          },
        },
        { type: 'ai', payload: { text: '角色项目已保存。打开设计文件即可滚动查看并操作各项工作流。' } },
        { type: 'done', payload: { version: 1, kind: starter.mode } },
      ];
      const finalAt = projectAt + eventSpecs.length * 1000;
      insertProject.run(projectId, starter.name, JSON.stringify(metadata), projectAt, finalAt);
      eventSpecs.forEach((event, seqIndex) => {
        insertEvent.run(
          randomUUID(),
          projectId,
          seqIndex + 1,
          event.type,
          JSON.stringify(event.payload),
          projectAt + (seqIndex + 1) * 1000,
        );
      });
      completedKeys.add(starter.key);
      projectIds.push(projectId);
      createdProjectIds.push(projectId);
    });
    writePreference.run(
      preferenceKey,
      JSON.stringify({
        version: ROLE_STARTER_VERSION,
        projectIds: Array.from(new Set(projectIds)),
        starterKeys: starters.map((starter) => starter.key),
      }),
      now,
    );
  })();

  return {
    role,
    initialized: true,
    version: ROLE_STARTER_VERSION,
    projectIds: Array.from(new Set(projectIds)),
    createdProjectIds,
  };
}

/**
 * Materialize each role's showcase as persisted projects with replayable v1
 * artifacts. Designer version 3 contains the 56 commercial experiences;
 * Product, Developer, and Admin each receive six role-specific workspaces.
 * User projects and intentionally deleted starters remain untouched.
 */
export function initializeDesignBuddyStarterProjects(db: SqliteDb, role: DesignBuddyRole): DesignBuddyStarterStatus {
  if (role !== 'designer') return initializeOperationalRoleStarterProjects(db, role);
  const current = readDesignBuddyStarterStatus(db, role);
  if (current.initialized) return current;

  const preferenceRow = db.prepare(`SELECT value FROM designbuddy_prefs WHERE key = ?`).get(DESIGNER_STARTER_PREF) as
    | DbRow
    | undefined;
  const preference = parseStarterPreference(preferenceRow?.value);
  const existingStarterByKey = new Map<string, { id: string; metadata: Record<string, any> }>();
  const existingRows = db
    .prepare(`SELECT id, metadata_json AS metadataJson FROM projects`)
    .all() as Array<{ id: string; metadataJson: string | null }>;
  for (const row of existingRows) {
    try {
      const metadata = JSON.parse(row.metadataJson || '{}') as Record<string, any>;
      if (metadata.source === 'starter-project' && typeof metadata.starterKey === 'string') {
        existingStarterByKey.set(metadata.starterKey, { id: row.id, metadata });
      }
    } catch {
      // User projects may contain legacy or malformed metadata. They are never
      // considered starter rows and must remain untouched by this migration.
    }
  }

  const completedKeys = new Set(preference.starterKeys);
  if (preference.version >= 1) {
    LEGACY_DESIGNER_STARTERS.forEach((starter) => completedKeys.add(starter.key));
  }
  existingStarterByKey.forEach((_row, key) => completedKeys.add(key));

  const createdProjectIds: string[] = [];
  const projectIds = Array.from(new Set([
    ...preference.projectIds,
    ...Array.from(existingStarterByKey.values()).map((row) => row.id),
  ]));
  const now = Date.now();
  const insertProject = db.prepare(
    `INSERT INTO projects
       (id, name, skill_id, design_system_id, pending_prompt, metadata_json, created_at, updated_at)
     VALUES (?, ?, NULL, NULL, NULL, ?, ?, ?)`,
  );
  const insertEvent = db.prepare(
    `INSERT INTO designbuddy_gen (id, project_id, seq, type, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const selectArtifactEvents = db.prepare(
    `SELECT id, payload FROM designbuddy_gen WHERE project_id = ? AND type = 'artifact' ORDER BY seq ASC`,
  );
  const updateArtifactEvent = db.prepare(`UPDATE designbuddy_gen SET payload = ? WHERE id = ?`);
  const updateProjectMetadata = db.prepare(`UPDATE projects SET metadata_json = ? WHERE id = ?`);
  const writePreference = db.prepare(
    `INSERT INTO designbuddy_prefs (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  );

  db.transaction(() => {
    // Refresh only the original system artifact. Any later artifact version is
    // user-authored and remains the summary's latest version after migration.
    for (const starter of DESIGNER_STARTERS) {
      const existing = existingStarterByKey.get(starter.key);
      if (!existing) continue;
      const rows = selectArtifactEvents.all(existing.id) as Array<{ id: string; payload: string }>;
      for (const row of rows) {
        try {
          const payload = JSON.parse(row.payload) as Record<string, any>;
          if (Number(payload.version) !== 1) continue;
          updateArtifactEvent.run(
            JSON.stringify({
              ...payload,
              name: starter.name,
              kind: starter.mode,
              html: starterArtifactHtml(starter),
              interactive: true,
            }),
            row.id,
          );
          break;
        } catch {
          // Leave unreadable historical events untouched; other starter rows
          // can still be upgraded safely in the same transaction.
        }
      }
      updateProjectMetadata.run(
        JSON.stringify({
          ...existing.metadata,
          starterVersion: DESIGNER_STARTER_VERSION,
        }),
        existing.id,
      );
    }

    DESIGNER_STARTERS.forEach((starter, index) => {
      if (completedKeys.has(starter.key)) return;
      const projectId = `db-starter-${randomUUID()}`;
      const projectAt = now - (DESIGNER_STARTERS.length - index - 1) * 3_600_000 - 10_000;
      const metadata = {
        designBuddyRole: 'designer',
        designBuddyMode: starter.mode,
        source: 'starter-project',
        starterKey: starter.key,
        starterVersion: DESIGNER_STARTER_VERSION,
      };
      const artifactHtml = starterArtifactHtml(starter);
      const eventSpecs: Array<{
        type: DesignBuddyGenEventType;
        payload: Record<string, any>;
      }> = [
        { type: 'user', payload: { text: starter.prompt } },
        {
          type: 'ai',
          payload: {
            text: `收到，我会为「${starter.name}」建立完整的商业内容结构与可交互体验。`,
          },
        },
        { type: 'step', payload: { text: `分析业务目标与用户路径：${starter.name}` } },
        {
          type: 'step',
          payload: { text: '搭建可上下滚动的商业页面、响应式模块与视觉层级' },
        },
        {
          type: 'step',
          payload: { text: '连接按钮、标签、收藏、主题与表单反馈并完成检查' },
        },
        {
          type: 'artifact',
          payload: {
            name: starter.name,
            version: 1,
            kind: starter.mode,
            html: artifactHtml,
            interactive: true,
          },
        },
        {
          type: 'ai',
          payload: {
            text: '商业版界面已经完成。点开设计文件后可以上下滚动，并直接体验页面内的按钮与状态反馈。',
          },
        },
        { type: 'done', payload: { version: 1, kind: starter.mode } },
      ];
      const finalAt = projectAt + eventSpecs.length * 1000;
      insertProject.run(projectId, starter.name, JSON.stringify(metadata), projectAt, finalAt);
      eventSpecs.forEach((event, seqIndex) => {
        insertEvent.run(
          randomUUID(),
          projectId,
          seqIndex + 1,
          event.type,
          JSON.stringify(event.payload),
          projectAt + (seqIndex + 1) * 1000,
        );
      });
      completedKeys.add(starter.key);
      projectIds.push(projectId);
      createdProjectIds.push(projectId);
    });
    writePreference.run(
      DESIGNER_STARTER_PREF,
      JSON.stringify({
        version: DESIGNER_STARTER_VERSION,
        projectIds: Array.from(new Set(projectIds)),
        starterKeys: DESIGNER_STARTERS.map((starter) => starter.key),
      }),
      now,
    );
  })();

  return {
    role,
    initialized: true,
    version: DESIGNER_STARTER_VERSION,
    projectIds: Array.from(new Set(projectIds)),
    createdProjectIds,
  };
}

function reviewFromRow(row: DbRow): DesignBuddyReview {
  return {
    id: String(row.id),
    title: String(row.title),
    author: String(row.author),
    status: row.status as DesignBuddyReviewStatus,
    note: row.note == null ? null : String(row.note),
    projectId: row.project_id == null ? null : String(row.project_id),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export function listDesignBuddyReviews(db: SqliteDb): DesignBuddyReview[] {
  const rows = db
    .prepare(`SELECT * FROM designbuddy_reviews ORDER BY created_at DESC`)
    .all() as DbRow[];
  return rows.map(reviewFromRow);
}

export function createDesignBuddyReview(
  db: SqliteDb,
  input: { title: string; author: string; note?: string | null; projectId?: string | null },
): DesignBuddyReview {
  const now = Date.now();
  const id = randomUUID();
  db.prepare(
    `INSERT INTO designbuddy_reviews (id, title, author, status, note, project_id, created_at, updated_at)
     VALUES (?, ?, ?, 'wait', ?, ?, ?, ?)`,
  ).run(id, input.title, input.author, input.note ?? null, input.projectId ?? null, now, now);
  return {
    id,
    title: input.title,
    author: input.author,
    status: 'wait',
    note: input.note ?? null,
    projectId: input.projectId ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export function setDesignBuddyReviewStatus(
  db: SqliteDb,
  id: string,
  status: Exclude<DesignBuddyReviewStatus, 'wait'>,
): DesignBuddyReview | null {
  const info = db
    .prepare(`UPDATE designbuddy_reviews SET status = ?, updated_at = ? WHERE id = ?`)
    .run(status, Date.now(), id);
  if (info.changes === 0) return null;
  const row = db.prepare(`SELECT * FROM designbuddy_reviews WHERE id = ?`).get(id) as DbRow;
  return reviewFromRow(row);
}

function genEventFromRow(row: DbRow): DesignBuddyGenEvent {
  let payload: Record<string, any> | null = null;
  try {
    payload = row.payload == null ? null : (JSON.parse(String(row.payload)) as Record<string, any>);
  } catch {
    payload = null;
  }
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    seq: Number(row.seq),
    type: row.type as DesignBuddyGenEventType,
    payload,
    createdAt: Number(row.created_at),
  };
}

export function listDesignBuddyGenEvents(db: SqliteDb, projectId: string): DesignBuddyGenEvent[] {
  const rows = db
    .prepare(`SELECT * FROM designbuddy_gen WHERE project_id = ? ORDER BY seq ASC, created_at ASC`)
    .all(projectId) as DbRow[];
  return rows.map(genEventFromRow);
}

export function listDesignBuddyGenSummaries(db: SqliteDb): DesignBuddyGenSummary[] {
  const rows = db
    .prepare(
      `SELECT g.*
         FROM designbuddy_gen g
         INNER JOIN projects p ON p.id = g.project_id
        ORDER BY g.project_id ASC, g.seq ASC, g.created_at ASC`,
    )
    .all() as DbRow[];
  const summaries = new Map<string, DesignBuddyGenSummary>();
  for (const row of rows) {
    const event = genEventFromRow(row);
    let summary = summaries.get(event.projectId);
    if (!summary) {
      summary = {
        projectId: event.projectId,
        status: 'running',
        artifactCount: 0,
        latestVersion: null,
        kind: null,
        name: null,
        html: null,
        updatedAt: event.createdAt,
      };
      summaries.set(event.projectId, summary);
    }
    summary.updatedAt = Math.max(summary.updatedAt, event.createdAt);
    if (event.type === 'artifact' && event.payload) {
      summary.artifactCount += 1;
      summary.latestVersion = Number(event.payload.version) || summary.artifactCount;
      summary.kind = typeof event.payload.kind === 'string' ? event.payload.kind : summary.kind;
      summary.name = typeof event.payload.name === 'string' ? event.payload.name : summary.name;
      summary.html = typeof event.payload.html === 'string' ? event.payload.html : summary.html;
      summary.status = 'running';
    } else if (event.type === 'done') {
      summary.status = 'succeeded';
      if (event.payload) {
        if (Number(event.payload.version)) summary.latestVersion = Number(event.payload.version);
        if (typeof event.payload.kind === 'string') summary.kind = event.payload.kind;
      }
    } else if (event.type === 'stop') {
      summary.status = 'stopped';
    } else if (event.type === 'user' || event.type === 'step') {
      summary.status = 'running';
    }
  }
  return Array.from(summaries.values());
}

export function appendDesignBuddyGenEvent(
  db: SqliteDb,
  projectId: string,
  type: DesignBuddyGenEventType,
  payload: Record<string, any> | null,
): DesignBuddyGenEvent {
  const now = Date.now();
  const id = randomUUID();
  const lastSeq = (
    db
      .prepare(`SELECT COALESCE(MAX(seq), 0) AS s FROM designbuddy_gen WHERE project_id = ?`)
      .get(projectId) as DbRow
  ).s as number;
  const seq = Number(lastSeq) + 1;
  db.prepare(
    `INSERT INTO designbuddy_gen (id, project_id, seq, type, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, projectId, seq, type, JSON.stringify(payload ?? null), now);
  db.prepare(`UPDATE projects SET updated_at = ? WHERE id = ?`).run(now, projectId);
  return { id, projectId, seq, type, payload, createdAt: now };
}

export function designBuddyStats(db: SqliteDb): DesignBuddyStats {
  const projects = (
    db.prepare(`SELECT COUNT(*) AS c FROM projects`).get() as DbRow
  ).c as number;
  // Every user prompt in a project conversation is one "generation" request.
  const prompts = (
    db.prepare(`SELECT COUNT(*) AS c FROM messages WHERE role = 'user'`).get() as DbRow
  ).c as number;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const promptsThisMonth = (
    db
      .prepare(`SELECT COUNT(*) AS c FROM messages WHERE role = 'user' AND created_at >= ?`)
      .get(monthStart.getTime()) as DbRow
  ).c as number;
  const pendingReviews = (
    db.prepare(`SELECT COUNT(*) AS c FROM designbuddy_reviews WHERE status = 'wait'`).get() as DbRow
  ).c as number;

  // 14-day activity trend from user prompts, oldest first.
  const dayBuckets = new Array<number>(14).fill(0);
  const since = Date.now() - 13 * 86_400_000;
  const trendRows = db
    .prepare(`SELECT created_at AS at FROM messages WHERE role = 'user' AND created_at >= ?`)
    .all(since) as DbRow[];
  const dayMs = 86_400_000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  for (const row of trendRows) {
    const ageDays = Math.floor((todayStart.getTime() + dayMs - Number(row.at)) / dayMs) - 1;
    const idx = 13 - ageDays;
    if (idx >= 0 && idx < dayBuckets.length) dayBuckets[idx] = (dayBuckets[idx] ?? 0) + 1;
  }

  const quotaTotal = 2000;
  return {
    projects,
    prompts,
    promptsThisMonth,
    pendingReviews,
    quotaTotal,
    quotaUsed: prompts,
    trend: dayBuckets,
  };
}
