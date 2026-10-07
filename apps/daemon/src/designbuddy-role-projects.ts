export type DesignBuddyOperationalRole = 'pm' | 'dev' | 'admin';

export interface DesignBuddyRoleStarterBlueprint {
  key: string;
  role: DesignBuddyOperationalRole;
  name: string;
  mode: string;
  prompt: string;
  html: string;
  interactive: true;
}

interface RoleStarterSpec {
  key: string;
  role: DesignBuddyOperationalRole;
  name: string;
  mode: string;
  prompt: string;
  eyebrow: string;
  accent: string;
  soft: string;
  metrics: Array<[string, string]>;
  stages: string[];
  records: Array<[string, string, string]>;
}

const ROLE_LABELS: Record<DesignBuddyOperationalRole, { product: string; nav: string[] }> = {
  pm: { product: 'PRODUCT OPS', nav: ['概览', '需求', '洞察', '决策', '发布'] },
  dev: { product: 'BUILD SYSTEM', nav: ['工作台', '代码', '接口', '质量', '发布'] },
  admin: { product: 'TEAM CONTROL', nav: ['总览', '成员', '治理', '用量', '审计'] },
};

const ROLE_STARTER_SPECS: RoleStarterSpec[] = [
  {
    key: 'pm.signup-v2-prd', role: 'pm', name: '注册流程 v2 PRD', mode: 'prd',
    prompt: '起草一份注册流程 v2 的 PRD', eyebrow: 'PRODUCT REQUIREMENT · V2.0', accent: '#3978f6', soft: '#eaf1ff',
    metrics: [['目标完成度', '86%'], ['待确认问题', '04'], ['关联需求', '18']],
    stages: ['机会与目标', '用户场景', '方案范围', '验收指标'],
    records: [['邮箱注册', 'P0', '已确认'], ['第三方登录', 'P1', '评审中'], ['异常恢复', 'P0', '待补充']],
  },
  {
    key: 'pm.paid-conversion-flow', role: 'pm', name: '付费转化流程', mode: 'flowchart',
    prompt: '绘制从试用到付费的用户流程图', eyebrow: 'CUSTOMER FLOW · TRIAL TO PAID', accent: '#1b9b78', soft: '#e2f7f0',
    metrics: [['关键节点', '12'], ['阻塞点', '03'], ['转化目标', '18%']],
    stages: ['进入试用', '触达价值', '套餐比较', '支付成功'],
    records: [['首次价值时刻', '关键', '12 分钟'], ['升级提示', '实验', 'A/B'], ['支付失败', '兜底', '已覆盖']],
  },
  {
    key: 'pm.q4-roadmap', role: 'pm', name: 'Q4 产品路线图', mode: 'roadmap',
    prompt: '制作一份 Q4 产品路线图', eyebrow: 'ROADMAP · Q4 2026', accent: '#7759d7', soft: '#efeafd',
    metrics: [['战略主题', '04'], ['里程碑', '16'], ['资源置信度', '82%']],
    stages: ['十月 · 基础', '十一月 · 增长', '十二月 · 规模', 'Q1 · 探索'],
    records: [['协作工作流', 'Now', '进行中'], ['模板市场', 'Next', '已对齐'], ['企业治理', 'Later', '调研中']],
  },
  {
    key: 'pm.search-review', role: 'pm', name: '搜索体验评审', mode: 'review',
    prompt: '整理搜索体验改版的产品评审材料', eyebrow: 'DESIGN REVIEW · SEARCH', accent: '#ed754f', soft: '#fff0e9',
    metrics: [['评审页', '09'], ['待处理意见', '07'], ['可用性评分', '4.4']],
    stages: ['问题回顾', '方案对比', '边界状态', '发布决策'],
    records: [['空结果引导', '建议', '待采纳'], ['筛选器层级', '阻塞', '处理中'], ['快捷搜索', '通过', '可发布']],
  },
  {
    key: 'pm.ai-research', role: 'pm', name: 'AI 助手调研报告', mode: 'research-report',
    prompt: '生成一份 AI 助手用户调研报告', eyebrow: 'RESEARCH SYNTHESIS · AI ASSISTANT', accent: '#4d78c9', soft: '#eaf0fb',
    metrics: [['访谈样本', '24'], ['核心洞察', '08'], ['证据片段', '61']],
    stages: ['研究计划', '访谈记录', '主题聚类', '机会建议'],
    records: [['控制感', '高频', '18/24'], ['结果可信度', '风险', '15/24'], ['协作分享', '机会', '12/24']],
  },
  {
    key: 'pm.release-2-4', role: 'pm', name: 'v2.4 发布计划', mode: 'release-plan',
    prompt: '制定 v2.4 版本发布计划与检查清单', eyebrow: 'RELEASE COMMAND · V2.4', accent: '#608f3e', soft: '#edf6e7',
    metrics: [['检查项', '42'], ['已完成', '34'], ['发布风险', '02']],
    stages: ['功能冻结', '灰度验证', '全量发布', '发布复盘'],
    records: [['数据迁移演练', 'P0', '已完成'], ['商店素材', 'P1', '待审核'], ['回滚预案', 'P0', '已验证']],
  },
  {
    key: 'dev.marketing-refactor', role: 'dev', name: '营销首页重构', mode: 'frontend-code',
    prompt: '用响应式前端代码重构营销首页', eyebrow: 'FRONTEND DELIVERY · WEB', accent: '#735bd6', soft: '#eeeafd',
    metrics: [['组件', '28'], ['测试覆盖', '92%'], ['Bundle', '184KB']],
    stages: ['语义结构', '组件拆分', '响应式', '合并发布'],
    records: [['Hero.tsx', '修改', '通过'], ['Pricing.tsx', '新增', '通过'], ['home.spec.ts', '测试', '运行中']],
  },
  {
    key: 'dev.json-cleaner', role: 'dev', name: 'JSON 数据清洗器', mode: 'tools',
    prompt: '开发一个 JSON 数据清洗与格式化工具', eyebrow: 'DEVELOPER TOOL · JSON', accent: '#188f77', soft: '#e4f6f1',
    metrics: [['处理记录', '8.4K'], ['规则', '16'], ['错误率', '0.2%']],
    stages: ['导入数据', '配置规则', '预览差异', '导出结果'],
    records: [['去除空字段', '规则', '启用'], ['日期标准化', '规则', '启用'], ['重复项合并', '规则', '待确认']],
  },
  {
    key: 'dev.account-api', role: 'dev', name: '账户中心 API', mode: 'api',
    prompt: '设计账户中心 API 与接口文档', eyebrow: 'API CONTRACT · ACCOUNT', accent: '#2d77c8', soft: '#e8f2fc',
    metrics: [['端点', '18'], ['契约测试', '46'], ['P95', '84ms']],
    stages: ['数据模型', '接口契约', '权限策略', '联调发布'],
    records: [['GET /profile', '200', '稳定'], ['PATCH /profile', '200', '稳定'], ['POST /sessions', '201', '评审中']],
  },
  {
    key: 'dev.nova-components', role: 'dev', name: 'Nova 组件库', mode: 'component-library',
    prompt: '搭建 Nova 前端组件库与使用文档', eyebrow: 'COMPONENT LIBRARY · NOVA', accent: '#e46f52', soft: '#fff0ea',
    metrics: [['组件', '36'], ['Story', '124'], ['可访问性', 'AA']],
    stages: ['设计令牌', '基础组件', '业务模式', '版本发布'],
    records: [['Button', '2.4.0', '稳定'], ['DataTable', '1.8.2', '稳定'], ['DatePicker', '0.9.0', 'Beta']],
  },
  {
    key: 'dev.web-vitals', role: 'dev', name: 'Web Vitals 性能报告', mode: 'performance-report',
    prompt: '生成 Web Vitals 性能分析与优化报告', eyebrow: 'PERFORMANCE LAB · WEB VITALS', accent: '#6d963b', soft: '#eff7e6',
    metrics: [['LCP', '1.9s'], ['INP', '124ms'], ['CLS', '0.04']],
    stages: ['采集基线', '定位瓶颈', '实施优化', '持续监控'],
    records: [['首页主图', 'LCP', '已优化'], ['项目列表', 'INP', '处理中'], ['字体加载', 'CLS', '已修复']],
  },
  {
    key: 'dev.release-flow', role: 'dev', name: '前端发布工程流程', mode: 'engineering-flow',
    prompt: '设计从提交到发布的前端工程流程', eyebrow: 'DELIVERY PIPELINE · FRONTEND', accent: '#5173c8', soft: '#eaf0fb',
    metrics: [['流水线', '08'], ['平均耗时', '11m'], ['成功率', '96.8%']],
    stages: ['提交检查', '预览构建', '质量门禁', '生产发布'],
    records: [['Typecheck', '2m 18s', '通过'], ['Visual diff', '4m 06s', '通过'], ['Deploy', '3m 42s', '待批准']],
  },
  {
    key: 'admin.apac-workspace', role: 'admin', name: '亚太设计工作区', mode: 'workspace',
    prompt: '创建亚太设计团队工作区概览', eyebrow: 'WORKSPACE CONTROL · APAC', accent: '#dd794c', soft: '#fff0e7',
    metrics: [['活跃成员', '84'], ['项目', '126'], ['健康度', '96%']],
    stages: ['工作区概览', '团队结构', '资源配置', '运营节奏'],
    records: [['产品设计组', '32 人', '正常'], ['品牌体验组', '18 人', '正常'], ['外部伙伴', '12 人', '需复核']],
  },
  {
    key: 'admin.product-members', role: 'admin', name: '产品团队成员管理', mode: 'member-management',
    prompt: '生成产品团队成员与席位管理方案', eyebrow: 'MEMBER OPERATIONS · PRODUCT', accent: '#3c7dc6', soft: '#eaf2fb',
    metrics: [['成员', '64'], ['可用席位', '08'], ['待处理邀请', '05']],
    stages: ['邀请成员', '分配角色', '配置席位', '定期复核'],
    records: [['设计负责人', '管理员', '已激活'], ['产品顾问', '访客', '待接受'], ['研发伙伴', '成员', '已激活']],
  },
  {
    key: 'admin.september-usage', role: 'admin', name: '9 月用量分析', mode: 'usage-analysis',
    prompt: '生成 9 月团队用量分析看板', eyebrow: 'USAGE INTELLIGENCE · SEPTEMBER', accent: '#249379', soft: '#e6f6f1',
    metrics: [['生成任务', '2.8K'], ['活跃率', '78%'], ['预算使用', '64%']],
    stages: ['采集用量', '识别趋势', '异常归因', '预算调整'],
    records: [['产品团队', '1,284 次', '+18%'], ['品牌团队', '842 次', '+9%'], ['增长团队', '614 次', '-3%']],
  },
  {
    key: 'admin.external-governance', role: 'admin', name: '外部协作权限治理', mode: 'permission-governance',
    prompt: '制定外部协作人员的权限治理方案', eyebrow: 'ACCESS GOVERNANCE · EXTERNAL', accent: '#7559ca', soft: '#efeafd',
    metrics: [['外部成员', '28'], ['高风险权限', '03'], ['待复核', '11']],
    stages: ['身份确认', '最小授权', '到期管理', '访问审计'],
    records: [['Agency North', '编辑', '7 天后到期'], ['Research Lab', '查看', '正常'], ['Freelance Ops', '管理员', '需降权']],
  },
  {
    key: 'admin.asset-migration', role: 'admin', name: '历史资产迁移', mode: 'asset-migration',
    prompt: '规划历史设计资产迁移与校验清单', eyebrow: 'ASSET MIGRATION · LEGACY', accent: '#e17052', soft: '#fff0ea',
    metrics: [['资产', '18.4K'], ['已迁移', '68%'], ['异常', '124']],
    stages: ['资产盘点', '映射规则', '分批迁移', '完整校验'],
    records: [['品牌资产', '4,218', '完成'], ['产品原型', '8,640', '进行中'], ['历史归档', '5,524', '待开始']],
  },
  {
    key: 'admin.q3-report', role: 'admin', name: 'Q3 团队效能报告', mode: 'team-report',
    prompt: '生成 Q3 团队效能与用量报告', eyebrow: 'TEAM EFFECTIVENESS · Q3', accent: '#78963f', soft: '#f0f6e7',
    metrics: [['交付周期', '-18%'], ['复用率', '74%'], ['满意度', '4.6']],
    stages: ['目标回顾', '效率趋势', '团队洞察', '下季行动'],
    records: [['需求到原型', '2.8 天', '-22%'], ['评审到交付', '1.4 天', '-12%'], ['资产复用', '74%', '+16%']],
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function roleStarterDocument(spec: RoleStarterSpec, index: number): string {
  const labels = ROLE_LABELS[spec.role];
  const title = escapeHtml(spec.name);
  const mode = escapeHtml(spec.mode);
  const metrics = spec.metrics.map(([label, value], metricIndex) =>
    `<button type="button" class="metric${metricIndex === 0 ? ' active' : ''}" data-select="${escapeHtml(label)}"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b><small>${metricIndex === 1 ? '需要关注' : '较上周期改善'}</small></button>`,
  ).join('');
  const stages = spec.stages.map((stage, stageIndex) =>
    `<button type="button" class="stage${stageIndex === 0 ? ' active' : ''}" data-stage="${stageIndex}"><i>${String(stageIndex + 1).padStart(2, '0')}</i><span><b>${escapeHtml(stage)}</b><small>${stageIndex < 2 ? '已完成关键检查' : '点击查看并推进'}</small></span><em>${stageIndex < 2 ? '✓' : '→'}</em></button>`,
  ).join('');
  const records = spec.records.map(([name, value, status], recordIndex) =>
    `<button type="button" class="record" data-record="${escapeHtml(name)}"><span class="avatar">${String(recordIndex + 1).padStart(2, '0')}</span><span><b>${escapeHtml(name)}</b><small>${escapeHtml(value)}</small></span><em>${escapeHtml(status)}</em></button>`,
  ).join('');
  const nav = labels.nav.map((item, navIndex) =>
    `<button type="button" class="nav-item${navIndex === 0 ? ' active' : ''}" data-nav="${escapeHtml(item)}">${escapeHtml(item)}</button>`,
  ).join('');
  const bars = [48, 64, 56, 78, 69, 88, 82, 96].map((height, barIndex) =>
    `<i style="height:${Math.min(98, height + ((index + barIndex) % 4) * 2)}%"></i>`,
  ).join('');

  return `<!doctype html><html lang="zh-CN" data-role-starter="${spec.role}" data-mode="${mode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
  :root{--accent:${spec.accent};--soft:${spec.soft};--ink:#172019;--muted:#6a756d;--line:#e0e5de;--paper:#f5f6f1}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100%;font:14px/1.5 Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--ink);background:var(--paper)}button{font:inherit;color:inherit}.app{min-height:100vh;display:grid;grid-template-columns:224px 1fr}.rail{position:sticky;top:0;height:100vh;padding:26px 18px;background:#172019;color:#edf3ed;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:10px;font-weight:850;letter-spacing:-.02em}.brand i{width:34px;height:34px;border-radius:11px;background:var(--accent);display:grid;place-items:center;font-style:normal;color:#fff}.brand small{display:block;color:#8f9c92;font-size:9px;letter-spacing:.13em}.nav{display:grid;gap:6px;margin-top:44px}.nav-item{border:0;border-radius:11px;padding:11px 13px;background:transparent;color:#aeb8b0;text-align:left;cursor:pointer}.nav-item.active,.nav-item:hover{background:#ffffff12;color:#fff}.rail-note{margin-top:auto;padding:15px;border:1px solid #ffffff17;border-radius:15px;background:#ffffff08}.rail-note small,.rail-note b{display:block}.rail-note small{color:#91a096}.main{min-width:0}.top{height:70px;padding:0 4vw;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;background:#ffffffb8;backdrop-filter:blur(14px);position:sticky;top:0;z-index:5}.top span{font-size:11px;font-weight:800;letter-spacing:.13em;color:var(--muted)}.top div{display:flex;align-items:center;gap:10px}.status{border:0;border-radius:999px;padding:8px 12px;background:var(--soft);color:var(--accent);font-weight:750;cursor:pointer}.avatar{width:32px;height:32px;border-radius:10px;background:#253129;color:#fff;display:grid;place-items:center;font-size:10px;font-style:normal}.content{width:min(1180px,92%);margin:0 auto;padding:54px 0 86px}.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}.eyebrow{font-size:11px;font-weight:850;letter-spacing:.14em;color:var(--accent)}h1{font-size:clamp(38px,5vw,66px);line-height:1.04;letter-spacing:-.055em;margin:15px 0 14px}.hero p{max-width:650px;color:var(--muted);font-size:16px}.primary{border:0;border-radius:13px;padding:13px 18px;background:var(--ink);color:#fff;font-weight:780;cursor:pointer;white-space:nowrap}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:36px 0}.metric{border:1px solid var(--line);border-radius:18px;background:#fff;padding:20px;text-align:left;cursor:pointer;box-shadow:0 12px 30px #5264560a}.metric.active{border-color:var(--accent);box-shadow:0 0 0 3px var(--soft)}.metric span,.metric b,.metric small{display:block}.metric span,.metric small{color:var(--muted);font-size:11px}.metric b{font-size:30px;margin:9px 0 5px;letter-spacing:-.04em}.workspace{display:grid;grid-template-columns:1.2fr .8fr;gap:15px}.panel{border:1px solid var(--line);border-radius:20px;background:#fff;padding:22px}.panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}.panel-head span{color:var(--muted);font-size:11px}.stages{display:grid;gap:8px}.stage,.record{width:100%;border:1px solid transparent;border-radius:14px;background:#f6f8f4;padding:13px;display:flex;align-items:center;gap:12px;text-align:left;cursor:pointer}.stage:hover,.stage.active,.record:hover{border-color:var(--accent);background:var(--soft)}.stage i{width:34px;height:34px;border-radius:10px;background:#fff;display:grid;place-items:center;font-style:normal;font-size:10px}.stage span,.record span:nth-child(2){flex:1}.stage b,.stage small,.record b,.record small{display:block}.stage small,.record small{color:var(--muted);font-size:10px}.stage em,.record em{font-style:normal;font-size:11px;color:var(--accent)}.records{display:grid;gap:8px}.record .avatar{background:var(--ink)}.chart{margin-top:15px}.bars{height:210px;display:flex;align-items:flex-end;gap:7%;padding:18px 12px 0;border-bottom:1px solid var(--line);background:linear-gradient(#fff,#fbfcfa)}.bars i{flex:1;border-radius:9px 9px 0 0;background:linear-gradient(var(--accent),var(--soft))}.chart-labels{display:flex;justify-content:space-between;color:var(--muted);font-size:10px;padding-top:9px}.drawer{position:fixed;inset:0;background:#1420196b;display:grid;place-items:center;padding:20px;z-index:20;opacity:0;pointer-events:none;transition:.2s}.drawer.open{opacity:1;pointer-events:auto}.dialog{width:min(480px,100%);background:#fff;border-radius:22px;padding:25px;box-shadow:0 30px 80px #1118}.dialog h2{margin:8px 0}.dialog p{color:var(--muted)}.dialog-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:22px}.ghost{border:1px solid var(--line);background:#fff;border-radius:11px;padding:10px 14px;cursor:pointer}.toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);background:#172019;color:#fff;padding:11px 15px;border-radius:999px;opacity:0;transition:.2s;z-index:30}.toast.show{opacity:1;transform:translate(-50%,0)}@media(max-width:820px){.app{grid-template-columns:1fr}.rail{position:relative;height:auto;padding:14px 4vw;flex-direction:row;align-items:center}.nav{margin:0 0 0 auto;display:flex;overflow:auto}.nav-item{white-space:nowrap}.rail-note{display:none}.top{top:0}.hero{align-items:flex-start;flex-direction:column}.metrics{grid-template-columns:1fr}.workspace{grid-template-columns:1fr}.content{padding-top:36px}}@media(max-width:560px){.brand span{display:none}.nav-item:nth-child(n+4){display:none}.top{padding:0 5vw}.content{width:90%}h1{font-size:42px}.bars{height:160px}}
  </style></head><body><div class="app"><aside class="rail"><div class="brand"><i>${labels.product.charAt(0)}</i><span>DesignBuddy<small>${labels.product}</small></span></div><nav class="nav">${nav}</nav><div class="rail-note"><small>当前项目</small><b>${title}</b></div></aside><main class="main"><header class="top"><span>${escapeHtml(spec.eyebrow)}</span><div><button type="button" class="status" id="statusButton">已同步</button><i class="avatar">YOU</i></div></header><div class="content"><section class="hero"><div><span class="eyebrow">${escapeHtml(spec.eyebrow)}</span><h1>${title}</h1><p>${escapeHtml(spec.prompt)}。该项目已保存为可继续编辑、可回放的角色工作区。</p></div><button type="button" class="primary" id="openAction">打开执行面板 →</button></section><section class="metrics">${metrics}</section><section class="workspace"><article class="panel"><div class="panel-head"><b>工作流</b><span id="stageSummary">已完成 2 / ${spec.stages.length}</span></div><div class="stages">${stages}</div></article><article class="panel"><div class="panel-head"><b>关键记录</b><span>实时状态</span></div><div class="records">${records}</div></article></section><article class="panel chart"><div class="panel-head"><b>趋势与进度</b><span>最近 8 个周期</span></div><div class="bars">${bars}</div><div class="chart-labels"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span><span>W8</span></div></article></div></main></div><div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="dialogTitle"><section class="dialog"><span class="eyebrow">${mode.toUpperCase()}</span><h2 id="dialogTitle">推进「${title}」</h2><p id="dialogCopy">确认后会把当前工作流推进到下一状态，并在此项目中保留可见反馈。</p><div class="dialog-actions"><button type="button" class="ghost" id="cancelAction">取消</button><button type="button" class="primary" id="confirmAction">确认推进</button></div></section></div><div class="toast" id="toast" role="status"></div><script>
  (function(){var drawer=document.getElementById('drawer'),toast=document.getElementById('toast'),lastFocus=null;function say(text){toast.textContent=text;toast.classList.add('show');clearTimeout(say.t);say.t=setTimeout(function(){toast.classList.remove('show')},1800)}function close(){drawer.classList.remove('open');if(lastFocus)lastFocus.focus()}document.querySelectorAll('[data-nav]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-nav]').forEach(function(item){item.classList.remove('active')});button.classList.add('active');say('已切换到 '+button.dataset.nav)})});document.querySelectorAll('[data-select]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-select]').forEach(function(item){item.classList.remove('active')});button.classList.add('active');say('正在查看 '+button.dataset.select)})});document.querySelectorAll('[data-stage]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-stage]').forEach(function(item){item.classList.remove('active')});button.classList.add('active');document.getElementById('stageSummary').textContent='当前：'+button.querySelector('b').textContent;say('工作流已定位')})});document.querySelectorAll('[data-record]').forEach(function(button){button.addEventListener('click',function(){lastFocus=button;document.getElementById('dialogTitle').textContent=button.dataset.record;document.getElementById('dialogCopy').textContent='查看记录详情并确认下一步处理。';drawer.classList.add('open');document.getElementById('cancelAction').focus()})});document.getElementById('openAction').addEventListener('click',function(){lastFocus=this;drawer.classList.add('open');document.getElementById('cancelAction').focus()});document.getElementById('cancelAction').addEventListener('click',close);document.getElementById('confirmAction').addEventListener('click',function(){close();say('状态已更新并保留在当前会话')});document.getElementById('statusButton').addEventListener('click',function(){this.textContent=this.textContent==='已同步'?'刚刚检查':'已同步';say('同步状态已刷新')});drawer.addEventListener('click',function(event){if(event.target===drawer)close()});document.addEventListener('keydown',function(event){if(event.key==='Escape'&&drawer.classList.contains('open'))close()})})();
  </script></body></html>`;
}

export const DESIGNBUDDY_ROLE_STARTERS: Readonly<Record<DesignBuddyOperationalRole, readonly DesignBuddyRoleStarterBlueprint[]>> = {
  pm: ROLE_STARTER_SPECS.filter((spec) => spec.role === 'pm').map((spec, index) => ({ ...spec, html: roleStarterDocument(spec, index), interactive: true as const })),
  dev: ROLE_STARTER_SPECS.filter((spec) => spec.role === 'dev').map((spec, index) => ({ ...spec, html: roleStarterDocument(spec, index), interactive: true as const })),
  admin: ROLE_STARTER_SPECS.filter((spec) => spec.role === 'admin').map((spec, index) => ({ ...spec, html: roleStarterDocument(spec, index), interactive: true as const })),
};
