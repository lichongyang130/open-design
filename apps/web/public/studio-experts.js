(function () {
  "use strict";

  var root = document.getElementById("expertHub");
  if (!root) return;

  var COPY = {
    zh: {
      experts: "专家", skills: "技能", connectors: "连接器", searchExperts: "搜索专家", searchSkills: "搜索技能", searchConnectors: "搜索连接器",
      mine: "我的专家", people: "专家", teams: "专家团", smart: "综合", hot: "最热", new: "最新",
      result: "项结果", verified: "已认证", call: "召唤", use: "立即召唤", save: "收藏专家", saved: "已收藏",
      useSkill: "使用技能", install: "添加", connected: "已连接", disconnect: "断开", connect: "连接",
      noResult: "没有找到匹配结果", noResultBody: "试试其他关键词或切换分类。", noMine: "还没有收藏专家", noMineBody: "收藏常用专家后，可以从这里快速召唤。", browse: "浏览全部",
      detailAbout: "专家介绍", detailSkills: "专业能力", detailPrompts: "推荐任务", rating: "用户评分", calls: "次召唤", response: "响应时间",
      ready: "已将 {name} 添加到创作器", connectedToast: "已连接 {name}", disconnectedToast: "已断开 {name}",
      skillContext: "技能市场", skillSub: "为 Buddy 装配专业工作流", connectorContext: "连接器中心", connectorSub: "连接你的日常工具与数据",
      close: "关闭专家详情"
    },
    en: {
      experts: "Experts", skills: "Skills", connectors: "Connectors", searchExperts: "Search experts", searchSkills: "Search skills", searchConnectors: "Search connectors",
      mine: "My experts", people: "Experts", teams: "Expert teams", smart: "For you", hot: "Popular", new: "Newest",
      result: "results", verified: "Verified", call: "Call", use: "Call expert", save: "Save expert", saved: "Saved",
      useSkill: "Use skill", install: "Add", connected: "Connected", disconnect: "Disconnect", connect: "Connect",
      noResult: "No matching results", noResultBody: "Try another keyword or switch categories.", noMine: "No saved experts yet", noMineBody: "Save the experts you use most for quick access here.", browse: "Browse all",
      detailAbout: "About", detailSkills: "Expertise", detailPrompts: "Suggested tasks", rating: "Rating", calls: "calls", response: "Response",
      ready: "{name} is ready in the composer", connectedToast: "Connected {name}", disconnectedToast: "Disconnected {name}",
      skillContext: "Skill marketplace", skillSub: "Equip Buddy with professional workflows", connectorContext: "Connector hub", connectorSub: "Connect the tools and data you use every day",
      close: "Close expert details"
    }
  };

  var CATEGORIES = [
    { id: "all", zh: "全部", en: "All" },
    { id: "solo", zh: "OPC·一人公司", en: "Solo business" },
    { id: "design", zh: "产品设计", en: "Product design" },
    { id: "engineering", zh: "技术工程", en: "Engineering" },
    { id: "data", zh: "数据智能", en: "Data & AI" },
    { id: "growth", zh: "营销增长", en: "Growth" },
    { id: "content", zh: "内容创作", en: "Content" },
    { id: "sales", zh: "销售商务", en: "Sales" },
    { id: "finance", zh: "金融投资", en: "Finance" },
    { id: "operations", zh: "运营人力", en: "Operations" },
    { id: "project", zh: "项目质量", en: "Projects" },
    { id: "legal", zh: "法务安全", en: "Legal & security" },
    { id: "gaming", zh: "游戏空间", en: "Gaming" },
    { id: "global", zh: "全球发展", en: "Global" },
    { id: "advisory", zh: "行业顾问", en: "Advisory" }
  ];

  var SKILL_CATEGORIES = [
    { id: "all", zh: "全部", en: "All" },
    { id: "design", zh: "设计", en: "Design" },
    { id: "content", zh: "内容", en: "Content" },
    { id: "data", zh: "数据", en: "Data" },
    { id: "engineering", zh: "研发", en: "Engineering" },
    { id: "growth", zh: "增长", en: "Growth" },
    { id: "operations", zh: "效率", en: "Productivity" }
  ];

  var CONNECTOR_CATEGORIES = [
    { id: "all", zh: "全部", en: "All" },
    { id: "productivity", zh: "效率协作", en: "Productivity" },
    { id: "engineering", zh: "研发工具", en: "Engineering" },
    { id: "data", zh: "数据分析", en: "Data" },
    { id: "content", zh: "内容资产", en: "Content" }
  ];

  var SPOTLIGHTS = [
    { id: "content", title: { zh: "内容创作", en: "Content creation" }, tone: "#dce8d9", accent: "#8aa181", art: "content", links: [{ zh: "内容创作专家", en: "Content strategist" }, { zh: "小红书运营专家", en: "Social content expert" }, { zh: "播客脚本策划师", en: "Podcast script editor" }] },
    { id: "finance", title: { zh: "投资分析", en: "Investment analysis" }, tone: "#dce9f4", accent: "#7c9dbb", art: "finance", links: [{ zh: "交易分析团队", en: "Trading analysis team" }, { zh: "腾讯自选股金融分析专家团", en: "Market intelligence team" }, { zh: "公司估值分析师", en: "Valuation analyst" }] },
    { id: "solo", title: { zh: "小微企业", en: "Small business" }, tone: "#e2ece4", accent: "#88a18d", art: "business", links: [{ zh: "销售教练", en: "Sales coach" }, { zh: "创业教练", en: "Startup coach" }, { zh: "一人公司增长顾问", en: "Solo growth advisor" }] },
    { id: "growth", title: { zh: "电商运营", en: "E-commerce" }, tone: "#ece3fb", accent: "#a28bc0", art: "commerce", links: [{ zh: "跨境电商专家", en: "Cross-border commerce expert" }, { zh: "直播运营顾问", en: "Live commerce advisor" }, { zh: "商品增长分析师", en: "Merchandising analyst" }] },
    { id: "data", title: { zh: "数据分析", en: "Data analysis" }, tone: "#e4edf8", accent: "#829bb8", art: "data", links: [{ zh: "数据分析报告师", en: "Data report analyst" }, { zh: "深度研究团队", en: "Deep research team" }, { zh: "商业洞察顾问", en: "Business intelligence advisor" }] },
    { id: "advisory", title: { zh: "专业顾问", en: "Professional advisory" }, tone: "#f3eadc", accent: "#b49875", art: "advisory", links: [{ zh: "法律风险顾问", en: "Legal risk advisor" }, { zh: "组织效能专家", en: "Org effectiveness expert" }, { zh: "行业趋势专家", en: "Industry trends expert" }] }
  ];

  function expert(id, category, zh, en, descZh, descEn, tagsZh, tagsEn, hue, heat, added, promptZh, promptEn) {
    return { id: id, category: category, name: { zh: zh, en: en }, desc: { zh: descZh, en: descEn }, tags: { zh: tagsZh, en: tagsEn }, hue: hue, heat: heat, added: added, rating: (4.7 + (heat % 3) / 10).toFixed(1), prompt: { zh: promptZh, en: promptEn }, verified: heat > 80 };
  }

  var EXPERTS = [
    expert("career-coach", "operations", "求职顾问", "Career coach", "自动搜索匹配职位、智能定制简历并准备面试策略。", "Find matching roles, tailor your resume, and prepare an interview strategy.", ["职位搜索", "简历定制", "投递管理"], ["Job search", "Resume", "Applications"], ["#d8e6ed", "#3f6f84"], 96, 20261001, "根据我的经历和目标岗位，制定一份完整求职计划，并优化简历要点。", "Create a complete job-search plan for my experience and target role, then improve my resume bullets."),
    expert("ui-designer", "design", "UI设计师", "UI designer", "精通设计系统和组件库，追求像素级一致与完整交互状态。", "Build coherent interfaces with design systems, reusable components, and complete interaction states.", ["UI设计", "组件库", "界面规范"], ["UI design", "Components", "UI standards"], ["#d9e8df", "#55816c"], 99, 20261006, "为我的产品设计一套商业级响应式界面，包含设计系统、关键页面和全部交互状态。", "Design a production-quality responsive product interface with a design system, key screens, and every interaction state."),
    expert("linkedin-writer", "content", "LinkedIn内容创作者", "LinkedIn content creator", "精通 LinkedIn 专业社交平台内容策略与个人品牌表达。", "Create high-signal LinkedIn content and a consistent professional personal brand.", ["职场内容", "领英创作", "个人品牌"], ["Professional", "LinkedIn", "Personal brand"], ["#d6e5ef", "#416781"], 88, 20260927, "根据我的行业与经历，规划一个月 LinkedIn 内容日历并写出首周内容。", "Plan a month of LinkedIn content for my industry and experience, then draft the first week."),
    expert("code-reviewer", "engineering", "代码审查专家", "Code review expert", "以鹰眼标准检查每行代码，定位缺陷、安全风险和维护成本。", "Review every line for bugs, security risks, performance issues, and maintainability.", ["代码审查", "质量把关", "最佳实践"], ["Code review", "Quality", "Best practices"], ["#d9e8e1", "#3d745f"], 97, 20261004, "审查我提供的代码，从正确性、安全、性能、可维护性和测试覆盖率五个维度给出修改建议。", "Review my code for correctness, security, performance, maintainability, and test coverage."),
    expert("data-report", "data", "数据分析报告师", "Data report analyst", "将复杂数据转化为清晰可执行的业务洞察与管理层报告。", "Turn complex data into clear, actionable business insights and executive-ready reports.", ["数据分析", "数据可视化", "KPI报告"], ["Analysis", "Visualization", "KPI reports"], ["#d7e7ee", "#477387"], 95, 20261002, "分析这份业务数据，识别关键变化、异常与驱动因素，并输出可执行的管理层报告。", "Analyze this business data, identify changes, anomalies, and drivers, then produce an actionable executive report."),
    expert("chart-renderer", "data", "图表设计与渲染专家", "Chart design & rendering expert", "将自然语言转化为专业级 Mermaid、SVG 与数据图表。", "Turn plain-language requirements into production-grade Mermaid, SVG, and data visualizations.", ["Mermaid图表", "SVG渲染", "架构可视化"], ["Mermaid", "SVG", "Architecture"], ["#e2e4e4", "#727a78"], 83, 20261005, "把我的信息整理为清晰的可视化结构，选择最合适的图表并输出可复用代码。", "Structure my information visually, choose the right chart, and provide reusable rendering code."),
    expert("executive-summary", "project", "执行摘要专家", "Executive summary expert", "将冗长报告浓缩为高管可快速消化的决策简报。", "Compress long reports into decision-ready executive briefs without losing essential nuance.", ["执行摘要", "战略报告", "决策简报"], ["Summary", "Strategy", "Decision brief"], ["#e9dfd3", "#8b6b52"], 91, 20260930, "将这份材料整理成一页执行摘要，突出背景、关键发现、风险、建议与下一步。", "Turn this material into a one-page executive summary covering context, findings, risks, recommendations, and next steps."),
    expert("brand-strategist", "growth", "品牌策略师", "Brand strategist", "15年品牌战略经验，统一定位、信息架构与视觉识别。", "Align positioning, messaging, and visual identity through a coherent brand strategy.", ["品牌策略", "品牌一致性", "视觉识别"], ["Brand strategy", "Consistency", "Identity"], ["#d9e7ed", "#476f82"], 90, 20260925, "为这个品牌制定定位、核心价值主张、受众画像、信息层级与90天落地路线图。", "Create positioning, a core value proposition, audience profiles, messaging hierarchy, and a 90-day rollout plan."),
    expert("senior-pm", "project", "高级项目经理", "Senior project manager", "10年以上项目管理经验，精通瀑布与敏捷交付。", "Plan and control complex delivery using pragmatic waterfall and agile methods.", ["项目管理", "里程碑规划", "风险管控"], ["Projects", "Milestones", "Risk"], ["#e1e3df", "#59635b"], 94, 20261003, "将这个目标拆成范围、里程碑、责任人、依赖、风险与周度推进机制。", "Break this objective into scope, milestones, owners, dependencies, risks, and a weekly delivery cadence."),
    expert("frontend-engineer", "engineering", "前端开发工程师", "Frontend engineer", "精通现代 Web 技术与主流框架，专注性能与可访问性。", "Build modern web interfaces with robust architecture, performance, and accessibility.", ["前端开发", "页面交互", "组件开发"], ["Frontend", "Interaction", "Components"], ["#d9eaf0", "#36758c"], 98, 20261007, "把这份设计需求实现为响应式前端页面，包含语义结构、组件拆分、交互与测试方案。", "Implement this design as a responsive frontend with semantic structure, components, interactions, and a test plan."),
    expert("trend-analyst", "advisory", "行业趋势专家", "Industry trends expert", "持续追踪行业和技术趋势，为产品战略识别机会与风险。", "Track market and technology shifts to identify strategic opportunities and threats.", ["趋势研究", "市场情报", "机会识别"], ["Trends", "Intelligence", "Opportunities"], ["#dce5f0", "#4a6485"], 86, 20261001, "研究这个行业未来12个月的关键趋势、证据、影响、机会窗口和需要验证的假设。", "Research this industry's next 12 months: key trends, evidence, implications, opportunity windows, and assumptions to validate."),
    expert("month-end-accountant", "finance", "月末结账会计", "Month-end accountant", "财务负责人助手，生成月末关账档案、核对清单与差异说明。", "Prepare month-end close files, reconciliations, checklists, and variance narratives.", ["月末关账", "应计表", "差异说明"], ["Close", "Accruals", "Variance"], ["#ecd9df", "#88495e"], 79, 20260922, "为本月制定关账清单，梳理凭证、应计、对账、差异分析和复核责任。", "Create this month's close checklist across journals, accruals, reconciliations, variance analysis, and review ownership."),
    expert("user-researcher", "design", "用户研究员", "User researcher", "设计研究计划、访谈提纲并把观察转化为产品机会。", "Plan research, run interviews, and translate observations into product opportunities.", ["用户访谈", "研究计划", "洞察归纳"], ["Interviews", "Research", "Synthesis"], ["#e8dff1", "#735b8d"], 89, 20260929, "围绕这个产品问题设计研究计划、招募标准、访谈提纲和洞察分析框架。", "Design a research plan, recruiting criteria, interview guide, and synthesis framework for this product question."),
    expert("growth-advisor", "growth", "产品增长顾问", "Product growth advisor", "从漏斗、留存与实验机制中寻找可持续增长杠杆。", "Find durable growth levers through funnel analysis, retention, and disciplined experimentation.", ["增长模型", "实验设计", "留存提升"], ["Growth model", "Experiments", "Retention"], ["#e6ecd8", "#6d7f42"], 92, 20260928, "诊断当前增长漏斗，提出可验证假设，并设计按影响与成本排序的实验路线图。", "Diagnose the growth funnel, propose testable hypotheses, and prioritize an experiment roadmap by impact and effort."),
    expert("security-advisor", "legal", "应用安全顾问", "Application security advisor", "从威胁建模到修复验证，帮助团队建立安全交付基线。", "Establish a secure delivery baseline from threat modeling through remediation verification.", ["威胁建模", "安全审计", "修复方案"], ["Threat model", "Audit", "Remediation"], ["#e4e6dd", "#606947"], 87, 20261006, "为这个系统进行威胁建模，列出攻击面、风险等级、缓解措施和验证清单。", "Threat-model this system and list attack surfaces, severity, mitigations, and a verification checklist."),
    expert("sales-coach", "sales", "B2B销售教练", "B2B sales coach", "优化客户研究、发现式沟通、价值表达与成交推进。", "Improve account research, discovery, value articulation, and deal progression.", ["客户洞察", "销售话术", "成交策略"], ["Accounts", "Discovery", "Deals"], ["#f0e1d9", "#98634a"], 85, 20260924, "为这个目标客户准备会前研究、发现问题、价值主张、异议处理和跟进邮件。", "Prepare account research, discovery questions, value messaging, objection handling, and a follow-up email."),
    expert("localization-lead", "global", "全球化本地化顾问", "Global localization advisor", "协调多市场语言、文化、法规与产品体验的一致落地。", "Coordinate language, culture, compliance, and product experience across markets.", ["本地化", "文化适配", "全球发布"], ["Localization", "Culture", "Global launch"], ["#dce9e7", "#4e7d78"], 76, 20260921, "评估产品进入目标市场所需的语言、文化、法规、支付和运营适配事项。", "Assess language, cultural, regulatory, payment, and operating adaptations for entering this target market."),
    expert("game-systems", "gaming", "游戏系统策划师", "Game systems designer", "设计可持续的核心循环、经济系统和玩家成长体验。", "Design sustainable core loops, economies, and player progression systems.", ["核心循环", "数值经济", "玩家成长"], ["Core loop", "Economy", "Progression"], ["#e4dff2", "#65558b"], 78, 20260923, "为这个游戏概念设计核心循环、资源经济、成长曲线和防止失衡的验证指标。", "Design the core loop, resource economy, progression curve, and balance metrics for this game concept.")
  ];

  var TEAMS = [
    { id: "launch-team", category: "growth", name: { zh: "新品上市专家团", en: "Product launch team" }, desc: { zh: "品牌策略、内容创作、增长实验和项目推进一体协作。", en: "Brand, content, growth experiments, and delivery in one coordinated team." }, members: [7, 2, 13], heat: 99, added: 20261006, prompt: { zh: "为我的新品制定从定位到发布后复盘的完整上市计划。", en: "Build a complete launch plan from positioning through post-launch review." }, tags: { zh: ["上市策略", "内容矩阵", "增长实验"], en: ["Launch", "Content", "Growth"] } },
    { id: "product-team", category: "design", name: { zh: "0-1产品设计专家团", en: "0-to-1 product team" }, desc: { zh: "研究、产品策略、UI设计与前端交付并行推进。", en: "Research, product strategy, UI design, and frontend delivery in parallel." }, members: [12, 1, 9], heat: 98, added: 20261005, prompt: { zh: "把我的想法推进为可验证、可开发的产品方案。", en: "Turn my idea into a validated, build-ready product direction." }, tags: { zh: ["用户研究", "产品设计", "前端交付"], en: ["Research", "Design", "Frontend"] } },
    { id: "research-team", category: "data", name: { zh: "深度研究团队", en: "Deep research team" }, desc: { zh: "趋势扫描、数据分析、图表表达与执行摘要协同产出。", en: "Trend scanning, analysis, visualization, and executive synthesis." }, members: [10, 4, 6], heat: 96, added: 20261002, prompt: { zh: "对这个主题开展深度研究并形成决策级报告。", en: "Research this topic deeply and produce a decision-grade report." }, tags: { zh: ["市场情报", "数据分析", "决策报告"], en: ["Intelligence", "Analysis", "Brief"] } },
    { id: "quality-team", category: "engineering", name: { zh: "工程质量专家团", en: "Engineering quality team" }, desc: { zh: "代码审查、应用安全和前端工程三方联合把关。", en: "Code review, application security, and frontend engineering together." }, members: [3, 14, 9], heat: 94, added: 20261007, prompt: { zh: "对这个项目开展发布前工程质量审查并给出修复优先级。", en: "Run a pre-release engineering quality review and prioritize fixes." }, tags: { zh: ["代码质量", "安全", "性能"], en: ["Code quality", "Security", "Performance"] } },
    { id: "business-team", category: "solo", name: { zh: "一人公司增长团队", en: "Solo business growth team" }, desc: { zh: "用最小团队完成定位、获客、销售和经营复盘。", en: "Run positioning, acquisition, sales, and operating reviews with a tiny team." }, members: [13, 15, 7], heat: 90, added: 20260928, prompt: { zh: "为我的一人公司制定90天可执行增长与销售计划。", en: "Create an executable 90-day growth and sales plan for my solo business." }, tags: { zh: ["轻量经营", "获客", "销售"], en: ["Lean ops", "Acquisition", "Sales"] } },
    { id: "global-team", category: "global", name: { zh: "全球市场拓展团队", en: "Global expansion team" }, desc: { zh: "市场研究、本地化、品牌策略和跨境运营协同。", en: "Market research, localization, brand strategy, and cross-border operations." }, members: [16, 10, 7], heat: 84, added: 20260926, prompt: { zh: "评估并规划产品进入三个目标市场的优先级与路径。", en: "Assess and plan the priority and route into three target markets." }, tags: { zh: ["市场进入", "本地化", "品牌"], en: ["Market entry", "Localization", "Brand"] } }
  ];

  var SKILLS = [
    { id: "design-system", category: "design", icon: "◈", name: { zh: "设计系统生成", en: "Design-system builder" }, desc: { zh: "从品牌原则生成令牌、组件与完整状态规范。", en: "Generate tokens, components, and states from brand principles." }, users: 12840, added: 20261006, tags: { zh: ["Tokens", "组件"], en: ["Tokens", "Components"] }, prompt: { zh: "为当前产品建立可扩展设计系统。", en: "Build an extensible design system for this product." }, hue: ["#dcebdd", "#47745b"] },
    { id: "research-synthesis", category: "design", icon: "⌘", name: { zh: "用户研究归纳", en: "Research synthesis" }, desc: { zh: "把访谈记录聚类为洞察、机会与设计原则。", en: "Cluster interviews into insights, opportunities, and principles." }, users: 8750, added: 20261002, tags: { zh: ["研究", "洞察"], en: ["Research", "Insights"] }, prompt: { zh: "归纳这批研究材料并输出机会地图。", en: "Synthesize these research notes into an opportunity map." }, hue: ["#e6dff1", "#6e5688"] },
    { id: "executive-writing", category: "content", icon: "✦", name: { zh: "高管级写作", en: "Executive writing" }, desc: { zh: "把复杂材料写成简洁、有证据、可决策的文本。", en: "Turn complex material into concise, evidence-led decision writing." }, users: 11210, added: 20260929, tags: { zh: ["写作", "摘要"], en: ["Writing", "Summary"] }, prompt: { zh: "将这些材料改写为高管级决策简报。", en: "Rewrite this material as an executive decision brief." }, hue: ["#e8e4d9", "#7b7056"] },
    { id: "content-calendar", category: "content", icon: "▦", name: { zh: "内容日历策划", en: "Content calendar" }, desc: { zh: "围绕目标受众规划主题、形式、渠道与复用路径。", en: "Plan topics, formats, channels, and repurposing around an audience." }, users: 7960, added: 20260925, tags: { zh: ["内容", "运营"], en: ["Content", "Ops"] }, prompt: { zh: "为我的品牌规划四周内容日历。", en: "Plan a four-week content calendar for my brand." }, hue: ["#e6ecda", "#667847"] },
    { id: "data-storytelling", category: "data", icon: "↗", name: { zh: "数据故事", en: "Data storytelling" }, desc: { zh: "选择正确图表并建立从证据到行动的叙事。", en: "Choose the right charts and build a narrative from evidence to action." }, users: 10330, added: 20261005, tags: { zh: ["图表", "叙事"], en: ["Charts", "Narrative"] }, prompt: { zh: "把这组数据转化为清晰的数据故事。", en: "Turn this dataset into a clear data story." }, hue: ["#dce9f0", "#48738a"] },
    { id: "sql-analysis", category: "data", icon: "⌁", name: { zh: "SQL分析助手", en: "SQL analysis assistant" }, desc: { zh: "从业务问题生成查询、验证口径并解释结果。", en: "Generate queries, validate metrics, and explain results." }, users: 9320, added: 20261001, tags: { zh: ["SQL", "指标"], en: ["SQL", "Metrics"] }, prompt: { zh: "根据业务问题设计分析SQL与验证步骤。", en: "Design analytical SQL and validation steps for this business question." }, hue: ["#e1e7ef", "#516783"] },
    { id: "frontend-audit", category: "engineering", icon: "</>", name: { zh: "前端质量审计", en: "Frontend quality audit" }, desc: { zh: "检查性能、无障碍、响应式和交互完整性。", en: "Audit performance, accessibility, responsive behavior, and interactions." }, users: 11950, added: 20261007, tags: { zh: ["性能", "A11y"], en: ["Performance", "A11y"] }, prompt: { zh: "对当前前端页面执行完整质量审计。", en: "Run a complete quality audit on this frontend." }, hue: ["#dbe9e4", "#3d735e"] },
    { id: "api-contract", category: "engineering", icon: "{ }", name: { zh: "API契约设计", en: "API contract design" }, desc: { zh: "定义一致、可演进并具备错误语义的接口契约。", en: "Define consistent, evolvable APIs with clear error semantics." }, users: 6840, added: 20261003, tags: { zh: ["API", "契约"], en: ["API", "Contracts"] }, prompt: { zh: "为这个功能设计可演进的API契约。", en: "Design an evolvable API contract for this feature." }, hue: ["#e8e1ef", "#705b82"] },
    { id: "growth-experiment", category: "growth", icon: "△", name: { zh: "增长实验设计", en: "Growth experiments" }, desc: { zh: "从问题到假设、指标、样本与决策规则。", en: "Move from problem to hypothesis, metrics, sample, and decision rule." }, users: 9850, added: 20261004, tags: { zh: ["实验", "增长"], en: ["Experiment", "Growth"] }, prompt: { zh: "围绕这个增长问题设计严谨实验。", en: "Design a rigorous experiment for this growth problem." }, hue: ["#e7ebd7", "#6c7c3d"] },
    { id: "brand-voice", category: "growth", icon: "Aa", name: { zh: "品牌语调校准", en: "Brand voice calibration" }, desc: { zh: "提炼语调原则并让跨渠道文案保持一致。", en: "Extract voice principles and keep cross-channel copy consistent." }, users: 7220, added: 20260924, tags: { zh: ["品牌", "文案"], en: ["Brand", "Copy"] }, prompt: { zh: "建立品牌语调指南并校准现有文案。", en: "Build a voice guide and calibrate the existing copy." }, hue: ["#f0e2dd", "#8d604e"] },
    { id: "meeting-to-plan", category: "operations", icon: "✓", name: { zh: "会议转行动计划", en: "Meeting to action plan" }, desc: { zh: "从会议记录提取决策、责任人、时间和风险。", en: "Extract decisions, owners, dates, and risks from meeting notes." }, users: 13410, added: 20260930, tags: { zh: ["会议", "执行"], en: ["Meetings", "Actions"] }, prompt: { zh: "把这份会议记录整理为行动计划。", en: "Turn these meeting notes into an action plan." }, hue: ["#e2e8e1", "#5a6f5f"] },
    { id: "risk-register", category: "operations", icon: "!", name: { zh: "项目风险台账", en: "Project risk register" }, desc: { zh: "识别风险并明确概率、影响、预警和应对责任。", en: "Document probability, impact, triggers, mitigation, and ownership." }, users: 6410, added: 20260926, tags: { zh: ["风险", "项目"], en: ["Risk", "Projects"] }, prompt: { zh: "为这个项目建立风险台账和预警机制。", en: "Create a risk register and early-warning system for this project." }, hue: ["#efe3da", "#8f6750"] }
  ];

  var CONNECTORS = [
    { id: "github", category: "engineering", icon: "GH", name: "GitHub", desc: { zh: "读取仓库、Issue 与 Pull Request 上下文。", en: "Read repository, issue, and pull-request context." }, tone: ["#e3e6e4", "#333a36"] },
    { id: "figma", category: "content", icon: "F", name: "Figma", desc: { zh: "导入设计文件、框架和组件元数据。", en: "Import design files, frames, and component metadata." }, tone: ["#eee2ea", "#8b4771"] },
    { id: "notion", category: "productivity", icon: "N", name: "Notion", desc: { zh: "引用文档、知识库和项目数据库。", en: "Reference docs, knowledge bases, and project databases." }, tone: ["#e8e6df", "#504f48"] },
    { id: "slack", category: "productivity", icon: "S", name: "Slack", desc: { zh: "把频道讨论和决策带入工作流。", en: "Bring channel discussions and decisions into the workflow." }, tone: ["#eee0ec", "#78506f"] },
    { id: "linear", category: "engineering", icon: "L", name: "Linear", desc: { zh: "同步需求、缺陷、周期和项目状态。", en: "Sync requirements, bugs, cycles, and project status." }, tone: ["#e3e1f1", "#5c5790"] },
    { id: "google-drive", category: "content", icon: "△", name: "Google Drive", desc: { zh: "引用云端文档、表格与演示文稿。", en: "Reference cloud docs, sheets, and presentations." }, tone: ["#e1ebdf", "#4c7848"] },
    { id: "airtable", category: "data", icon: "A", name: "Airtable", desc: { zh: "连接结构化业务数据与运营记录。", en: "Connect structured business data and operating records." }, tone: ["#e8e6da", "#82743f"] },
    { id: "postgres", category: "data", icon: "P", name: "PostgreSQL", desc: { zh: "通过受控查询读取分析数据。", en: "Read analytical data through controlled queries." }, tone: ["#dce6ef", "#426b8c"] },
    { id: "jira", category: "engineering", icon: "J", name: "Jira", desc: { zh: "连接项目、史诗、任务和发布计划。", en: "Connect projects, epics, tasks, and release plans." }, tone: ["#dfe7f2", "#426b9b"] },
    { id: "dropbox", category: "content", icon: "◆", name: "Dropbox", desc: { zh: "安全引用团队文件与共享素材。", en: "Securely reference team files and shared assets." }, tone: ["#dfe8f1", "#386d9d"] }
  ];

  var state = {
    lang: document.documentElement.lang && document.documentElement.lang.toLowerCase().indexOf("zh") === 0 ? "zh" : "en",
    mode: "experts",
    catalog: "people",
    category: "all",
    sort: "smart",
    query: "",
    mineOnly: false,
    saved: readSet("db-saved-experts"),
    connected: readSet("db-expert-connectors")
  };
  var lastFocus = null;
  var previousBodyOverflow = "";

  function readSet(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || "[]");
      return new Set(Array.isArray(value) ? value.filter(function (id) { return typeof id === "string"; }) : []);
    } catch (error) {
      return new Set();
    }
  }

  function saveSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(Array.from(value))); } catch (error) {}
  }

  function text(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value[state.lang] || value.zh || value.en || "";
    return String(value == null ? "" : value);
  }

  function c(key) { return COPY[state.lang][key]; }

  function esc(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function pluralNumber(value) {
    var n = Number(value) || 0;
    if (n >= 10000) return (n / 10000).toFixed(n >= 100000 ? 0 : 1) + (state.lang === "zh" ? "万" : "k");
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(n);
  }

  function avatarMarkup(item, index) {
    var hue = item.hue || ["#dce8e1", "#547563"];
    var skin = ["#f2c8a6", "#d99d79", "#efb990", "#bc7d5c"][(index || 0) % 4];
    var shirt = hue[1];
    var hair = ["#29312d", "#4a342d", "#28394d", "#5c3b2d"][(index || 0) % 4];
    var variant = (index || 0) % 3;
    var extra = variant === 0
      ? '<path d="M9 18c2-9 27-10 31 1l-3-8c-3-7-20-8-25-1Z" fill="' + hair + '"/>'
      : variant === 1
        ? '<path d="M12 18c2-8 8-12 15-12 8 0 12 5 13 12-6-5-21-5-28 0Z" fill="' + hair + '"/><circle cx="14" cy="21" r="5" fill="' + hair + '"/>'
        : '<path d="M10 21c0-10 7-15 16-15s15 6 15 15c-7-5-23-5-31 0Z" fill="' + hair + '"/><path d="M35 13c5 2 7 6 7 12" fill="none" stroke="' + hair + '" stroke-width="5" stroke-linecap="round"/>';
    return '<span class="expert-avatar" style="--avatar-bg:' + esc(hue[0]) + '" aria-hidden="true"><svg viewBox="0 0 52 52" role="img"><rect width="52" height="52" rx="14" fill="' + esc(hue[0]) + '"/><circle cx="42" cy="9" r="8" fill="#fff" opacity=".32"/><path d="M4 53c2-13 10-19 22-19 13 0 21 7 23 19Z" fill="' + esc(shirt) + '" opacity=".9"/><ellipse cx="26" cy="23" rx="13" ry="14" fill="' + skin + '"/>' + extra + '<circle cx="21" cy="24" r="1.3" fill="#28312d"/><circle cx="31" cy="24" r="1.3" fill="#28312d"/><path d="M22 30c2.7 2 5.5 2 8 0" fill="none" stroke="#925f4e" stroke-width="1.4" stroke-linecap="round"/></svg></span>';
  }

  function heroArt(kind, accent) {
    var common = 'fill="none" stroke="' + accent + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    if (kind === "content") return '<svg viewBox="0 0 150 86" aria-hidden="true"><circle cx="102" cy="34" r="18" fill="#f2c5a6"/><path d="M85 32c2-17 30-21 37-4l-5 5c-7-7-22-8-32-1Z" fill="#313735"/><path d="M89 50c-13 3-25 12-27 34h65c-2-20-12-31-25-34Z" fill="' + accent + '" opacity=".75"/><path d="M64 48 22 60M59 55 28 69" ' + common + '/><circle cx="20" cy="61" r="6" fill="#fff" opacity=".7"/><rect x="112" y="52" width="30" height="17" rx="5" fill="#fff" opacity=".62"/><path d="M118 60h17" ' + common + '/></svg>';
    if (kind === "finance") return '<svg viewBox="0 0 150 86" aria-hidden="true"><rect x="14" y="13" width="49" height="42" rx="8" fill="#fff" opacity=".6"/><path d="M24 45V33M36 45V25M48 45V19" ' + common + '/><circle cx="101" cy="31" r="17" fill="#e7b58d"/><path d="M84 28c3-17 31-18 36 1-11-4-23-4-36-1Z" fill="#303a43"/><path d="M74 84c3-24 14-35 29-35 16 0 29 12 31 35Z" fill="' + accent + '" opacity=".78"/><rect x="65" y="60" width="55" height="28" rx="5" fill="#fff" opacity=".8"/><path d="M74 69h36M74 76h25" ' + common + '/></svg>';
    if (kind === "business") return '<svg viewBox="0 0 150 86" aria-hidden="true"><rect x="17" y="22" width="36" height="31" rx="7" fill="#fff" opacity=".65"/><path d="M28 22v-6h14v6M26 35h18" ' + common + '/><circle cx="91" cy="31" r="15" fill="#d99b75"/><path d="M76 29c2-16 26-18 31-2-9-3-20-3-31 2Z" fill="#354039"/><path d="M68 83c2-23 12-34 25-34 15 0 26 12 28 34Z" fill="' + accent + '" opacity=".78"/><circle cx="128" cy="40" r="11" fill="#efc3a2"/><path d="M115 84c1-17 7-25 15-25 9 0 15 9 17 25Z" fill="#fff" opacity=".72"/></svg>';
    if (kind === "commerce") return '<svg viewBox="0 0 150 86" aria-hidden="true"><rect x="12" y="21" width="35" height="37" rx="7" fill="#fff" opacity=".6"/><path d="M21 31h17l-2 17H23Zm4 0v-4a5 5 0 0 1 9 0v4" ' + common + '/><circle cx="98" cy="30" r="16" fill="#ecc0a0"/><path d="M81 27c4-17 31-17 35 2-10-4-23-4-35-2Z" fill="#403738"/><path d="M71 84c3-24 14-35 29-35s27 12 30 35Z" fill="' + accent + '" opacity=".8"/><path d="m129 19 8 39M122 35h21" ' + common + '/><circle cx="137" cy="17" r="5" fill="#fff" opacity=".75"/></svg>';
    if (kind === "data") return '<svg viewBox="0 0 150 86" aria-hidden="true"><rect x="8" y="15" width="53" height="39" rx="8" fill="#fff" opacity=".63"/><path d="m18 44 10-12 9 6 14-16M19 22h14" ' + common + '/><circle cx="101" cy="31" r="16" fill="#efc19e"/><path d="M84 29c2-17 29-19 35-1-11-4-23-4-35 1Z" fill="#473839"/><path d="M71 84c3-23 14-34 30-34s27 12 30 34Z" fill="' + accent + '" opacity=".78"/><rect x="64" y="61" width="58" height="25" rx="5" fill="#fff" opacity=".76"/><path d="M72 78V68h5v10m5 0V64h5v14m5 0v-7h5v7" ' + common + '/></svg>';
    return '<svg viewBox="0 0 150 86" aria-hidden="true"><rect x="10" y="17" width="47" height="42" rx="9" fill="#fff" opacity=".64"/><path d="M20 29h27M20 38h21M20 47h16" ' + common + '/><circle cx="101" cy="30" r="16" fill="#e8b895"/><path d="M84 28c3-17 30-18 35 1-10-4-23-4-35-1Z" fill="#363b3a"/><path d="M72 84c2-23 14-35 29-35 16 0 28 13 30 35Z" fill="' + accent + '" opacity=".78"/><circle cx="133" cy="23" r="11" fill="#fff" opacity=".58"/><path d="m128 23 3 3 6-7" ' + common + '/></svg>';
  }

  function renderSpotlights() {
    var box = document.getElementById("expertSpotlights");
    if (!box) return;
    box.innerHTML = SPOTLIGHTS.map(function (item) {
      return '<article class="expert-spotlight-card"><div class="expert-spotlight-art" style="background:' + esc(item.tone) + '"><h3>' + esc(text(item.title)) + '</h3>' + heroArt(item.art, item.accent) + '</div><div class="expert-spotlight-links">' + item.links.map(function (link) {
        return '<button type="button" class="expert-spotlight-link" data-action="spotlight" data-category="' + esc(item.id) + '">' + esc(text(link)) + '</button>';
      }).join("") + '</div></article>';
    }).join("");
  }

  function currentCategories() {
    if (state.mode === "skills") return SKILL_CATEGORIES;
    if (state.mode === "connectors") return CONNECTOR_CATEGORIES;
    return CATEGORIES;
  }

  function renderCategories() {
    var categories = currentCategories();
    if (!categories.some(function (item) { return item.id === state.category; })) state.category = "all";
    document.getElementById("expertCategories").innerHTML = categories.map(function (item) {
      return '<button type="button" class="expert-category' + (state.category === item.id ? ' active' : '') + '" data-action="category" data-category="' + esc(item.id) + '">' + esc(item[state.lang]) + '</button>';
    }).join("");
  }

  function searchable(item) {
    var values = [text(item.name), text(item.desc), item.name && item.name.zh, item.name && item.name.en];
    var tags = item.tags && item.tags[state.lang];
    if (Array.isArray(tags)) values = values.concat(tags);
    return values.join(" ").toLowerCase();
  }

  function filteredItems() {
    var list;
    if (state.mode === "skills") list = SKILLS.slice();
    else if (state.mode === "connectors") list = CONNECTORS.slice();
    else list = state.catalog === "teams" ? TEAMS.slice() : EXPERTS.slice();
    var query = state.query.trim().toLowerCase();
    if (state.category !== "all") list = list.filter(function (item) { return item.category === state.category; });
    if (query) list = list.filter(function (item) { return searchable(item).indexOf(query) >= 0; });
    if (state.mode === "experts" && state.mineOnly) list = list.filter(function (item) { return state.saved.has(item.id); });
    if (state.mode !== "connectors" && state.sort !== "smart") {
      list.sort(function (a, b) {
        if (state.sort === "hot") return (b.heat || b.users || 0) - (a.heat || a.users || 0);
        return (b.added || 0) - (a.added || 0);
      });
    }
    return list;
  }

  function expertCard(item, index) {
    var saved = state.saved.has(item.id);
    return '<article class="expert-card" tabindex="0" role="button" data-action="detail" data-kind="expert" data-id="' + esc(item.id) + '" aria-label="' + esc(text(item.name)) + '"><div class="expert-card-top">' + avatarMarkup(item, EXPERTS.indexOf(item)) + '<div class="expert-card-copy"><h3>' + esc(text(item.name)) + '</h3><p>' + esc(text(item.desc)) + '</p></div><button type="button" class="expert-favorite' + (saved ? ' saved' : '') + '" data-action="favorite" data-id="' + esc(item.id) + '" aria-label="' + esc(saved ? c("saved") : c("save")) + '"><svg viewBox="0 0 24 24" fill="' + (saved ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg></button></div><div class="expert-card-bottom">' + item.tags[state.lang].slice(0, 3).map(function (tag) { return '<span class="expert-tag">' + esc(tag) + '</span>'; }).join("") + '</div><button type="button" class="expert-card-call" data-action="use" data-kind="expert" data-id="' + esc(item.id) + '">' + esc(c("call")) + '</button></article>';
  }

  function teamCard(item) {
    var saved = state.saved.has(item.id);
    return '<article class="expert-card expert-card-team" tabindex="0" role="button" data-action="detail" data-kind="team" data-id="' + esc(item.id) + '" style="--team-wash:' + esc(["rgba(135,234,92,.16)", "rgba(92,184,234,.15)", "rgba(179,154,236,.17)"][TEAMS.indexOf(item) % 3]) + '"><div class="expert-team-avatars">' + item.members.map(function (memberIndex) { return avatarMarkup(EXPERTS[memberIndex], memberIndex); }).join("") + '<span class="expert-team-count">' + item.members.length + (state.lang === "zh" ? " 位专家" : " experts") + '</span></div><div class="expert-team-copy"><h3>' + esc(text(item.name)) + '</h3><p>' + esc(text(item.desc)) + '</p></div><div class="expert-card-bottom">' + item.tags[state.lang].map(function (tag) { return '<span class="expert-tag">' + esc(tag) + '</span>'; }).join("") + '</div><button type="button" class="expert-favorite' + (saved ? ' saved' : '') + '" data-action="favorite" data-id="' + esc(item.id) + '" aria-label="' + esc(saved ? c("saved") : c("save")) + '"><svg viewBox="0 0 24 24" fill="' + (saved ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg></button><button type="button" class="expert-card-call" data-action="use" data-kind="team" data-id="' + esc(item.id) + '">' + esc(c("call")) + '</button></article>';
  }

  function skillCard(item) {
    return '<article class="expert-card" tabindex="0" role="button" data-action="detail" data-kind="skill" data-id="' + esc(item.id) + '"><div class="expert-card-top"><span class="expert-skill-icon" style="--skill-bg:' + esc(item.hue[0]) + ';--skill-ink:' + esc(item.hue[1]) + '">' + esc(item.icon) + '</span><div class="expert-card-copy"><h3>' + esc(text(item.name)) + '</h3><p>' + esc(text(item.desc)) + '</p></div></div><div class="expert-skill-meta"><span>' + esc(pluralNumber(item.users)) + (state.lang === "zh" ? " 次使用" : " uses") + '</span><i></i><span class="expert-verified">✓ ' + esc(c("verified")) + '</span><button type="button" class="expert-inline-action" data-action="use" data-kind="skill" data-id="' + esc(item.id) + '">' + esc(c("useSkill")) + '</button></div></article>';
  }

  function connectorCard(item) {
    var connected = state.connected.has(item.id);
    return '<article class="expert-card" data-connector="' + esc(item.id) + '"><div class="expert-card-top"><span class="expert-connector-icon" style="--skill-bg:' + esc(item.tone[0]) + ';--skill-ink:' + esc(item.tone[1]) + '">' + esc(item.icon) + '</span><div class="expert-card-copy"><h3>' + esc(item.name) + '</h3><p>' + esc(text(item.desc)) + '</p></div></div><div class="expert-connector-meta"><span>' + esc(connected ? c("connected") : state.lang === "zh" ? "尚未连接" : "Not connected") + '</span><i></i><span>' + esc(state.lang === "zh" ? "工作区级" : "Workspace") + '</span><button type="button" class="expert-inline-action' + (connected ? ' connected' : '') + '" data-action="connector" data-id="' + esc(item.id) + '">' + esc(connected ? c("disconnect") : c("connect")) + '</button></div></article>';
  }

  function emptyState() {
    var mine = state.mineOnly && state.mode === "experts";
    return '<div class="expert-empty"><div><div class="expert-empty-icon">' + (mine ? "☆" : "⌕") + '</div><h3>' + esc(mine ? c("noMine") : c("noResult")) + '</h3><p>' + esc(mine ? c("noMineBody") : c("noResultBody")) + '</p><button type="button" data-action="clear-filters">' + esc(c("browse")) + '</button></div></div>';
  }

  function renderCatalog() {
    var list = filteredItems();
    var grid = document.getElementById("expertGrid");
    grid.className = "expert-grid" + (state.mode === "skills" ? " skills-grid" : state.mode === "connectors" ? " connectors-grid" : "");
    if (!list.length) grid.innerHTML = emptyState();
    else if (state.mode === "skills") grid.innerHTML = list.map(skillCard).join("");
    else if (state.mode === "connectors") grid.innerHTML = list.map(connectorCard).join("");
    else if (state.catalog === "teams") grid.innerHTML = list.map(teamCard).join("");
    else grid.innerHTML = list.map(expertCard).join("");
    var count = document.getElementById("expertResultsCount");
    count.textContent = String(list.length);
    count.setAttribute("aria-label", list.length + " " + c("result"));
    Array.prototype.forEach.call(root.querySelectorAll("[data-expert-sort]"), function (button) {
      button.classList.toggle("active", button.getAttribute("data-expert-sort") === state.sort);
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-expert-catalog]"), function (button) {
      button.classList.toggle("active", button.getAttribute("data-expert-catalog") === state.catalog);
    });
    var mineButton = document.getElementById("expertMine");
    mineButton.classList.toggle("active", state.mineOnly);
    mineButton.setAttribute("aria-pressed", state.mineOnly ? "true" : "false");
    document.getElementById("expertMineCount").textContent = String(state.saved.size);
  }

  function renderShell() {
    Array.prototype.forEach.call(root.querySelectorAll("[data-expert-mode]"), function (button) {
      var mode = button.getAttribute("data-expert-mode");
      button.classList.toggle("active", mode === state.mode);
      button.setAttribute("aria-selected", mode === state.mode ? "true" : "false");
      button.querySelector("span").textContent = c(mode);
    });
    var search = document.getElementById("expertSearch");
    search.value = state.query;
    search.placeholder = c(state.mode === "skills" ? "searchSkills" : state.mode === "connectors" ? "searchConnectors" : "searchExperts");
    search.setAttribute("aria-label", search.placeholder);
    document.getElementById("expertMineLabel").textContent = c("mine");
    document.getElementById("expertMine").hidden = state.mode !== "experts";
    document.getElementById("expertSpotlightShell").hidden = state.mode !== "experts";
    document.getElementById("expertCatalogTabs").hidden = state.mode !== "experts";
    document.getElementById("expertSort").hidden = state.mode === "connectors";
    document.getElementById("expertPeopleLabel").textContent = c("people");
    document.getElementById("expertTeamsLabel").textContent = c("teams");
    document.getElementById("expertSortSmart").textContent = c("smart");
    document.getElementById("expertSortHot").textContent = c("hot");
    document.getElementById("expertSortNew").textContent = c("new");
    var context = document.getElementById("expertContextCopy");
    context.hidden = state.mode === "experts";
    if (state.mode !== "experts") context.innerHTML = '<strong>' + esc(c(state.mode === "skills" ? "skillContext" : "connectorContext")) + '</strong><span>' + esc(c(state.mode === "skills" ? "skillSub" : "connectorSub")) + '</span>';
    renderSpotlights();
    renderCategories();
    renderCatalog();
  }

  function findItem(kind, id) {
    var list = kind === "team" ? TEAMS : kind === "skill" ? SKILLS : EXPERTS;
    return list.filter(function (item) { return item.id === id; })[0] || null;
  }

  function itemPrompts(item) {
    var base = text(item.prompt);
    if (state.lang === "zh") return [base, "先评估现状与关键约束，再给出分阶段方案、明确交付物和验收标准。", "请审查我已有的方案，指出最重要的三个问题并给出可直接执行的修改稿。"];
    return [base, "Assess the current state and constraints, then propose phases, deliverables, and acceptance criteria.", "Review my current approach, identify the three most important issues, and provide an executable revision."];
  }

  function openDetail(kind, id) {
    var item = findItem(kind, id);
    if (!item) return;
    var overlay = document.getElementById("expertDetail");
    var index = kind === "expert" ? EXPERTS.indexOf(item) : 0;
    var tags = item.tags && item.tags[state.lang] || [];
    var calls = kind === "skill" ? item.users : Math.max(1200, (item.heat || 80) * 137);
    var rating = item.rating || (4.8).toFixed(1);
    document.getElementById("expertDetailBody").innerHTML = '<div class="expert-detail-identity">' + avatarMarkup(item, index) + '<div><h2 id="expertDetailTitle">' + esc(text(item.name)) + '</h2><span class="expert-verified">✓ ' + esc(c("verified")) + '</span></div></div><p class="expert-detail-description">' + esc(text(item.desc)) + '</p><div class="expert-detail-stats"><div class="expert-detail-stat"><b>' + esc(rating) + '</b><span>' + esc(c("rating")) + '</span></div><div class="expert-detail-stat"><b>' + esc(pluralNumber(calls)) + '</b><span>' + esc(c("calls")) + '</span></div><div class="expert-detail-stat"><b>&lt; 30s</b><span>' + esc(c("response")) + '</span></div></div><section class="expert-detail-section"><h3>' + esc(c("detailSkills")) + '</h3><div class="expert-detail-tags">' + tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("") + '</div></section><section class="expert-detail-section"><h3>' + esc(c("detailPrompts")) + '</h3><div class="expert-prompt-list">' + itemPrompts(item).map(function (prompt, promptIndex) { return '<button type="button" class="expert-prompt" data-action="use-prompt" data-kind="' + esc(kind) + '" data-id="' + esc(item.id) + '" data-prompt-index="' + promptIndex + '"><span>↗</span>' + esc(prompt) + '</button>'; }).join("") + '</div></section>';
    var saved = state.saved.has(item.id);
    var save = document.getElementById("expertDetailSave");
    save.classList.toggle("saved", saved);
    save.setAttribute("data-id", item.id);
    save.setAttribute("aria-label", saved ? c("saved") : c("save"));
    var use = document.getElementById("expertDetailUse");
    use.textContent = kind === "skill" ? c("useSkill") : c("use");
    use.setAttribute("data-id", item.id);
    use.setAttribute("data-kind", kind);
    document.getElementById("expertDetailClose").setAttribute("aria-label", c("close"));
    lastFocus = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () { document.getElementById("expertDetailClose").focus(); });
  }

  function closeDetail() {
    var overlay = document.getElementById("expertDetail");
    if (overlay.hidden) return;
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;
    if (lastFocus && lastFocus.isConnected && typeof lastFocus.focus === "function") lastFocus.focus();
    lastFocus = null;
  }

  function toggleFavorite(id) {
    if (!id) return;
    if (state.saved.has(id)) state.saved.delete(id);
    else state.saved.add(id);
    saveSet("db-saved-experts", state.saved);
    renderCatalog();
    var detail = document.getElementById("expertDetail");
    if (!detail.hidden) {
      var button = document.getElementById("expertDetailSave");
      button.classList.toggle("saved", state.saved.has(id));
      button.setAttribute("aria-label", state.saved.has(id) ? c("saved") : c("save"));
    }
  }

  function notify(message) {
    var host = window.StudioWorkbenchHost;
    if (host && typeof host.toast === "function") host.toast(message);
  }

  function useItem(kind, id, promptIndex) {
    var item = findItem(kind, id);
    if (!item) return;
    var prompts = itemPrompts(item);
    var task = Number.isInteger(promptIndex) && prompts[promptIndex] ? prompts[promptIndex] : text(item.prompt);
    var name = text(item.name);
    var composed = state.lang === "zh"
      ? "请以「" + name + "」的专业方法协助我完成以下任务：\n\n" + task + "\n\n请先确认目标与约束，再给出结构清晰、可直接执行的完整方案。"
      : "Use the professional approach of “" + name + "” to help with this task:\n\n" + task + "\n\nConfirm the objective and constraints first, then provide a structured, directly actionable solution.";
    closeDetail();
    var host = window.StudioWorkbenchHost;
    var prompt = host && typeof host.$ === "function" ? host.$("prompt") : document.getElementById("prompt");
    if (prompt) prompt.value = composed;
    if (host && typeof host.go === "function") host.go("home");
    else location.hash = "/home";
    setTimeout(function () {
      if (prompt) {
        prompt.focus();
        if (typeof prompt.setSelectionRange === "function") prompt.setSelectionRange(prompt.value.length, prompt.value.length);
      }
      notify(c("ready").replace("{name}", name));
    }, 40);
  }

  function toggleConnector(id) {
    var item = CONNECTORS.filter(function (connector) { return connector.id === id; })[0];
    if (!item) return;
    var connected;
    if (state.connected.has(id)) { state.connected.delete(id); connected = false; }
    else { state.connected.add(id); connected = true; }
    saveSet("db-expert-connectors", state.connected);
    renderCatalog();
    notify(c(connected ? "connectedToast" : "disconnectedToast").replace("{name}", item.name));
  }

  function setMode(mode) {
    if (["experts", "skills", "connectors"].indexOf(mode) < 0 || state.mode === mode) return;
    state.mode = mode;
    if (mode === "experts") state.catalog = "people";
    state.category = "all";
    state.query = "";
    state.mineOnly = false;
    renderShell();
  }

  root.addEventListener("input", function (event) {
    if (event.target.id !== "expertSearch") return;
    state.query = event.target.value;
    renderCatalog();
  });

  root.addEventListener("click", function (event) {
    var button = event.target.closest("[data-action], [data-expert-mode], [data-expert-catalog], [data-expert-sort]");
    if (!button || !root.contains(button)) return;
    if (button.hasAttribute("data-expert-mode")) return setMode(button.getAttribute("data-expert-mode"));
    if (button.hasAttribute("data-expert-catalog")) {
      state.catalog = button.getAttribute("data-expert-catalog") === "teams" ? "teams" : "people";
      state.category = "all";
      renderCategories();
      renderCatalog();
      return;
    }
    if (button.hasAttribute("data-expert-sort")) {
      state.sort = button.getAttribute("data-expert-sort");
      renderCatalog();
      return;
    }
    var action = button.getAttribute("data-action");
    if (action === "mine") { state.mineOnly = !state.mineOnly; renderCatalog(); return; }
    if (action === "favorite") { event.stopPropagation(); toggleFavorite(button.getAttribute("data-id")); return; }
    if (action === "category") { state.category = button.getAttribute("data-category"); renderCategories(); renderCatalog(); return; }
    if (action === "spotlight") {
      state.category = button.getAttribute("data-category");
      renderCategories();
      renderCatalog();
      var head = document.getElementById("expertCatalogHead");
      if (head && typeof head.scrollIntoView === "function") head.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "detail") return openDetail(button.getAttribute("data-kind"), button.getAttribute("data-id"));
    if (action === "use") { event.stopPropagation(); return useItem(button.getAttribute("data-kind"), button.getAttribute("data-id")); }
    if (action === "use-prompt") return useItem(button.getAttribute("data-kind"), button.getAttribute("data-id"), Number(button.getAttribute("data-prompt-index")));
    if (action === "connector") { event.stopPropagation(); return toggleConnector(button.getAttribute("data-id")); }
    if (action === "clear-filters") { state.category = "all"; state.query = ""; state.mineOnly = false; renderShell(); return; }
    if (action === "close-detail") return closeDetail();
    if (action === "detail-save") return toggleFavorite(button.getAttribute("data-id"));
    if (action === "spot-prev" || action === "spot-next") {
      var viewport = document.getElementById("expertSpotlightViewport");
      if (viewport) viewport.scrollBy({ left: (action === "spot-prev" ? -1 : 1) * Math.max(250, viewport.clientWidth * .72), behavior: "smooth" });
    }
  });

  root.addEventListener("keydown", function (event) {
    var card = event.target.closest('[data-action="detail"]');
    if (!card || event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openDetail(card.getAttribute("data-kind"), card.getAttribute("data-id"));
  });

  document.getElementById("expertDetail").addEventListener("click", function (event) {
    if (event.target === this) closeDetail();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !document.getElementById("expertDetail").hidden) closeDetail();
  });

  window.StudioExperts = {
    setLanguage: function (lang) {
      state.lang = lang === "zh" ? "zh" : "en";
      renderShell();
      if (!document.getElementById("expertDetail").hidden) closeDetail();
    },
    render: renderShell,
    getState: function () { return state; }
  };

  renderShell();
})();
