/* Catalog extension: 50 additional commercial kits.
   Each kit ships 13 screens (3 primary + 10 supporting) in both zh and en.
   Loaded before studio-templates.js, which merges this list into its library. */
(function (global) {
  "use strict";

  var CATALOG = [
    /* ── Web · marketing & product sites ─────────────────────────────── */
    {
      id: "helios-solar-landing", category: "web", kind: "landing", skin: "helios",
      accent: "#ffc23d", alt: "#37c9a6", bg: "#0d1712", surface: "#f7f9f3", ink: "#101b14", uses: "16.4k",
      zh: { name: "Helios 新能源官网", category: "清洁能源落地页", desc: "面向工商业的分布式光伏与储能方案落地页，含测算器、案例与补贴政策解读。", tags: ["新能源", "落地页", "转化"], pages: ["品牌首页", "解决方案", "在线测算"] },
      en: { name: "Helios Clean Energy", category: "Clean energy landing", desc: "A distributed solar and storage marketing site with an ROI calculator, case studies, and incentive explainers.", tags: ["Energy", "Landing", "Conversion"], pages: ["Home", "Solutions", "ROI calculator"] },
      more: { zh: ["技术架构", "项目案例", "客户评价", "补贴政策", "安装流程", "运维服务", "关于我们", "新闻中心", "预约勘察", "联系销售"], en: ["Technology", "Case studies", "Testimonials", "Incentives", "Install process", "O&M service", "About", "Newsroom", "Book a survey", "Contact sales"] }
    },
    {
      id: "cobalt-devops-landing", category: "web", kind: "landing", skin: "cobalt",
      accent: "#4f7cff", alt: "#00e0b8", bg: "#0b0f1c", surface: "#f4f6fc", ink: "#111528", uses: "22.1k",
      zh: { name: "Cobalt DevOps 平台", category: "开发者平台", desc: "CI/CD 与可观测性一体化平台官网，突出流水线截图、性能数字与免费试用入口。", tags: ["开发者", "SaaS", "SaaS 官网"], pages: ["产品首页", "平台能力", "定价方案"] },
      en: { name: "Cobalt DevOps Platform", category: "Developer platform", desc: "A CI/CD and observability platform site leading with pipeline visuals, benchmark numbers, and a free-trial path.", tags: ["Developer", "SaaS", "Platform"], pages: ["Product home", "Platform", "Pricing"] },
      more: { zh: ["集成生态", "安全合规", "性能基准", "客户故事", "开发者文档", "更新日志", "迁移指南", "企业版", "预约演示", "支持中心"], en: ["Integrations", "Security", "Benchmarks", "Customers", "Docs", "Changelog", "Migration", "Enterprise", "Book a demo", "Support"] }
    },
    {
      id: "verdant-climate-web", category: "web", kind: "landing", skin: "verdant",
      accent: "#7ae582", alt: "#3f7cff", bg: "#0e1a15", surface: "#f3faf3", ink: "#0f1d16", uses: "11.8k",
      zh: { name: "Verdant 气候科技", category: "气候科技官网", desc: "碳核算与减排路径平台，用数据故事讲清企业气候目标与落地节奏。", tags: ["碳中和", "数据故事", "B2B"], pages: ["使命首页", "碳核算平台", "减排路径"] },
      en: { name: "Verdant Climate Tech", category: "Climate technology", desc: "A carbon accounting and reduction pathway platform told through data stories and clear milestones.", tags: ["Carbon", "Data story", "B2B"], pages: ["Mission home", "Carbon platform", "Reduction path"] },
      more: { zh: ["方法论", "行业方案", "报告下载", "客户案例", "数据安全", "合作伙伴", "专家团队", "洞察博客", "申请试点", "联系我们"], en: ["Methodology", "Industries", "Reports", "Case studies", "Data security", "Partners", "Team", "Insights", "Pilot program", "Contact"] }
    },
    {
      id: "atlas-logistics-web", category: "web", kind: "landing", skin: "atlas",
      accent: "#ff7a45", alt: "#2f80ed", bg: "#101418", surface: "#f6f7f8", ink: "#141a20", uses: "9.7k",
      zh: { name: "Atlas 智慧物流", category: "供应链平台", desc: "全球货运可视化与仓储调度平台官网，含实时地图、服务网络与报价入口。", tags: ["物流", "供应链", "可视化"], pages: ["平台首页", "全球网络", "在线报价"] },
      en: { name: "Atlas Smart Logistics", category: "Supply chain platform", desc: "A freight visibility and warehouse orchestration site with live maps, service coverage, and instant quotes.", tags: ["Logistics", "Supply chain", "Visibility"], pages: ["Platform home", "Network", "Instant quote"] },
      more: { zh: ["服务矩阵", "时效承诺", "仓储网络", "关务合规", "客户案例", "行业方案", "轨迹追踪", "合作加盟", "开放 API", "客服中心"], en: ["Services", "SLA", "Warehousing", "Customs", "Case studies", "Industries", "Tracking", "Partners", "Open API", "Support"] }
    },
    {
      id: "nebula-cloud-web", category: "web", kind: "landing", skin: "nebula",
      accent: "#8b7cff", alt: "#39d2ff", bg: "#0c1020", surface: "#f5f5fb", ink: "#141530", uses: "18.9k",
      zh: { name: "Nebula 云服务", category: "云基础设施", desc: "面向出海团队的全球云基础设施官网，突出节点分布、价格对比与迁移方案。", tags: ["云计算", "全球", "基础设施"], pages: ["云平台首页", "全球节点", "价格对比"] },
      en: { name: "Nebula Cloud", category: "Cloud infrastructure", desc: "A global cloud infrastructure site for scaling teams, with edge map, price comparison, and migration paths.", tags: ["Cloud", "Global", "Infrastructure"], pages: ["Cloud home", "Edge map", "Pricing"] },
      more: { zh: ["计算实例", "对象存储", "容器服务", "数据库", "安全体系", "状态监控", "架构案例", "文档中心", "免费额度", "联系架构师"], en: ["Compute", "Object storage", "Containers", "Databases", "Security", "Status", "Architecture", "Docs", "Free tier", "Talk to an architect"] }
    },
    {
      id: "pulsewear-fitness-web", category: "web", kind: "landing", skin: "pulsewear",
      accent: "#d9ff3d", alt: "#ff5f8f", bg: "#111312", surface: "#f7f8f2", ink: "#16181a", uses: "14.6k",
      zh: { name: "PulseWear 智能穿戴", category: "消费硬件", desc: "智能手表新品发布页，包含参数对比、健康功能演示与预售倒计时。", tags: ["硬件", "新品发布", "预售"], pages: ["新品首页", "功能详解", "参数对比"] },
      en: { name: "PulseWear Smart Devices", category: "Consumer hardware", desc: "A smartwatch launch page with spec comparison, health feature demos, and a pre-order countdown.", tags: ["Hardware", "Launch", "Pre-order"], pages: ["Launch home", "Features", "Compare specs"] },
      more: { zh: ["健康监测", "运动模式", "续航表现", "设计工艺", "媒体报道", "用户评测", "手表表带", "配件生态", "预售下单", "门店体验"], en: ["Health tracking", "Workout modes", "Battery", "Design", "Press", "Reviews", "Bands", "Accessories", "Pre-order", "Find a store"] }
    },
    {
      id: "kira-coffee-web", category: "web", kind: "landing", skin: "kira",
      accent: "#c96f3c", alt: "#4f7d54", bg: "#f0e6d6", surface: "#fffaf1", ink: "#33241a", uses: "8.3k",
      zh: { name: "Kira 精品咖啡", category: "餐饮品牌站", desc: "手冲咖啡品牌官网，串起产地故事、冲煮指南与门店与订阅服务。", tags: ["咖啡", "品牌", "订阅"], pages: ["品牌首页", "产地故事", "订阅方案"] },
      en: { name: "Kira Specialty Coffee", category: "Café brand site", desc: "A specialty roaster site linking origin stories, brew guides, cafés, and coffee subscriptions.", tags: ["Coffee", "Brand", "Subscription"], pages: ["Brand home", "Origins", "Subscription"] },
      more: { zh: ["冲煮指南", "风味轮", "咖啡馆门店", "生豆批次", "咖啡器具", "礼盒定制", "企业采购", "会员计划", "咖啡课堂", "联系我们"], en: ["Brew guide", "Flavor wheel", "Cafés", "Green lots", "Brew gear", "Gift sets", "Wholesale", "Membership", "Classes", "Contact"] }
    },
    {
      id: "lumen-ai-web", category: "web", kind: "landing", skin: "lumenai",
      accent: "#5ce8c0", alt: "#a48bff", bg: "#0b1114", surface: "#f4f9f7", ink: "#0f1a18", uses: "26.7k",
      zh: { name: "Lumen AI 助手", category: "AI 产品官网", desc: "企业级 AI 助手官网，用真实对话演示、模型对比与安全说明完成价值传达。", tags: ["AI", "对话", "企业级"], pages: ["产品首页", "能力演示", "企业方案"] },
      en: { name: "Lumen AI Assistant", category: "AI product site", desc: "An enterprise AI assistant site built on live conversation demos, model comparisons, and security notes.", tags: ["AI", "Assistant", "Enterprise"], pages: ["Product home", "Live demo", "Enterprise"] },
      more: { zh: ["模型矩阵", "知识库问答", "工作流集成", "安全与隐私", "性能评测", "客户案例", "开发者 API", "定价方案", "快速上手", "预约咨询"], en: ["Models", "Knowledge Q&A", "Workflows", "Security", "Benchmarks", "Customers", "API", "Pricing", "Get started", "Contact"] }
    },
    {
      id: "harbor-fintech-web", category: "web", kind: "landing", skin: "harbor",
      accent: "#1e8e6e", alt: "#d9a13b", bg: "#0e1521", surface: "#f6f8fb", ink: "#0f1723", uses: "12.4k",
      zh: { name: "Harbor 金融科技", category: "金融科技官网", desc: "面向中小企业的资金管理平台官网，突出合规资质、接入流程与费率透明。", tags: ["金融", "合规", "B2B"], pages: ["平台首页", "资金能力", "费率说明"] },
      en: { name: "Harbor Fintech", category: "Financial technology", desc: "A treasury platform site for SMBs covering licensing, onboarding steps, and transparent fees.", tags: ["Finance", "Compliance", "B2B"], pages: ["Platform home", "Treasury", "Pricing"] },
      more: { zh: ["收付款", "多币种账户", "对账中心", "风控体系", "牌照资质", "安全认证", "开放接口", "客户案例", "开通账户", "联系顾问"], en: ["Payments", "Multi-currency", "Reconciliation", "Risk", "Licenses", "Certifications", "API", "Customers", "Open account", "Talk to sales"] }
    },
    {
      id: "orbital-space-web", category: "web", kind: "landing", skin: "orbital",
      accent: "#ff5b3d", alt: "#3fb6ff", bg: "#08090f", surface: "#f2f4f8", ink: "#101320", uses: "7.6k",
      zh: { name: "Orbital 航天科技", category: "深空科技公司", desc: "卫星发射服务官网，以任务时间线、载荷能力与轨道数据建立专业信任。", tags: ["航天", "硬科技", "任务"], pages: ["公司首页", "发射服务", "任务时间线"] },
      en: { name: "Orbital Space Systems", category: "Aerospace company", desc: "A launch services site built on mission timelines, payload capability, and orbital data.", tags: ["Aerospace", "Deep tech", "Missions"], pages: ["Company home", "Launch services", "Mission timeline"] },
      more: { zh: ["运载能力", "载荷适配", "地面站网", "在轨服务", "工程团队", "合作伙伴", "采购流程", "质量体系", "招聘职位", "媒体资源"], en: ["Payload capacity", "Integration", "Ground stations", "In-orbit service", "Engineering", "Partners", "Procurement", "Quality", "Careers", "Press kit"] }
    },
    {
      id: "mosaic-agency-web", category: "web", kind: "portfolio", skin: "mosaic",
      accent: "#ff4f36", alt: "#1f6fff", bg: "#161511", surface: "#f5f2e9", ink: "#fbf7ee", uses: "13.9k",
      zh: { name: "Mosaic 创意机构", category: "数字创意机构", desc: "整合创意机构官网，用大字体案例、服务清单与获奖记录强化专业形象。", tags: ["机构", "案例", "品牌"], pages: ["机构首页", "精选案例", "服务清单"] },
      en: { name: "Mosaic Creative Agency", category: "Digital agency", desc: "An integrated agency site with oversized case work, service inventory, and award record.", tags: ["Agency", "Case work", "Brand"], pages: ["Agency home", "Selected work", "Services"] },
      more: { zh: ["案例详情", "团队阵容", "获奖荣誉", "服务流程", "报价方式", "行业洞察", "招聘合作", "新闻采访", "客户评价", "项目咨询"], en: ["Case study", "Team", "Awards", "Process", "Engagements", "Insights", "Careers", "Press", "Testimonials", "Start a project"] }
    },
    {
      id: "summit-conference-web", category: "web", kind: "event", skin: "summit",
      accent: "#ffcc3d", alt: "#ef4f7a", bg: "#121022", surface: "#f6f4ef", ink: "#fdf8ee", uses: "10.5k",
      zh: { name: "Summit 行业峰会", category: "峰会官网", desc: "年度行业峰会官网，覆盖议程、嘉宾、会场与报名票务的完整链路。", tags: ["峰会", "议程", "报名"], pages: ["峰会首页", "嘉宾阵容", "议程安排"] },
      en: { name: "Summit Industry Forum", category: "Conference site", desc: "An annual forum site covering agenda, speakers, venue, and the full registration funnel.", tags: ["Conference", "Agenda", "Registration"], pages: ["Forum home", "Speakers", "Agenda"] },
      more: { zh: ["分论坛", "工作坊", "会场指南", "票务方案", "赞助合作", "媒体直播", "参会手册", "往届回顾", "报名确认", "常见问题"], en: ["Tracks", "Workshops", "Venue guide", "Tickets", "Sponsorship", "Livestream", "Handbook", "Highlights", "Confirmation", "FAQ"] }
    },
    {
      id: "cascade-wedding-site", category: "web", kind: "event", skin: "cascade",
      accent: "#e8a5a0", alt: "#7c9c86", bg: "#1d1b21", surface: "#fbf6f0", ink: "#fdf7f2", uses: "9.2k",
      zh: { name: "Cascade 婚礼邀请站", category: "婚礼请柬", desc: "沉浸式婚礼邀请站，包含故事线、行程安排、交通住宿与在线回执。", tags: ["婚礼", "邀请", "回执"], pages: ["邀请首页", "我们的故事", "行程安排"] },
      en: { name: "Cascade Wedding Invite", category: "Wedding invitation", desc: "An immersive wedding invitation with story timeline, schedule, travel notes, and RSVP.", tags: ["Wedding", "Invitation", "RSVP"], pages: ["Invitation", "Our story", "Schedule"] },
      more: { zh: ["婚礼仪式", "宴会流程", "交通住宿", "伴郎伴娘", "礼物建议", "照片墙", "祝福留言", "在线回执", "摄影团队", "联系我们"], en: ["Ceremony", "Reception", "Travel & stay", "Wedding party", "Registry", "Photo wall", "Wishes", "RSVP", "Photography", "Contact"] }
    },

    /* ── App · product interfaces ─────────────────────────────────────── */
    {
      id: "kepler-team-app", category: "app", kind: "app", skin: "kepler",
      accent: "#6c8cff", alt: "#ff9a5c", bg: "#0f1117", surface: "#f6f7fb", ink: "#12141c", uses: "19.8k",
      zh: { name: "Kepler 团队协作", category: "协作工作台", desc: "把任务、文档、审批集中到一处的团队协作工作台，支持多视图切换。", tags: ["协作", "任务", "工作流"], pages: ["工作台首页", "项目看板", "任务详情"] },
      en: { name: "Kepler Team Workspace", category: "Collaboration app", desc: "A team workspace unifying tasks, docs, and approvals with multi-view switching.", tags: ["Collaboration", "Tasks", "Workflow"], pages: ["Workspace", "Project board", "Task detail"] },
      more: { zh: ["收件箱", "日历视图", "文档空间", "审批流程", "团队成员", "权限设置", "自动化规则", "数据统计", "集成应用", "个人设置"], en: ["Inbox", "Calendar", "Docs", "Approvals", "Members", "Permissions", "Automation", "Insights", "Integrations", "Settings"] }
    },
    {
      id: "denta-clinic-booking", category: "app", kind: "booking", skin: "denta",
      accent: "#2aa8c4", alt: "#7ad1a8", bg: "#0f1a20", surface: "#f5fafc", ink: "#12242c", uses: "8.7k",
      zh: { name: "Denta 齿科预约", category: "诊所预约系统", desc: "牙科诊所在线预约系统，支持医生排班、时段选择与就诊提醒。", tags: ["医疗", "预约", "排班"], pages: ["预约首页", "医生排班", "预约确认"] },
      en: { name: "Denta Clinic Booking", category: "Clinic booking system", desc: "A dental clinic booking system with practitioner schedules, slot picking, and visit reminders.", tags: ["Health", "Booking", "Schedule"], pages: ["Booking home", "Schedules", "Confirmation"] },
      more: { zh: ["服务项目", "医生简介", "价格参考", "医保说明", "就诊须知", "病例分享", "复诊提醒", "会员权益", "患者评价", "联系诊所"], en: ["Treatments", "Practitioners", "Pricing", "Insurance", "Prep notes", "Case gallery", "Recall", "Membership", "Reviews", "Contact"] }
    },
    {
      id: "nomad-travel-app", category: "app", kind: "mobile", skin: "nomad",
      accent: "#ff8a4c", alt: "#2fb8d6", bg: "#101b26", surface: "#f7fafc", ink: "#f4f9fd", uses: "15.3k",
      zh: { name: "Nomad 旅行伴侣", category: "旅行 App", desc: "为长期旅行者设计的行程与预算管理 App，含离线地图与记账。", tags: ["旅行", "预算", "地图"], pages: ["行程总览", "每日计划", "花销统计"] },
      en: { name: "Nomad Travel Companion", category: "Travel app", desc: "An itinerary and budget companion for long trips, with offline maps and expense tracking.", tags: ["Travel", "Budget", "Maps"], pages: ["Trip overview", "Daily plan", "Spending"] },
      more: { zh: ["离线地图", "行程清单", "签证提醒", "航班动态", "住宿收藏", "同行伙伴", "旅行日记", "汇率换算", "保险信息", "个人资料"], en: ["Offline maps", "Checklists", "Visa notes", "Flights", "Stays", "Companions", "Journal", "Currency", "Insurance", "Profile"] }
    },
    {
      id: "cadence-music-player", category: "app", kind: "media", skin: "cadence",
      accent: "#b06bff", alt: "#ff6ba8", bg: "#12101c", surface: "#f7f5fd", ink: "#f8f6ff", uses: "21.9k",
      zh: { name: "Cadence 音乐播放", category: "音乐流媒体", desc: "高品质音乐播放器界面，包含歌词视图、队列管理与个性化推荐。", tags: ["音乐", "流媒体", "播放器"], pages: ["发现音乐", "正在播放", "我的歌单"] },
      en: { name: "Cadence Music Player", category: "Music streaming", desc: "A high-fidelity music player with lyric view, queue management, and personalized picks.", tags: ["Music", "Streaming", "Player"], pages: ["Discover", "Now playing", "Library"] },
      more: { zh: ["每日推荐", "电台频道", "播客节目", "艺人主页", "专辑详情", "歌词视图", "离线下载", "音质设置", "好友动态", "会员订阅"], en: ["Daily mix", "Radio", "Podcasts", "Artist", "Album", "Lyrics", "Downloads", "Audio quality", "Friends", "Membership"] }
    },
    {
      id: "bloom-habit-app", category: "app", kind: "mobile", skin: "bloom",
      accent: "#ffb347", alt: "#7fd6a8", bg: "#1b1712", surface: "#fdf8f0", ink: "#fdf7ee", uses: "13.4k",
      zh: { name: "Bloom 习惯养成", category: "生活 App", desc: "以连续打卡与可视化成长为核心的习惯养成 App，强调轻量陪伴感。", tags: ["习惯", "打卡", "成长"], pages: ["今日习惯", "打卡记录", "成长花园"] },
      en: { name: "Bloom Habit Tracker", category: "Lifestyle app", desc: "A habit tracker built around streaks and visual growth, with a light companion feel.", tags: ["Habits", "Streaks", "Growth"], pages: ["Today", "Streaks", "Garden"] },
      more: { zh: ["新建习惯", "提醒设置", "专注计时", "成就徽章", "周报总结", "好友挑战", "心情记录", "冥想音频", "数据导出", "个人设置"], en: ["New habit", "Reminders", "Focus timer", "Badges", "Weekly review", "Challenges", "Mood log", "Meditation", "Export", "Settings"] }
    },
    {
      id: "forge-developer-app", category: "app", kind: "app", skin: "forge",
      accent: "#39e0a8", alt: "#6f8cff", bg: "#0c1113", surface: "#f4f8f7", ink: "#0f1a17", uses: "17.2k",
      zh: { name: "Forge 开发者控制台", category: "开发工具", desc: "以终端风格呈现的开发者控制台，包含环境管理、日志检索与部署流水线。", tags: ["开发", "控制台", "部署"], pages: ["项目概览", "部署流水线", "日志检索"] },
      en: { name: "Forge Developer Console", category: "Developer tool", desc: "A terminal-flavored developer console with environment management, log search, and pipelines.", tags: ["Developer", "Console", "Deploy"], pages: ["Overview", "Pipeline", "Logs"] },
      more: { zh: ["环境变量", "密钥管理", "构建缓存", "域名绑定", "团队成员", "用量统计", "告警规则", "接口调试", "命令行接入", "账号设置"], en: ["Env vars", "Secrets", "Build cache", "Domains", "Members", "Usage", "Alerts", "API console", "CLI setup", "Account"] }
    },
    {
      id: "savor-food-delivery", category: "app", kind: "mobile", skin: "savor",
      accent: "#ff5a3c", alt: "#ffc23d", bg: "#1a1410", surface: "#fffaf4", ink: "#fdf6ee", uses: "18.1k",
      zh: { name: "Savor 外卖点单", category: "餐饮外卖", desc: "餐厅外卖点单 App，包含菜单筛选、加料选项、实时配送追踪。", tags: ["外卖", "点单", "配送"], pages: ["附近餐厅", "菜单点单", "配送追踪"] },
      en: { name: "Savor Food Delivery", category: "Food delivery", desc: "A restaurant delivery app with menu filters, add-on options, and live courier tracking.", tags: ["Delivery", "Ordering", "Tracking"], pages: ["Nearby", "Menu", "Tracking"] },
      more: { zh: ["分类筛选", "餐厅详情", "购物车", "优惠券", "支付方式", "订单历史", "评价晒单", "收藏餐厅", "会员订阅", "地址管理"], en: ["Categories", "Restaurant", "Cart", "Coupons", "Payment", "Orders", "Reviews", "Favorites", "Membership", "Addresses"] }
    },
    {
      id: "lifeline-health-app", category: "app", kind: "app", skin: "lifeline",
      accent: "#ff4d6d", alt: "#3fa7ff", bg: "#101319", surface: "#f6f8fb", ink: "#131820", uses: "12.6k",
      zh: { name: "Lifeline 健康管家", category: "健康管理", desc: "家庭健康档案与用药提醒 App，含体检报告解读与线上问诊入口。", tags: ["健康", "档案", "问诊"], pages: ["健康总览", "体检报告", "用药提醒"] },
      en: { name: "Lifeline Health Hub", category: "Health management", desc: "A family health record and medication reminder app with report reading and care access.", tags: ["Health", "Records", "Care"], pages: ["Health overview", "Reports", "Medication"] },
      more: { zh: ["家庭成员", "问诊记录", "疫苗提醒", "运动数据", "睡眠分析", "饮食记录", "医生随访", "紧急联系人", "保险服务", "隐私设置"], en: ["Family", "Consultations", "Vaccines", "Activity", "Sleep", "Nutrition", "Follow-ups", "Emergency", "Insurance", "Privacy"] }
    },

    /* ── Dashboards · ops & analytics ─────────────────────────────────── */
    {
      id: "vanta-security-ops", category: "dashboard", kind: "dashboard", skin: "vanta",
      accent: "#4dff9e", alt: "#5b7cff", bg: "#0b1013", surface: "#f5f9f7", ink: "#101820", uses: "14.8k",
      zh: { name: "Vanta 安全运营中心", category: "安全运营后台", desc: "威胁检测、事件响应与合规状态一体的安全运营看板。", tags: ["安全", "SRE", "合规"], pages: ["安全总览", "威胁事件", "响应流程"] },
      en: { name: "Vanta Security Ops", category: "Security operations", desc: "A security console unifying threat detection, incident response, and compliance posture.", tags: ["Security", "SRE", "Compliance"], pages: ["Overview", "Incidents", "Response"] },
      more: { zh: ["漏洞清单", "资产盘点", "访问审计", "策略配置", "告警规则", "值班排班", "取证记录", "合规报告", "日志检索", "系统设置"], en: ["Vulnerabilities", "Assets", "Access audit", "Policies", "Alerts", "On-call", "Forensics", "Compliance", "Log search", "Settings"] }
    },
    {
      id: "meridian-trading-terminal", category: "dashboard", kind: "dashboard", skin: "meridian",
      accent: "#ffc93d", alt: "#3ddc97", bg: "#0a0d0c", surface: "#f4f6f4", ink: "#121611", uses: "23.6k",
      zh: { name: "Meridian 交易终端", category: "量化交易台", desc: "多市场行情、持仓风险与策略回测的交易终端界面。", tags: ["交易", "行情", "风控"], pages: ["行情总览", "持仓风险", "策略回测"] },
      en: { name: "Meridian Trading Terminal", category: "Trading terminal", desc: "A multi-market terminal for quotes, position risk, and strategy backtesting.", tags: ["Trading", "Markets", "Risk"], pages: ["Markets", "Positions", "Backtest"] },
      more: { zh: ["深度盘口", "订单管理", "资金曲线", "保证金监控", "策略库", "信号提醒", "回测报告", "交易日志", "风控规则", "账户设置"], en: ["Order book", "Orders", "Equity curve", "Margin", "Strategies", "Signals", "Backtest report", "Trade log", "Risk rules", "Accounts"] }
    },
    {
      id: "helix-lab-dashboard", category: "dashboard", kind: "dashboard", skin: "helix",
      accent: "#57d9ff", alt: "#a0ff8f", bg: "#0d1418", surface: "#f4fafc", ink: "#10202a", uses: "6.8k",
      zh: { name: "Helix 实验室管理", category: "科研 LIMS", desc: "样本流转、实验排期与仪器状态组成的实验室管理平台。", tags: ["科研", "样本", "排期"], pages: ["样本总览", "实验排期", "仪器状态"] },
      en: { name: "Helix Lab Management", category: "Research LIMS", desc: "A lab platform covering sample flow, experiment scheduling, and instrument status.", tags: ["Research", "Samples", "Scheduling"], pages: ["Samples", "Scheduling", "Instruments"] },
      more: { zh: ["试剂库存", "质控数据", "协议模板", "数据导出", "团队协作", "仪器校准", "审批流转", "审计追踪", "报告生成", "系统设置"], en: ["Reagents", "QC data", "Protocols", "Export", "Team", "Calibration", "Approvals", "Audit trail", "Reports", "Settings"] }
    },
    {
      id: "civic-city-dashboard", category: "dashboard", kind: "dashboard", skin: "civic",
      accent: "#4f8cff", alt: "#ffa63d", bg: "#101720", surface: "#f6f8fb", ink: "#111a26", uses: "5.9k",
      zh: { name: "Civic 城市治理台", category: "政务数据平台", desc: "面向城市管理的运行监测平台，覆盖交通、环保与民生诉求。", tags: ["政务", "城市", "监测"], pages: ["城市总览", "交通运行", "民生诉求"] },
      en: { name: "Civic City Operations", category: "Government data", desc: "An urban operations platform tracking mobility, environment, and citizen requests.", tags: ["Government", "City", "Monitoring"], pages: ["City overview", "Mobility", "Citizen requests"] },
      more: { zh: ["环境监测", "能耗管理", "应急指挥", "网格事件", "数据共享", "指标口径", "专题分析", "公开数据", "值班调度", "系统配置"], en: ["Environment", "Energy", "Emergency", "Grid events", "Data sharing", "Metrics", "Analysis", "Open data", "Dispatch", "Config"] }
    },
    {
      id: "arable-farm-dashboard", category: "dashboard", kind: "dashboard", skin: "arable",
      accent: "#9ede4a", alt: "#3fb9c9", bg: "#131a10", surface: "#f7faf1", ink: "#182313", uses: "7.1k",
      zh: { name: "Arable 智慧农业", category: "农业物联网", desc: "地块墒情、农机调度与产量预测组成的农业管理平台。", tags: ["农业", "物联网", "预测"], pages: ["地块总览", "墒情监测", "产量预测"] },
      en: { name: "Arable Smart Farming", category: "Agri IoT", desc: "A farm platform combining field moisture, machinery dispatch, and yield forecasting.", tags: ["Agriculture", "IoT", "Forecast"], pages: ["Fields", "Moisture", "Yield"] },
      more: { zh: ["农机调度", "灌溉计划", "病虫害预警", "气象数据", "投入记录", "采收计划", "溯源信息", "成本核算", "合作社", "系统设置"], en: ["Machinery", "Irrigation", "Pest alerts", "Weather", "Inputs", "Harvest", "Traceability", "Costing", "Co-op", "Settings"] }
    },
    {
      id: "quantum-support-dashboard", category: "dashboard", kind: "dashboard", skin: "quantum",
      accent: "#7b6bff", alt: "#39d2ff", bg: "#0f1120", surface: "#f6f6fc", ink: "#141631", uses: "16.2k",
      zh: { name: "Quantum 客服工作台", category: "客户服务后台", desc: "工单分配、SLA 监控与知识库推荐一体的客服工作台。", tags: ["客服", "工单", "SLA"], pages: ["工单总览", "会话详情", "服务质量"] },
      en: { name: "Quantum Support Desk", category: "Customer support", desc: "A support workspace combining ticket routing, SLA tracking, and knowledge suggestions.", tags: ["Support", "Tickets", "SLA"], pages: ["Queue", "Conversation", "Quality"] },
      more: { zh: ["团队排班", "知识库", "话术模板", "客户档案", "满意度分析", "机器人配置", "渠道接入", "工单报表", "升级规则", "系统设置"], en: ["Scheduling", "Knowledge base", "Macros", "Customer profile", "CSAT", "Bot config", "Channels", "Reports", "Escalation", "Settings"] }
    },
    {
      id: "bolt-fleet-dashboard", category: "dashboard", kind: "dashboard", skin: "bolt",
      accent: "#ffb02e", alt: "#4a8cff", bg: "#12141a", surface: "#f7f8fa", ink: "#151922", uses: "8.4k",
      zh: { name: "Bolt 车队调度", category: "车联网调度", desc: "车辆定位、能耗与维保计划组成的车队调度平台。", tags: ["车联网", "调度", "维保"], pages: ["车队总览", "实时定位", "维保计划"] },
      en: { name: "Bolt Fleet Dispatch", category: "Fleet operations", desc: "A fleet dispatch platform covering vehicle location, energy use, and maintenance plans.", tags: ["Fleet", "Dispatch", "Maintenance"], pages: ["Fleet overview", "Live map", "Maintenance"] },
      more: { zh: ["驾驶行为", "能耗分析", "路线优化", "司机管理", "事故记录", "保险管理", "加油充电", "费用结算", "合规审验", "系统设置"], en: ["Driver behavior", "Energy", "Route optimization", "Drivers", "Incidents", "Insurance", "Refueling", "Billing", "Compliance", "Settings"] }
    },
    {
      id: "ember-energy-dashboard", category: "dashboard", kind: "dashboard", skin: "ember",
      accent: "#ff7a3d", alt: "#ffd23d", bg: "#141110", surface: "#faf7f4", ink: "#231715", uses: "6.3k",
      zh: { name: "Ember 能源监控", category: "能源管理", desc: "园区用电、储能与碳排放实时监控与优化建议平台。", tags: ["能源", "储能", "碳排"], pages: ["能耗总览", "储能调度", "碳排放"] },
      en: { name: "Ember Energy Monitor", category: "Energy management", desc: "Real-time campus power, storage, and carbon monitoring with optimization guidance.", tags: ["Energy", "Storage", "Carbon"], pages: ["Consumption", "Storage", "Carbon"] },
      more: { zh: ["分项计量", "峰谷分析", "设备台账", "告警记录", "节能建议", "费用报表", "负荷预测", "并网状态", "运维工单", "系统设置"], en: ["Submetering", "Peak/shoulder", "Asset register", "Alarms", "Savings", "Billing", "Load forecast", "Grid status", "Work orders", "Settings"] }
    },
    {
      id: "atrium-talent-dashboard", category: "dashboard", kind: "dashboard", skin: "atrium",
      accent: "#ff8fb1", alt: "#6f9cff", bg: "#171420", surface: "#fbf8fb", ink: "#1d1726", uses: "9.1k",
      zh: { name: "Atrium 人才管理", category: "人力资源后台", desc: "招聘漏斗、绩效周期与人才盘点组成的人力资源工作台。", tags: ["HR", "招聘", "绩效"], pages: ["人才总览", "招聘漏斗", "绩效周期"] },
      en: { name: "Atrium Talent Suite", category: "People analytics", desc: "A people operations workspace spanning hiring funnel, performance cycles, and talent review.", tags: ["HR", "Hiring", "Performance"], pages: ["Talent overview", "Hiring funnel", "Performance"] },
      more: { zh: ["职位管理", "候选人详情", "面试安排", "入职流程", "培训计划", "薪酬带宽", "组织架构", "离职分析", "员工调研", "系统设置"], en: ["Requisitions", "Candidates", "Interviews", "Onboarding", "Learning", "Comp bands", "Org chart", "Attrition", "Surveys", "Settings"] }
    },
    {
      id: "ledger-finance-dashboard", category: "dashboard", kind: "dashboard", skin: "ledger",
      accent: "#2fbf8f", alt: "#e0b23d", bg: "#0d1512", surface: "#f5faf7", ink: "#122019", uses: "11.7k",
      zh: { name: "Ledger 财务共享中心", category: "财务中台", desc: "应收应付、资金计划与合并报表组成的财务共享中心。", tags: ["财务", "报表", "对账"], pages: ["财务总览", "应收应付", "合并报表"] },
      en: { name: "Ledger Finance Center", category: "Finance operations", desc: "A shared-service finance center for AR/AP, cash planning, and consolidated reporting.", tags: ["Finance", "Reporting", "Reconciliation"], pages: ["Overview", "AR / AP", "Consolidation"] },
      more: { zh: ["资金计划", "发票管理", "费用报销", "预算控制", "成本中心", "税务申报", "审计底稿", "汇率管理", "凭证查询", "系统设置"], en: ["Cash plan", "Invoices", "Expenses", "Budgets", "Cost centers", "Tax filing", "Audit files", "FX rates", "Journals", "Settings"] }
    },

    /* ── Commerce · storefronts ───────────────────────────────────────── */
    {
      id: "atelier-fashion-store", category: "commerce", kind: "commerce", skin: "atelier",
      accent: "#c8593f", alt: "#3d5a80", bg: "#efe8dd", surface: "#fffdf9", ink: "#231c17", uses: "17.5k",
      zh: { name: "Atelier 时装电商", category: "设计师时装", desc: "设计师女装电商，以胶囊系列、材质说明与穿搭指南驱动购买决策。", tags: ["时装", "电商", "系列"], pages: ["系列首页", "单品详情", "购物袋"] },
      en: { name: "Atelier Fashion Store", category: "Designer fashion", desc: "A designer womenswear storefront driven by capsule drops, material notes, and styling guides.", tags: ["Fashion", "Storefront", "Capsule"], pages: ["Collection", "Product", "Bag"] },
      more: { zh: ["新品上架", "分类导航", "尺码指南", "材质工艺", "穿搭指南", "模特试穿", "会员权益", "退换政策", "门店地址", "品牌故事"], en: ["New arrivals", "Categories", "Size guide", "Materials", "Styling", "Fit notes", "Membership", "Returns", "Boutiques", "About"] }
    },
    {
      id: "grove-organic-store", category: "commerce", kind: "commerce", skin: "grove",
      accent: "#5f9c3f", alt: "#d98a3d", bg: "#eef2e6", surface: "#fffdf6", ink: "#1e2a17", uses: "12.2k",
      zh: { name: "Grove 有机生鲜", category: "生鲜电商", desc: "有机生鲜订阅电商，包含周期配送、产地溯源与营养搭配建议。", tags: ["生鲜", "订阅", "溯源"], pages: ["商城首页", "商品详情", "订阅配送"] },
      en: { name: "Grove Organic Market", category: "Grocery e-commerce", desc: "An organic grocery subscription store with recurring delivery, provenance, and nutrition pairings.", tags: ["Grocery", "Subscription", "Provenance"], pages: ["Shop", "Product", "Delivery plan"] },
      more: { zh: ["当季推荐", "分类选购", "产地直采", "营养搭配", "配送日历", "订单管理", "账户余额", "优惠活动", "农场伙伴", "客户服务"], en: ["Seasonal", "Categories", "Sourcing", "Nutrition", "Delivery calendar", "Orders", "Wallet", "Offers", "Farms", "Support"] }
    },
    {
      id: "volt-electronics-store", category: "commerce", kind: "commerce", skin: "volt",
      accent: "#3d6cff", alt: "#22c6a8", bg: "#e9edf5", surface: "#ffffff", ink: "#141a2b", uses: "20.4k",
      zh: { name: "Volt 数码商城", category: "3C 电商", desc: "数码配件与智能家居商城，含参数对比、套装组合与以旧换新。", tags: ["3C", "电商", "对比"], pages: ["商城首页", "商品对比", "结算页"] },
      en: { name: "Volt Electronics Store", category: "Electronics retail", desc: "A gadgets and smart-home store with spec comparison, bundles, and trade-in options.", tags: ["Electronics", "Retail", "Compare"], pages: ["Store home", "Compare", "Checkout"] },
      more: { zh: ["热门榜单", "新品首发", "配件套装", "以旧换新", "延保服务", "分期付款", "会员日", "门店自提", "售后维修", "帮助中心"], en: ["Best sellers", "New arrivals", "Bundles", "Trade-in", "Warranty", "Instalments", "Member day", "Store pickup", "Repairs", "Help"] }
    },
    {
      id: "petal-florist-store", category: "commerce", kind: "commerce", skin: "petal",
      accent: "#e0629a", alt: "#8fc27a", bg: "#f6ecef", surface: "#fffbfc", ink: "#2a1c24", uses: "7.8k",
      zh: { name: "Petal 花艺工作室", category: "花艺电商", desc: "花艺工作室订花商城，含节日花束、定期订阅与卡片寄语服务。", tags: ["花艺", "订阅", "礼品"], pages: ["花艺首页", "花束详情", "配送时间"] },
      en: { name: "Petal Florist Studio", category: "Florist storefront", desc: "A florist shop with seasonal bouquets, recurring subscriptions, and gift-note service.", tags: ["Florist", "Subscription", "Gifting"], pages: ["Shop", "Bouquet", "Delivery"] },
      more: { zh: ["节日花束", "婚礼花艺", "商务用花", "花材科普", "养护指南", "卡片寄语", "订阅方案", "配送范围", "门店体验", "品牌故事"], en: ["Holiday", "Weddings", "Corporate", "Flower guide", "Care tips", "Gift notes", "Subscriptions", "Delivery areas", "Workshop", "Story"] }
    },
    {
      id: "summit-outdoor-store", category: "commerce", kind: "commerce", skin: "summitoutdoor",
      accent: "#e0803d", alt: "#3f7d6a", bg: "#eae6dd", surface: "#fdfbf7", ink: "#221f19", uses: "9.9k",
      zh: { name: "Summit 户外装备", category: "户外电商", desc: "登山徒步装备商城，含装备清单推荐、海拔适配与测评内容。", tags: ["户外", "装备", "内容"], pages: ["装备首页", "产品详情", "装备清单"] },
      en: { name: "Summit Outdoor Gear", category: "Outdoor retail", desc: "A hiking and climbing gear store with kit lists, altitude guidance, and field reviews.", tags: ["Outdoor", "Gear", "Content"], pages: ["Store home", "Product", "Kit list"] },
      more: { zh: ["新品装备", "按场景选购", "装备对比", "专业测评", "保养维修", "租赁服务", "向导推荐", "退换政策", "线下活动", "会员中心"], en: ["New gear", "Shop by activity", "Compare", "Field tests", "Repairs", "Rentals", "Guides", "Returns", "Events", "Membership"] }
    },
    {
      id: "lumen-eyewear-store", category: "commerce", kind: "commerce", skin: "lumeneye",
      accent: "#2f6f8f", alt: "#d9a55c", bg: "#e8eef2", surface: "#ffffff", ink: "#132029", uses: "8.1k",
      zh: { name: "Lumen 眼镜定制", category: "眼镜电商", desc: "支持虚拟试戴、脸型匹配与镜片配置的眼镜定制商城。", tags: ["眼镜", "试戴", "定制"], pages: ["镜框首页", "虚拟试戴", "配镜下单"] },
      en: { name: "Lumen Eyewear Studio", category: "Eyewear e-commerce", desc: "An eyewear store with virtual try-on, face-shape matching, and lens configuration.", tags: ["Eyewear", "Try-on", "Custom"], pages: ["Frames", "Try-on", "Lens order"] },
      more: { zh: ["镜框分类", "脸型指南", "镜片选择", "度数与瞳距", "材质对比", "儿童镜架", "太阳镜系列", "门店验光", "售后服务", "会员权益"], en: ["Categories", "Face guide", "Lenses", "Prescription", "Materials", "Kids", "Sunglasses", "In-store exam", "Aftercare", "Membership"] }
    },
    {
      id: "craft-ceramics-store", category: "commerce", kind: "commerce", skin: "craft",
      accent: "#a35a3d", alt: "#5a7d6a", bg: "#efe9df", surface: "#fffdf8", ink: "#2a211b", uses: "5.6k",
      zh: { name: "Craft 手作陶器", category: "手作电商", desc: "独立陶艺工作室商城，突出器物故事、手作批次与定制刻字。", tags: ["手作", "器物", "定制"], pages: ["器物首页", "作家系列", "定制刻字"] },
      en: { name: "Craft Ceramics Studio", category: "Artisan goods", desc: "An independent pottery studio storefront highlighting vessel stories, batches, and custom engraving.", tags: ["Artisan", "Ceramics", "Custom"], pages: ["Shop", "Makers", "Engraving"] },
      more: { zh: ["新品器物", "茶杯系列", "餐盘系列", "花器系列", "工艺过程", "批次编号", "养护说明", "礼盒包装", "体验课程", "工作坊地址"], en: ["New work", "Teaware", "Tableware", "Vases", "Process", "Batch codes", "Care", "Gift boxes", "Classes", "Studio"] }
    },

    /* ── Deck · decks, reports, editorial ─────────────────────────────── */
    {
      id: "pioneer-pitch-deck", category: "deck", kind: "deck", skin: "pioneer",
      accent: "#ffd23d", alt: "#4f8cff", bg: "#141a2e", surface: "#f7f5ee", ink: "#181d2e", uses: "24.3k",
      zh: { name: "Pioneer 融资路演", category: "投资人路演", desc: "面向 A 轮融资的完整路演，用市场数据、产品壁垒与增长模型讲清故事。", tags: ["融资", "路演", "增长"], pages: ["愿景封面", "市场机会", "增长模型"] },
      en: { name: "Pioneer Investor Deck", category: "Fundraising deck", desc: "A Series A narrative covering market data, product moat, and the growth model.", tags: ["Fundraising", "Deck", "Growth"], pages: ["Vision", "Market", "Growth model"] },
      more: { zh: ["用户痛点", "产品方案", "技术壁垒", "商业模式", "竞争格局", "获客策略", "关键指标", "团队介绍", "财务预测", "融资用途"], en: ["Pain points", "Solution", "Technology moat", "Business model", "Competition", "Go-to-market", "Key metrics", "Team", "Financial plan", "Use of funds"] }
    },
    {
      id: "northwind-annual-report", category: "deck", kind: "report", skin: "northwind",
      accent: "#e0b23d", alt: "#2f7d8f", bg: "#1b2430", surface: "#f6f2e8", ink: "#1c2632", uses: "10.1k",
      zh: { name: "Northwind 年度报告", category: "上市公司年报", desc: "以财务表现、战略回顾与可持续发展章节构成的专业年报。", tags: ["年报", "财务", "ESG"], pages: ["年报封面", "经营回顾", "财务表现"] },
      en: { name: "Northwind Annual Report", category: "Corporate annual report", desc: "A polished annual report spanning financial performance, strategy review, and sustainability.", tags: ["Annual report", "Finance", "ESG"], pages: ["Cover", "Business review", "Financials"] },
      more: { zh: ["主席致辞", "业务板块", "区域表现", "创新投入", "人才发展", "治理结构", "风险管理", "ESG 进展", "股东信息", "附录数据"], en: ["Chairman letter", "Segments", "Regions", "Innovation", "People", "Governance", "Risk", "ESG", "Shareholders", "Appendix"] }
    },
    {
      id: "sage-research-paper", category: "deck", kind: "report", skin: "sage",
      accent: "#4f7d54", alt: "#c07a3d", bg: "#e8ece3", surface: "#fffdf7", ink: "#1d2a1c", uses: "7.3k",
      zh: { name: "Sage 研究报告", category: "行业研究", desc: "行业深度研究报告版式，含数据图表、方法论与结论摘要。", tags: ["研究", "图表", "方法论"], pages: ["报告封面", "核心发现", "数据图表"] },
      en: { name: "Sage Research Paper", category: "Industry research", desc: "An in-depth research report layout with charts, methodology, and an executive summary.", tags: ["Research", "Charts", "Method"], pages: ["Cover", "Key findings", "Data"] },
      more: { zh: ["研究背景", "方法论", "样本说明", "案例研究", "对比分析", "风险评估", "趋势预测", "专家访谈", "引用来源", "下载资源"], en: ["Background", "Methodology", "Sample", "Case studies", "Comparison", "Risks", "Forecast", "Interviews", "References", "Downloads"] }
    },
    {
      id: "prism-design-system-doc", category: "deck", kind: "editorial", skin: "prism",
      accent: "#6f5bff", alt: "#ff7a9c", bg: "#eef0f8", surface: "#ffffff", ink: "#161a2e", uses: "15.9k",
      zh: { name: "Prism 设计系统文档", category: "设计系统文档", desc: "组件规范、设计令牌与使用示例标准化呈现的设计系统文档。", tags: ["设计系统", "组件", "文档"], pages: ["系统封面", "设计令牌", "组件规范"] },
      en: { name: "Prism Design System Docs", category: "Design system docs", desc: "Design system documentation standardizing components, tokens, and usage examples.", tags: ["Design system", "Components", "Docs"], pages: ["Cover", "Tokens", "Components"] },
      more: { zh: ["色彩体系", "字体排版", "间距网格", "图标规范", "组件状态", "无障碍规范", "动效规范", "代码示例", "版本记录", "贡献指南"], en: ["Color", "Typography", "Spacing", "Icons", "States", "Accessibility", "Motion", "Code", "Changelog", "Contributing"] }
    },
    {
      id: "chronicle-magazine", category: "deck", kind: "editorial", skin: "chronicle",
      accent: "#c0392b", alt: "#2c3e50", bg: "#f2ece3", surface: "#fffdf8", ink: "#231c16", uses: "11.4k",
      zh: { name: "Chronicle 数字杂志", category: "数字杂志", desc: "长篇专题报道版式，包含图文混排、引文与阅读进度提示。", tags: ["杂志", "专题", "长文"], pages: ["杂志封面", "专题报道", "专栏文章"] },
      en: { name: "Chronicle Digital Magazine", category: "Digital magazine", desc: "Long-form feature layouts with mixed imagery, pull quotes, and reading progress.", tags: ["Magazine", "Features", "Long-form"], pages: ["Cover", "Feature", "Columns"] },
      more: { zh: ["目录页", "封面故事", "人物专访", "图片故事", "数据专题", "读者来信", "编辑推荐", "往期回顾", "订阅方式", "关于编辑部"], en: ["Contents", "Cover story", "Interview", "Photo essay", "Data feature", "Letters", "Editor picks", "Archive", "Subscribe", "Masthead"] }
    },

    /* ── Brand · identity systems ─────────────────────────────────────── */
    {
      id: "strata-brand-book", category: "brand", kind: "brand", skin: "strata",
      accent: "#ff5c39", alt: "#1f4fd8", bg: "#e6e2d8", surface: "#fbf8f2", ink: "#17161a", uses: "13.2k",
      zh: { name: "Strata 品牌手册", category: "品牌规范手册", desc: "从标志网格、色彩系统到场景应用的完整品牌规范手册。", tags: ["品牌", "规范", "视觉"], pages: ["品牌理念", "标志规范", "色彩系统"] },
      en: { name: "Strata Brand Book", category: "Brand guidelines", desc: "A complete brand book from logo grids and color systems to real-world applications.", tags: ["Brand", "Guidelines", "Identity"], pages: ["Brand idea", "Logo rules", "Color system"] },
      more: { zh: ["字体规范", "图形元素", "版式网格", "摄影风格", "插画风格", "物料应用", "数字应用", "空间导视", "品牌语气", "资源下载"], en: ["Typography", "Graphic elements", "Layout grid", "Photography", "Illustration", "Print", "Digital", "Signage", "Tone of voice", "Assets"] }
    },
    {
      id: "nova-brand-refresh", category: "brand", kind: "brand", skin: "nova",
      accent: "#a06bff", alt: "#ffb347", bg: "#e8e6f0", surface: "#fdfcff", ink: "#1a1726", uses: "8.9k",
      zh: { name: "Nova 品牌焕新", category: "品牌升级方案", desc: "面向品牌升级项目的对比提案，清楚呈现旧版与新版视觉差异。", tags: ["品牌升级", "提案", "对比"], pages: ["焕新概述", "标志对比", "应用演示"] },
      en: { name: "Nova Brand Refresh", category: "Rebrand proposal", desc: "A rebrand proposal that shows before-and-after identity decisions with clear rationale.", tags: ["Rebrand", "Proposal", "Comparison"], pages: ["Overview", "Logo before/after", "Applications"] },
      more: { zh: ["调研洞察", "竞品分析", "色彩演变", "字体升级", "动态标识", "包装系统", "社媒模板", "落地节奏", "成本预算", "验收清单"], en: ["Research", "Competitive", "Color shift", "Type upgrade", "Motion logo", "Packaging", "Social kit", "Rollout", "Budget", "Checklist"] }
    },
    {
      id: "pulse-brand-campaign", category: "brand", kind: "campaign", skin: "pulsebrand",
      accent: "#ff3d7f", alt: "#3d5cff", bg: "#f3e3ee", surface: "#fffcfe", ink: "#2b1425", uses: "10.8k",
      zh: { name: "Pulse 品牌战役包", category: "营销战役", desc: "整合主视觉、内容排期与投放复盘的品牌战役执行包。", tags: ["战役", "内容", "投放"], pages: ["战役主视觉", "内容排期", "投放复盘"] },
      en: { name: "Pulse Brand Campaign", category: "Marketing campaign", desc: "An integrated campaign kit spanning key visual, content calendar, and media review.", tags: ["Campaign", "Content", "Media"], pages: ["Key visual", "Calendar", "Media review"] },
      more: { zh: ["人群洞察", "传播主张", "视觉系统", "短视频脚本", "海报系列", "KOL 合作", "预算分配", "投放渠道", "数据看板", "结案报告"], en: ["Audience", "Message", "Visual system", "Video scripts", "Posters", "Creator collabs", "Budget", "Channels", "Dashboard", "Wrap-up"] }
    },
    {
      id: "roamwild-travel-feed", category: "app", kind: "feed", skin: "roamwild",
      accent: "#ff8a3d", alt: "#2fb8a6", bg: "#101b1c", surface: "#f6faf9", ink: "#f6fbf9", uses: "14.1k",
      zh: { name: "Roamwild 旅行社区", category: "内容社区", desc: "旅行者的图文社区，含瀑布流内容、话题聚合与创作者主页。", tags: ["社区", "内容", "创作者"], pages: ["社区首页", "话题聚合", "创作者主页"] },
      en: { name: "Roamwild Travel Community", category: "Content community", desc: "A visual travel community with a discovery feed, topic hubs, and creator profiles.", tags: ["Community", "Content", "Creators"], pages: ["Feed", "Topics", "Creator"] },
      more: { zh: ["发布内容", "附近的人", "收藏夹", "私信互动", "直播预告", "行程招募", "攻略合辑", "打卡地图", "等级成长", "账号设置"], en: ["Compose", "Nearby", "Collections", "Messages", "Live", "Trip buddies", "Guides", "Check-in map", "Levels", "Account"] }
    },
    {
      id: "chatter-podcast-media", category: "app", kind: "media", skin: "chatter",
      accent: "#ff6b4a", alt: "#5b7cff", bg: "#141118", surface: "#f8f5fa", ink: "#fbf7fc", uses: "12.8k",
      zh: { name: "Chatter 播客平台", category: "音频平台", desc: "播客收听与创作平台，含节目详情、章节标记与文字稿。", tags: ["播客", "音频", "文字稿"], pages: ["发现节目", "节目详情", "收听播放"] },
      en: { name: "Chatter Podcast Platform", category: "Audio platform", desc: "A podcast listening and publishing platform with show pages, chapters, and transcripts.", tags: ["Podcast", "Audio", "Transcript"], pages: ["Discover", "Show", "Player"] },
      more: { zh: ["分类榜单", "订阅管理", "播放队列", "章节标记", "文字稿", "创作后台", "录音上传", "数据统计", "评论互动", "会员方案"], en: ["Charts", "Subscriptions", "Queue", "Chapters", "Transcript", "Studio", "Upload", "Analytics", "Comments", "Membership"] }
    },
    {
      id: "brightpath-nonprofit-web", category: "web", kind: "service", serviceKind: "nonprofit", skin: "brightpath",
      accent: "#f2a13d", alt: "#2f8f7a", bg: "#e9f0ea", surface: "#fffdf7", ink: "#1a2a22", uses: "6.6k",
      zh: { name: "Brightpath 教育公益", category: "公益基金会", desc: "以受助者故事、项目透明公示与月度捐赠为主的公益基金会官网。", tags: ["公益", "教育", "透明"], pages: ["基金会首页", "项目进展", "月捐计划"] },
      en: { name: "Brightpath Education Fund", category: "Nonprofit foundation", desc: "A foundation site centered on beneficiary stories, transparent program reporting, and monthly giving.", tags: ["Nonprofit", "Education", "Transparency"], pages: ["Foundation home", "Programs", "Monthly giving"] },
      more: { zh: ["我们的故事", "受益人故事", "财务公示", "项目地图", "志愿者招募", "企业合作", "研究报告", "新闻动态", "捐赠问答", "联系我们"], en: ["Our story", "Beneficiaries", "Financials", "Program map", "Volunteer", "Corporate partners", "Research", "News", "Giving FAQ", "Contact"] }
    },
    {
      id: "orbit-identity-system", category: "brand", kind: "brand", skin: "orbitbrand",
      accent: "#4f5cff", alt: "#ffb347", bg: "#e5e7f4", surface: "#fcfcff", ink: "#181a30", uses: "6.2k",
      zh: { name: "Orbit 数字品牌系统", category: "数字品牌系统", desc: "为数字产品而生的品牌系统，覆盖界面配色、动效与组件品牌化。", tags: ["数字品牌", "动效", "组件"], pages: ["系统概述", "界面配色", "动效规范"] },
      en: { name: "Orbit Digital Brand System", category: "Digital brand system", desc: "A brand system made for digital products, covering UI color, motion, and branded components.", tags: ["Digital brand", "Motion", "Components"], pages: ["Overview", "UI color", "Motion rules"] },
      more: { zh: ["标志动画", "界面图标", "插画风格", "产品截图", "空状态", "邮件模板", "演示模板", "社媒素材", "无障碍对比", "品牌资产库"], en: ["Logo motion", "UI icons", "Illustration", "Product shots", "Empty states", "Email", "Deck template", "Social kit", "Contrast", "Asset library"] }
    }
  ];

  global.StudioTemplateCatalog = CATALOG;
})(window);
