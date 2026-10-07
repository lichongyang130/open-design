(function (global) {
  "use strict";

  var CATEGORY_COPY = {
    all: { zh: "全部", en: "All" },
    web: { zh: "网站与落地页", en: "Web & landing" },
    app: { zh: "App", en: "Apps" },
    dashboard: { zh: "数据后台", en: "Dashboards" },
    commerce: { zh: "电商与服务", en: "Commerce" },
    deck: { zh: "演示与文档", en: "Decks & docs" },
    brand: { zh: "品牌与营销", en: "Brand & marketing" }
  };

  var COPY = {
    zh: {
      commercial: "商业授权",
      live: "真实 HTML",
      pro: "PRO",
      screens: "个可编辑界面",
      preview: "预览模板",
      use: "使用",
      useNow: "直接使用",
      useNowSub: "将模板说明填入创作器",
      useBrief: "带示例提示词使用",
      useBriefSub: "保留模板结构与示例内容",
      remix: "Remix 为新项目",
      remixSub: "复制结构并开始个性化编辑",
      share: "分享",
      shared: "模板链接已复制",
      favorite: "收藏",
      favorited: "已收藏",
      colorway: "切换配色",
      previous: "上一个界面",
      next: "下一个界面",
      close: "关闭预览",
      interaction: "交互原型",
      interactionReady: "页面任意区域、导航、按钮和数据卡片都可以点击",
      actionDone: "已触发：",
      page: "界面",
      included: "已包含",
      screenRailTitle: "全部界面",
      scrollHint: "向下滚动查看完整页面清单",
      interactive: "可交互",
      desktop: "桌面",
      tablet: "平板",
      mobile: "手机",
      featured: "本周商业精选",
      featuredDescription: "完整的 13 页面品牌手册，覆盖策略、视觉规范、落地应用与资源下载。所有页面均为可点击、可交互 HTML，而不是静态占位图。",
      previewScreens: "预览 13 个界面",
      librarySub: "18 套商业级模板 · 每套 13 个可交互界面 · 共 234 个真实页面",
      uses: "次使用"
    },
    en: {
      commercial: "Commercial license",
      live: "LIVE HTML",
      pro: "PRO",
      screens: "editable screens",
      preview: "Preview template",
      use: "Use",
      useNow: "Use now",
      useNowSub: "Add the template brief to the composer",
      useBrief: "Use with sample brief",
      useBriefSub: "Keep the structure and sample content",
      remix: "Remix as a new project",
      remixSub: "Duplicate the structure and personalize it",
      share: "Share",
      shared: "Template link copied",
      favorite: "Favorite",
      favorited: "Saved",
      colorway: "Switch colorway",
      previous: "Previous screen",
      next: "Next screen",
      close: "Close preview",
      interaction: "Interactive prototype",
      interactionReady: "Every page area, navigation item, button, and data card is clickable",
      actionDone: "Activated: ",
      page: "Screen",
      included: "Included",
      screenRailTitle: "All screens",
      scrollHint: "Scroll down to browse the complete page set",
      interactive: "Interactive",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobile",
      featured: "COMMERCIAL PICK",
      featuredDescription: "A complete 13-screen brand playbook covering strategy, visual rules, applications, and downloadable assets. Every page is clickable HTML—not a placeholder image.",
      previewScreens: "Preview 13 screens",
      librarySub: "18 commercial-grade kits · 13 interactive screens each · 234 real pages",
      uses: "uses"
    }
  };

  var TEMPLATES = [
    {
      id: "northstar-saas-console", category: "dashboard", kind: "dashboard", skin: "northstar",
      accent: "#9cff57", alt: "#71d7ff", bg: "#101411", surface: "#f2f5ee", ink: "#152015", uses: "18.6k",
      zh: { name: "Northstar SaaS 经营台", category: "SaaS 数据后台", desc: "面向 B2B 产品团队的经营看板，覆盖收入、客户健康度与增长漏斗。", tags: ["SaaS", "B2B", "数据可视化"], pages: ["经营总览", "客户健康", "收入分析"] },
      en: { name: "Northstar SaaS Console", category: "SaaS dashboard", desc: "A B2B operating console for revenue, customer health, and growth funnels.", tags: ["SaaS", "B2B", "Analytics"], pages: ["Overview", "Customer health", "Revenue"] }
    },
    {
      id: "forma-furniture-store", category: "commerce", kind: "commerce", skin: "forma",
      accent: "#f1683a", alt: "#5b7c64", bg: "#eee9df", surface: "#fffaf2", ink: "#1d241f", uses: "14.2k",
      zh: { name: "Forma 家居商店", category: "精品电商", desc: "带产品筛选、购物车与搭配故事的高端家居电商模板。", tags: ["电商", "生活方式", "响应式"], pages: ["品牌首页", "系列商店", "商品详情"] },
      en: { name: "Forma Furniture Store", category: "Premium commerce", desc: "A premium furniture storefront with filters, cart interactions, and editorial stories.", tags: ["Commerce", "Lifestyle", "Responsive"], pages: ["Home", "Collection", "Product detail"] }
    },
    {
      id: "moneta-mobile-finance", category: "app", kind: "mobile", skin: "moneta",
      accent: "#d7ff54", alt: "#a98cff", bg: "#171a2b", surface: "#f5f6fa", ink: "#161824", uses: "12.9k",
      zh: { name: "Moneta 移动金融", category: "金融 App", desc: "包含资产总览、转账与预算分析的移动金融产品界面。", tags: ["FinTech", "移动端", "图表"], pages: ["资产总览", "快捷转账", "预算洞察"] },
      en: { name: "Moneta Mobile Finance", category: "Finance app", desc: "A mobile finance experience with net worth, transfers, and budget insights.", tags: ["FinTech", "Mobile", "Charts"], pages: ["Net worth", "Transfer", "Budget insights"] }
    },
    {
      id: "afterlight-conference", category: "web", kind: "event", skin: "afterlight",
      accent: "#ff4f91", alt: "#ffbd33", bg: "#151128", surface: "#211a3d", ink: "#fff7ee", uses: "10.7k",
      zh: { name: "Afterlight 创意大会", category: "活动落地页", desc: "强节奏视觉、讲者阵容、日程与购票流程组成的活动官网。", tags: ["活动", "创意", "售票"], pages: ["大会首页", "讲者阵容", "日程与票务"] },
      en: { name: "Afterlight Conference", category: "Event landing", desc: "A high-energy conference site with speakers, schedule, and ticket flow.", tags: ["Event", "Creative", "Tickets"], pages: ["Event home", "Speakers", "Schedule & tickets"] }
    },
    {
      id: "orbit-venture-deck", category: "deck", kind: "deck", skin: "orbit",
      accent: "#fcff59", alt: "#57ffcf", bg: "#20234a", surface: "#f4f3e8", ink: "#17182b", uses: "21.4k",
      zh: { name: "Orbit 融资路演", category: "商业演示", desc: "从市场机会到商业模型和融资计划的一套完整投资人路演。", tags: ["融资", "路演", "商业"], pages: ["愿景封面", "市场机会", "增长与财务"] },
      en: { name: "Orbit Venture Deck", category: "Pitch deck", desc: "A complete investor narrative from market opportunity to traction and fundraising.", tags: ["Fundraising", "Pitch", "Business"], pages: ["Vision", "Opportunity", "Growth & financials"] }
    },
    {
      id: "fieldnotes-digital-guide", category: "deck", kind: "editorial", skin: "fieldnotes",
      accent: "#2e68ff", alt: "#d34c3f", bg: "#c8d5ee", surface: "#fffdf6", ink: "#172138", uses: "16.8k", featured: true,
      zh: { name: "Fieldnotes 品牌实战手册", category: "数字指南", desc: "双页编辑排版，适合品牌手册、创作者指南与商业电子书。", tags: ["电子书", "编辑设计", "品牌"], pages: ["封面与目录", "方法章节", "检查清单"] },
      en: { name: "Fieldnotes Brand Playbook", category: "Digital guide", desc: "A two-page editorial system for brand manuals, creator guides, and commercial ebooks.", tags: ["Ebook", "Editorial", "Brand"], pages: ["Cover & contents", "Method chapter", "Checklist"] }
    },
    {
      id: "folio-architecture", category: "web", kind: "portfolio", skin: "folio",
      accent: "#e9ff4a", alt: "#ff805d", bg: "#d7d3c8", surface: "#171a18", ink: "#f6f2e9", uses: "9.6k",
      zh: { name: "Folio 建筑作品集", category: "创意作品集", desc: "以大幅案例图、项目索引和工作室档案构成的建筑作品集。", tags: ["作品集", "建筑", "极简"], pages: ["精选项目", "项目案例", "工作室档案"] },
      en: { name: "Folio Architecture", category: "Creative portfolio", desc: "An architecture portfolio with oversized case studies, an index, and studio profile.", tags: ["Portfolio", "Architecture", "Minimal"], pages: ["Selected work", "Case study", "Studio profile"] }
    },
    {
      id: "nest-property-market", category: "commerce", kind: "realestate", skin: "nest",
      accent: "#244f3d", alt: "#c45b42", bg: "#e8eee8", surface: "#fffdf8", ink: "#163126", uses: "8.8k",
      zh: { name: "Nest 精品房产", category: "房产服务", desc: "真实房源浏览、条件筛选、经纪人联系与预约看房体验。", tags: ["房产", "搜索", "预约"], pages: ["精选房源", "房源详情", "预约看房"] },
      en: { name: "Nest Property Market", category: "Real estate", desc: "A property marketplace with live filters, agent contact, and viewing requests.", tags: ["Property", "Search", "Booking"], pages: ["Listings", "Property detail", "Book a viewing"] }
    },
    {
      id: "serein-restaurant", category: "commerce", kind: "restaurant", skin: "serein",
      accent: "#b4452e", alt: "#2c735c", bg: "#e7d6c4", surface: "#f8f0e3", ink: "#321f18", uses: "7.9k",
      zh: { name: "Serein 餐厅品牌站", category: "餐饮预订", desc: "融合主厨故事、季节菜单与桌位预订的餐厅品牌网站。", tags: ["餐饮", "菜单", "预订"], pages: ["餐厅首页", "季节菜单", "桌位预订"] },
      en: { name: "Serein Restaurant", category: "Dining & booking", desc: "A restaurant experience combining chef story, seasonal menu, and reservations.", tags: ["Dining", "Menu", "Booking"], pages: ["Restaurant home", "Seasonal menu", "Reservation"] }
    },
    {
      id: "roam-travel-booking", category: "commerce", kind: "travel", skin: "roam",
      accent: "#ff6a49", alt: "#116e8a", bg: "#bce0e8", surface: "#fffdf7", ink: "#133946", uses: "11.3k",
      zh: { name: "Roam 旅行预订", category: "旅行服务", desc: "目的地发现、行程组合与预订确认一体化旅行体验。", tags: ["旅行", "预订", "探索"], pages: ["目的地发现", "行程详情", "预订确认"] },
      en: { name: "Roam Travel Booking", category: "Travel service", desc: "An end-to-end travel experience for discovery, itinerary building, and checkout.", tags: ["Travel", "Booking", "Explore"], pages: ["Discover", "Trip detail", "Booking"] }
    },
    {
      id: "pulse-care-center", category: "dashboard", kind: "health", skin: "pulse",
      accent: "#36c7a1", alt: "#557cff", bg: "#e8f6f2", surface: "#ffffff", ink: "#153831", uses: "13.1k",
      zh: { name: "Pulse 健康管理台", category: "医疗服务后台", desc: "患者概览、预约排班和健康趋势组成的医疗服务工作台。", tags: ["医疗", "预约", "数据"], pages: ["患者概览", "预约排班", "健康趋势"] },
      en: { name: "Pulse Care Center", category: "Health dashboard", desc: "A care workspace for patient overview, appointment planning, and health trends.", tags: ["Health", "Scheduling", "Data"], pages: ["Patients", "Appointments", "Health trends"] }
    },
    {
      id: "lumen-course-platform", category: "app", kind: "course", skin: "lumen",
      accent: "#7c5cff", alt: "#ff754c", bg: "#ede9ff", surface: "#ffffff", ink: "#231a49", uses: "10.2k",
      zh: { name: "Lumen 在线课程", category: "学习平台", desc: "课程发现、沉浸式学习和学习进度管理的在线教育产品。", tags: ["教育", "视频", "学习进度"], pages: ["课程发现", "学习空间", "学习进度"] },
      en: { name: "Lumen Course Platform", category: "Learning app", desc: "An online learning product for course discovery, focused lessons, and progress.", tags: ["Education", "Video", "Progress"], pages: ["Discover", "Lesson player", "Progress"] }
    },
    {
      id: "signal-social-campaign", category: "brand", kind: "campaign", skin: "signal",
      accent: "#ff3d5d", alt: "#2f66ff", bg: "#f4dfff", surface: "#fffaf4", ink: "#2d1834", uses: "8.5k",
      zh: { name: "Signal 社媒营销包", category: "营销活动", desc: "覆盖主视觉、社媒内容排期与活动数据的营销战役模板。", tags: ["营销", "社交媒体", "活动"], pages: ["活动主视觉", "内容排期", "效果复盘"] },
      en: { name: "Signal Social Campaign", category: "Marketing campaign", desc: "A campaign system spanning key visual, social calendar, and performance review.", tags: ["Marketing", "Social", "Campaign"], pages: ["Key visual", "Content calendar", "Performance"] }
    },
    {
      id: "arca-brand-system", category: "brand", kind: "brand", skin: "arca",
      accent: "#ff5b34", alt: "#2360ff", bg: "#ded7c9", surface: "#f8f4eb", ink: "#181815", uses: "15.7k",
      zh: { name: "Arca 品牌系统", category: "品牌规范", desc: "从品牌理念、标志规则到色彩和应用场景的完整视觉系统。", tags: ["品牌", "规范", "视觉系统"], pages: ["品牌核心", "视觉语言", "应用示例"] },
      en: { name: "Arca Brand System", category: "Brand guidelines", desc: "A complete visual system from brand idea and logo rules to applications.", tags: ["Brand", "Guidelines", "Identity"], pages: ["Brand core", "Visual language", "Applications"] }
    },
    {
      id: "common-good-impact-report", category: "deck", kind: "report", skin: "commongood",
      accent: "#ffcc3d", alt: "#40bca0", bg: "#203c34", surface: "#f5f0df", ink: "#1c352e", uses: "6.9k",
      zh: { name: "Common Good 年度报告", category: "影响力报告", desc: "用数据、人物故事与行动计划讲述组织年度影响力。", tags: ["年度报告", "公益", "数据故事"], pages: ["年度封面", "影响力数据", "人物故事"] },
      en: { name: "Common Good Impact Report", category: "Impact report", desc: "An annual narrative built from outcomes, human stories, and next actions.", tags: ["Annual report", "Impact", "Data story"], pages: ["Annual cover", "Impact data", "People stories"] }
    },
    {
      id: "welcome-people-ops", category: "dashboard", kind: "hr", skin: "welcome",
      accent: "#ff845d", alt: "#4e78e8", bg: "#f5eee6", surface: "#ffffff", ink: "#382821", uses: "7.4k",
      zh: { name: "Welcome 团队入职台", category: "人力协作", desc: "新成员入职任务、团队介绍与培训进度的一站式协作台。", tags: ["HR", "入职", "团队协作"], pages: ["入职首页", "任务计划", "团队与资源"] },
      en: { name: "Welcome People Ops", category: "People operations", desc: "A one-stop onboarding hub for tasks, team introductions, and learning.", tags: ["HR", "Onboarding", "Team"], pages: ["Welcome home", "Task plan", "Team & resources"] }
    },
    {
      id: "muse-ai-workspace", category: "app", kind: "ai", skin: "muse",
      accent: "#b7ff65", alt: "#7e8cff", bg: "#101217", surface: "#1b1e26", ink: "#f5f8ef", uses: "19.3k",
      zh: { name: "Muse AI 创作空间", category: "AI 工作台", desc: "集对话、素材库、生成历史和协作批注于一体的 AI 产品界面。", tags: ["AI", "创作", "工作空间"], pages: ["创作首页", "素材画布", "生成历史"] },
      en: { name: "Muse AI Workspace", category: "AI workspace", desc: "An AI product interface unifying chat, assets, generation history, and review.", tags: ["AI", "Creation", "Workspace"], pages: ["Create home", "Asset canvas", "Generation history"] }
    },
    {
      id: "kindred-nonprofit", category: "web", kind: "nonprofit", skin: "kindred",
      accent: "#e64f34", alt: "#23634d", bg: "#f1e5d6", surface: "#fff9ee", ink: "#2d2c20", uses: "6.4k",
      zh: { name: "Kindred 公益行动站", category: "公益官网", desc: "以影响力故事、项目进展和透明捐赠流程构成的公益网站。", tags: ["公益", "故事", "捐赠"], pages: ["行动首页", "项目故事", "透明捐赠"] },
      en: { name: "Kindred Nonprofit", category: "Nonprofit website", desc: "An impact-led nonprofit site with stories, programs, and transparent giving.", tags: ["Nonprofit", "Stories", "Giving"], pages: ["Impact home", "Program stories", "Donate"] }
    }
  ];

  /* Every commercial kit ships as a complete product, not a three-screen teaser. */
  var TEMPLATE_EXTRA_PAGES = {
    "northstar-saas-console": {
      zh: ["增长漏斗", "订阅计划", "客户列表", "客户详情", "产品使用", "留存队列", "销售管道", "团队绩效", "告警中心", "系统设置"],
      en: ["Growth funnel", "Subscription plans", "Customer list", "Customer profile", "Product usage", "Retention cohorts", "Sales pipeline", "Team performance", "Alert center", "Settings"]
    },
    "forma-furniture-store": {
      zh: ["搜索结果", "空间灵感", "搭配方案", "购物车", "结算配送", "支付确认", "订单追踪", "会员中心", "收藏清单", "品牌故事"],
      en: ["Search results", "Room inspiration", "Styled sets", "Shopping bag", "Delivery checkout", "Payment", "Order tracking", "Member account", "Wishlist", "Brand story"]
    },
    "moneta-mobile-finance": {
      zh: ["登录验证", "主卡管理", "交易明细", "账单详情", "收款码", "定期存款", "投资组合", "信用评分", "安全中心", "个人设置"],
      en: ["Secure sign in", "Card management", "Transactions", "Bill detail", "Receive money", "Savings goals", "Portfolio", "Credit score", "Security center", "Profile settings"]
    },
    "afterlight-conference": {
      zh: ["嘉宾详情", "会场地图", "单日日程", "工作坊详情", "门票方案", "购票结算", "参会凭证", "合作伙伴", "媒体中心", "常见问题"],
      en: ["Speaker profile", "Venue map", "Daily schedule", "Workshop detail", "Ticket tiers", "Ticket checkout", "Event pass", "Partners", "Press room", "FAQ"]
    },
    "orbit-venture-deck": {
      zh: ["用户痛点", "产品方案", "核心能力", "商业模式", "竞争格局", "市场进入", "增长数据", "团队介绍", "财务预测", "融资用途"],
      en: ["Customer problem", "Product solution", "Core capabilities", "Business model", "Competitive map", "Go to market", "Traction", "Team", "Financial forecast", "Use of funds"]
    },
    "fieldnotes-digital-guide": {
      zh: ["品牌定位", "受众画像", "核心叙事", "语气原则", "视觉节奏", "内容框架", "渠道示例", "发布计划", "评估指标", "资源附录"],
      en: ["Positioning", "Audience portraits", "Core narrative", "Voice principles", "Visual rhythm", "Content framework", "Channel examples", "Launch plan", "Success metrics", "Resource appendix"]
    },
    "folio-architecture": {
      zh: ["项目索引", "住宅案例", "公共空间", "文化建筑", "空间细节", "设计过程", "材料研究", "获奖记录", "团队成员", "联系工作室"],
      en: ["Project index", "Residential case", "Public space", "Cultural building", "Spatial details", "Design process", "Material studies", "Awards", "Team", "Contact studio"]
    },
    "nest-property-market": {
      zh: ["地图找房", "筛选结果", "社区详情", "户型图册", "设施清单", "经纪人档案", "看房日程", "贷款测算", "收藏房源", "个人中心"],
      en: ["Map search", "Filtered results", "Neighborhood", "Floor plans", "Amenities", "Agent profile", "Viewing calendar", "Mortgage calculator", "Saved homes", "Account"]
    },
    "serein-restaurant": {
      zh: ["主厨故事", "食材产地", "酒水单", "菜品详情", "私人宴会", "桌位选择", "预订确认", "礼品卡", "媒体报道", "到店指南"],
      en: ["Chef story", "Our producers", "Wine list", "Dish detail", "Private dining", "Choose a table", "Booking confirmation", "Gift cards", "Press", "Visit us"]
    },
    "roam-travel-booking": {
      zh: ["目的地搜索", "酒店列表", "酒店详情", "房型选择", "体验活动", "行程编辑", "旅伴邀请", "订单结算", "电子凭证", "旅行账户"],
      en: ["Destination search", "Hotel results", "Hotel detail", "Room selection", "Local experiences", "Itinerary builder", "Invite travelers", "Trip checkout", "Travel pass", "Traveler account"]
    },
    "pulse-care-center": {
      zh: ["患者档案", "检查结果", "用药计划", "医生排班", "远程问诊", "护理任务", "风险预警", "健康报告", "消息中心", "机构设置"],
      en: ["Patient profile", "Test results", "Medication plan", "Clinician roster", "Telehealth visit", "Care tasks", "Risk alerts", "Health report", "Messages", "Clinic settings"]
    },
    "lumen-course-platform": {
      zh: ["课程详情", "讲师主页", "章节目录", "视频课堂", "阅读材料", "互动测验", "作业提交", "讨论社区", "学习日历", "结业证书"],
      en: ["Course detail", "Instructor profile", "Curriculum", "Video lesson", "Reading material", "Interactive quiz", "Assignment", "Discussion", "Learning calendar", "Certificate"]
    },
    "signal-social-campaign": {
      zh: ["策略简报", "受众洞察", "创意方向", "素材看板", "短视频脚本", "帖子详情", "审批流程", "投放计划", "实时数据", "复盘报告"],
      en: ["Campaign brief", "Audience insight", "Creative direction", "Asset board", "Video script", "Post detail", "Approval flow", "Media plan", "Live analytics", "Campaign report"]
    },
    "arca-brand-system": {
      zh: ["标志规范", "安全空间", "品牌色彩", "字体系统", "图形语言", "图标系统", "摄影风格", "社媒应用", "包装应用", "下载中心"],
      en: ["Logo rules", "Clear space", "Color system", "Typography", "Graphic language", "Icon system", "Photography", "Social templates", "Packaging", "Download center"]
    },
    "common-good-impact-report": {
      zh: ["年度寄语", "组织使命", "项目地图", "教育成果", "社区成果", "资金流向", "伙伴网络", "志愿者故事", "未来计划", "数据附录"],
      en: ["Annual letter", "Mission", "Program map", "Education outcomes", "Community outcomes", "Funds allocation", "Partner network", "Volunteer story", "Next year", "Data appendix"]
    },
    "welcome-people-ops": {
      zh: ["欢迎清单", "第一周计划", "培训课程", "导师配对", "组织架构", "成员档案", "福利中心", "设备申请", "反馈问卷", "入职完成"],
      en: ["Welcome checklist", "First week", "Training hub", "Buddy matching", "Org chart", "People directory", "Benefits", "Equipment request", "Pulse survey", "Onboarding complete"]
    },
    "muse-ai-workspace": {
      zh: ["新建项目", "提示词编辑器", "文档生成", "图片生成", "视频生成", "版本对比", "团队评论", "共享空间", "模型管理", "工作区设置"],
      en: ["New project", "Prompt editor", "Document generation", "Image generation", "Video generation", "Version compare", "Team comments", "Shared workspace", "Model manager", "Workspace settings"]
    },
    "kindred-nonprofit": {
      zh: ["使命介绍", "项目列表", "项目详情", "影响力地图", "受助者故事", "志愿者报名", "活动日历", "捐赠方案", "捐赠结算", "公开透明"],
      en: ["Our mission", "Programs", "Program detail", "Impact map", "Community story", "Volunteer signup", "Events", "Giving options", "Donation checkout", "Transparency"]
    }
  };

  TEMPLATES.forEach(function (template) {
    var extra = TEMPLATE_EXTRA_PAGES[template.id];
    if (!extra) return;
    template.zh.pages = template.zh.pages.concat(extra.zh);
    template.en.pages = template.en.pages.concat(extra.en);
  });

  function langOf(lang) { return lang === "en" ? "en" : "zh"; }
  function text(lang, key) { return COPY[langOf(lang)][key] || key; }
  function localized(template, lang) { return template[langOf(lang)] || template.zh; }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function pageNumber(page) { return String(page + 1).padStart(2, "0"); }
  function byId(id) {
    for (var i = 0; i < TEMPLATES.length; i += 1) if (TEMPLATES[i].id === id) return TEMPLATES[i];
    return null;
  }
  function categoryList(lang) {
    var keys = ["all", "web", "app", "dashboard", "commerce", "deck", "brand"];
    return keys.map(function (key) {
      var count = key === "all" ? TEMPLATES.length : TEMPLATES.filter(function (item) { return item.category === key; }).length;
      return { id: key, label: CATEGORY_COPY[key][langOf(lang)], count: count };
    });
  }
  function cssVars(template, alternate) {
    var accent = alternate ? template.alt : template.accent;
    return "--tpl-accent:" + esc(accent) + ";--tpl-bg:" + esc(template.bg) + ";--tpl-surface:" + esc(template.surface) + ";--tpl-ink:" + esc(template.ink) + ";";
  }
  function dots() {
    return '<span class="tpl-window-dots"><i></i><i></i><i></i></span>';
  }
  function action(label) {
    return '<button type="button" class="tpl-demo-action" data-demo-action="' + esc(label) + '">' + esc(label) + '</button>';
  }
  function navItems(info, page) {
    var last = info.pages.length - 1;
    var indexes = [0];
    var start = Math.max(1, Math.min(Math.max(1, page - 1), Math.max(1, last - 2)));
    for (var i = start; i <= Math.min(last, start + 2); i += 1) indexes.push(i);
    if (indexes.indexOf(page) < 0) indexes[indexes.length - 1] = page;
    return indexes.filter(function (index, position) { return indexes.indexOf(index) === position; }).map(function (index) {
      var name = info.pages[index];
      return '<button type="button" class="tpl-mini-nav' + (index === page ? " is-active" : "") + '" data-demo-action="' + esc(name) + '">' + esc(name) + '</button>';
    }).join("");
  }
  function barChart(seed) {
    var bars = [42, 67, 53, 82, 64, 91, 76, 96];
    return '<div class="tpl-bars">' + bars.map(function (height, index) {
      var h = Math.max(24, Math.min(98, height + ((seed * 7 + index * 3) % 13) - 6));
      return '<i style="height:' + h + '%"></i>';
    }).join("") + '</div>';
  }
  function sparkline() {
    return '<svg class="tpl-spark" viewBox="0 0 160 48" preserveAspectRatio="none" aria-hidden="true"><path d="M2 42 C18 38 20 26 36 30 S58 40 70 25 S90 8 102 18 S125 35 158 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M2 42 C18 38 20 26 36 30 S58 40 70 25 S90 8 102 18 S125 35 158 4 L158 48 L2 48Z" fill="currentColor" opacity=".08"/></svg>';
  }
  function browserShell(template, info, page, inner, className, alternate) {
    return '<div class="tpl-art tpl-art--' + esc(className) + ' tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '">' +
      '<div class="tpl-browser"><div class="tpl-browser-bar">' + dots() + '<span class="tpl-address">' + esc(template.id.replace(/-/g, ".")) + '</span><span class="tpl-live-mark"><i></i>LIVE</span></div>' +
      inner + '</div></div>';
  }
  function dashboardArt(template, info, page, alternate) {
    var variant = page % 3;
    var metrics = variant === 0 ? ["$148.2K", "+24.8%", "8,402"] : variant === 1 ? ["2,481", "92.4%", "18m"] : ["$1.84M", "+31.2%", "4.8×"];
    var labels = info.tags;
    var inner = '<div class="tpl-dash-shell"><aside><div class="tpl-wordmark"><i></i>' + esc(template.id.split("-")[0]) + '</div><div class="tpl-side-nav">' + navItems(info, page) + '</div><div class="tpl-side-note"><span>' + esc(labels[0]) + '</span><b>PRO workspace</b></div></aside>' +
      '<main><header><div><span>' + esc(info.category) + '</span><h3>' + esc(info.pages[page]) + '</h3></div><div class="tpl-avatar-stack"><i></i><i></i><i></i></div></header>' +
      '<div class="tpl-metrics">' + metrics.map(function (metric, index) { return '<button type="button" data-demo-action="' + esc(labels[index % labels.length]) + '"><span>' + esc(labels[index % labels.length]) + '</span><b>' + metric + '</b><em>' + (index === 1 ? "↑ 8.4%" : "+12.6%") + '</em></button>'; }).join("") + '</div>' +
      '<div class="tpl-dash-grid"><section><div class="tpl-panel-head"><b>' + esc(info.pages[page]) + '</b><span>Jan — Dec</span></div>' + barChart(page) + '</section><section class="tpl-feed"><div class="tpl-panel-head"><b>Live activity</b><span>•••</span></div>' + [0, 1, 2, 3].map(function (i) { return '<button type="button" data-demo-action="Activity ' + (i + 1) + '"><i></i><span><b>' + esc(labels[i % labels.length]) + '</b><small>' + (i + 2) + ' min ago</small></span><em>+' + (12 + i * 7) + '%</em></button>'; }).join("") + '</section></div></main></div>';
    return browserShell(template, info, page, inner, template.kind === "ai" ? "ai" : "dashboard", alternate);
  }
  function commerceArt(template, info, page, alternate) {
    var variant = page % 3;
    var productNames = variant === 0 ? ["Arc lounge", "Linea table", "Soft form"] : variant === 1 ? ["Series 01", "Series 02", "Series 03"] : ["Natural oak", "Clay textile", "Hand finish"];
    var inner = '<div class="tpl-shop"><nav><b>FORMA / ' + String(page + 1).padStart(2, "0") + '</b><div>' + navItems(info, page) + '</div><button type="button" data-demo-action="Cart">Bag <i>' + (page + 1) + '</i></button></nav>' +
      '<section class="tpl-shop-hero"><div><small>COLLECTION ' + (2026 + page) + '</small><h2>' + esc(info.pages[page]) + '</h2><p>' + esc(info.desc) + '</p>' + action(variant === 2 ? "Add to collection" : "Explore collection") + '</div><div class="tpl-object tpl-object-' + variant + '"><i></i><i></i></div></section>' +
      '<section class="tpl-product-row">' + productNames.map(function (name, index) { return '<button type="button" data-demo-action="' + esc(name) + '"><div class="tpl-product-shape s' + index + '"></div><span><b>' + esc(name) + '</b><em>$' + (240 + index * 175) + '</em></span></button>'; }).join("") + '</section></div>';
    return browserShell(template, info, page, inner, "commerce", alternate);
  }
  function mobileArt(template, info, page, alternate) {
    var variant = page % 3;
    var money = variant === 0 ? "$24,860" : variant === 1 ? "$1,250" : "$3,840";
    return '<div class="tpl-art tpl-art--mobile tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '"><div class="tpl-mobile-copy"><span>MONETA / ' + pageNumber(page) + '</span><h2>' + esc(info.pages[page]) + '</h2><p>' + esc(info.desc) + '</p><div class="tpl-mobile-points"><i></i><span>' + esc(info.tags.join(" · ")) + '</span></div></div>' +
      '<div class="tpl-phone"><div class="tpl-phone-island"></div><header><span>9:41</span><i>◒</i></header><div class="tpl-phone-title"><span>' + esc(info.pages[page]) + '</span><b>•••</b></div><section class="tpl-balance"><small>Total balance</small><h3>' + money + '</h3>' + sparkline() + '</section><div class="tpl-quick-actions">' + ["Send", "Receive", "Bills"].map(function (label, index) { return '<button type="button" data-demo-action="' + label + '"><i>' + ["↗", "↙", "✓"][index] + '</i><span>' + label + '</span></button>'; }).join("") + '</div><div class="tpl-mobile-list"><b>Recent activity</b>' + [0, 1, 2].map(function (i) { return '<button type="button" data-demo-action="Transaction"><i></i><span><b>' + ["Studio plan", "Coffee house", "Transfer"][i] + '</b><small>Today</small></span><em>' + (i === 2 ? "+$850" : "−$" + (18 + i * 34)) + '</em></button>'; }).join("") + '</div></div></div>';
  }
  function eventArt(template, info, page, alternate) {
    var variant = page % 3;
    var inner = '<div class="tpl-event"><nav><b>AFTER / LIGHT</b><span>OCT 16—18 · BROOKLYN</span>' + action("Get tickets") + '</nav><main><div class="tpl-event-index">' + String(page + 1).padStart(2, "0") + ' / ' + String(info.pages.length).padStart(2, "0") + '</div><h2>' + (variant === 0 ? 'MAKE<br><i>IDEAS</i><br>VISIBLE' : variant === 1 ? 'THE<br><i>PEOPLE</i><br>ON STAGE' : 'THREE<br><i>DAYS</i><br>TOGETHER') + '</h2><div class="tpl-event-orbit"><i></i><i></i><i></i><span>' + esc(info.pages[page]) + '</span></div><footer><p>' + esc(info.desc) + '</p><div>' + navItems(info, page) + '</div></footer></main></div>';
    return browserShell(template, info, page, inner, "event", alternate);
  }
  function documentArt(template, info, page, alternate) {
    var isEditorial = template.kind === "editorial";
    var isBrand = template.kind === "brand";
    var isReport = template.kind === "report";
    var title = info.pages[page];
    var variant = page % 3;
    var inner;
    if (isEditorial) {
      inner = '<div class="tpl-spread"><article class="tpl-paper tpl-paper-cover"><header><span>FIELDNOTES / ' + (page + 1) + '</span><span>2026 EDITION</span></header><h2>' + (variant === 0 ? 'Build a brand<br>people <i>remember.</i>' : variant === 1 ? 'Clarity before<br><i>decoration.</i>' : 'Launch with<br><i>confidence.</i>') + '</h2><p>' + esc(info.desc) + '</p><div class="tpl-editorial-stats"><span><b>' + (12 + page * 4) + '</b>principles</span><span><b>' + (38 + page * 6) + '</b>examples</span><span><b>03</b>systems</span></div></article><article class="tpl-paper tpl-paper-content"><span>CHAPTER ' + pageNumber(page) + '</span><h3>' + esc(title) + '</h3><blockquote>“A useful system makes the right choice feel obvious.”</blockquote>' + ["Find the sharp idea", "Create a repeatable rhythm", "Test it in the real world", "Document what works"].map(function (x, i) { return '<button type="button" data-demo-action="' + esc(x) + '"><em>0' + (i + 1) + '</em><b>' + x + '</b></button>'; }).join("") + '</article></div>';
    } else if (isBrand) {
      inner = '<div class="tpl-brand-book"><header><b>ARCA®</b><span>Brand system / v2.1</span><em>' + pageNumber(page) + '</em></header><main><section><small>' + esc(info.pages[page]) + '</small><h2>' + (variant === 0 ? 'Move with<br>purpose.' : variant === 1 ? 'One voice.<br>Many forms.' : 'Built to live<br>everywhere.') + '</h2><p>' + esc(info.desc) + '</p></section><section class="tpl-brand-canvas"><div class="tpl-logo-shape"><i></i><i></i></div><div class="tpl-swatches"><i></i><i></i><i></i><i></i></div><b>Aa</b></section></main></div>';
    } else if (isReport) {
      inner = '<div class="tpl-report"><section class="tpl-report-lead"><small>COMMON GOOD / 2026</small><h2>' + (variant === 0 ? 'Small actions.<br><i>Lasting change.</i>' : variant === 1 ? 'Impact you<br><i>can measure.</i>' : 'Every number<br><i>has a name.</i>') + '</h2><p>' + esc(info.desc) + '</p><span>' + pageNumber(page) + ' / ' + String(info.pages.length).padStart(2, "0") + '</span></section><section class="tpl-report-data"><header>' + esc(title) + '<span>↗</span></header><div class="tpl-big-number">' + ["42K", "87%", "126"][variant] + '<small>' + esc(info.tags[variant]) + '</small></div>' + barChart(page + 2) + '<footer><span>Verified outcomes</span><span>2024—2026</span></footer></section></div>';
    } else {
      inner = '<div class="tpl-deck"><header><b>ORBIT<span>°</span></b><em>INVESTOR DECK · CONFIDENTIAL</em><i>' + pageNumber(page) + '</i></header><main><section><small>' + esc(info.pages[page]) + '</small><h2>' + (variant === 0 ? 'The operating system<br>for <i>bold teams.</i>' : variant === 1 ? 'A $4.8B market<br>ready to <i>move.</i>' : 'Compounding growth.<br><i>Capital efficient.</i>') + '</h2><p>' + esc(info.desc) + '</p></section><section class="tpl-deck-chart"><div><b>' + ["10×", "$4.8B", "184%"][variant] + '</b><span>' + esc(info.tags[variant]) + '</span></div>' + sparkline() + '</section></main><footer><span>ORBIT LABS</span><span>STRICTLY PRIVATE</span></footer></div>';
    }
    return '<div class="tpl-art tpl-art--document tpl-doc-' + esc(template.kind) + ' tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '">' + inner + '</div>';
  }
  function portfolioArt(template, info, page, alternate) {
    var variant = page % 3;
    var inner = '<div class="tpl-portfolio"><header><b>FOLIO / A</b><div>' + navItems(info, page) + '</div><span>EST. 2018</span></header><main><div class="tpl-project-number">' + pageNumber(page) + '</div><section class="tpl-architecture-image"><i></i><i></i><i></i></section><section class="tpl-project-copy"><small>SELECTED WORK / ' + (2024 + page) + '</small><h2>' + ["House of quiet light", "Museum on the edge", "A room for making"][variant] + '</h2><p>' + esc(info.desc) + '</p>' + action("View case study") + '</section></main></div>';
    return browserShell(template, info, page, inner, "portfolio", alternate);
  }
  function serviceArt(template, info, page, alternate) {
    var variant = page % 3;
    var kind = template.kind;
    var isFood = kind === "restaurant";
    var isTravel = kind === "travel";
    var isNonprofit = kind === "nonprofit";
    var headline = isFood ? ["A table for<br>slow evenings.", "From the coast,<br>this season.", "Your table<br>is waiting."][variant] : isTravel ? ["Go where the<br>light feels new.", "Three days,<br>perfectly paced.", "One step from<br>your next story."][variant] : isNonprofit ? ["Good grows<br>when shared.", "Meet the people<br>making change.", "Give clearly.<br>See the impact."][variant] : ["Find a place<br>that feels yours.", "Space, light,<br>and a new view.", "Come see it<br>for yourself."][variant];
    var actionLabel = isFood ? ["Discover our story", "View menu", "Reserve a table"][variant] : isTravel ? ["Start exploring", "Build this trip", "Confirm booking"][variant] : isNonprofit ? ["See our impact", "Read their stories", "Donate now"][variant] : ["Explore homes", "View details", "Request a viewing"][variant];
    var inner = '<div class="tpl-service tpl-service-' + kind + '"><nav><b>' + esc(template.id.split("-")[0]).toUpperCase() + '</b><div>' + navItems(info, page) + '</div><span>MENU</span></nav><main><section class="tpl-service-copy"><small>' + pageNumber(page) + ' / ' + esc(info.category) + '</small><h2>' + headline + '</h2><p>' + esc(info.desc) + '</p>' + action(actionLabel) + '</section><section class="tpl-service-image"><div class="tpl-scene"><i></i><i></i><i></i><i></i></div><div class="tpl-floating-card"><small>' + esc(info.tags[variant]) + '</small><b>' + (isFood ? "Seasonal tasting" : isTravel ? "Curated escape" : isNonprofit ? "Verified impact" : "Private listing") + '</b><span>' + (isFood ? "8 courses · 2 hours" : isTravel ? "3 nights · from $680" : isNonprofit ? "92% directly to programs" : "$1.28M · 3 beds") + '</span></div></section></main></div>';
    return browserShell(template, info, page, inner, "service", alternate);
  }
  function courseArt(template, info, page, alternate) {
    var variant = page % 4;
    var progress = 28 + variant * 18;
    var inner = '<div class="tpl-course"><aside><b>LUMEN<span>+</span></b><div>' + navItems(info, page) + '</div><section><span>Course progress</span><b>' + progress + '%</b><i><em style="width:' + progress + '%"></em></i></section></aside><main><header><div><small>MASTERCLASS 04</small><h3>' + esc(info.pages[page]) + '</h3></div><span>◉ 12 learners online</span></header><div class="tpl-course-grid"><section class="tpl-video"><div class="tpl-play" data-demo-action="Play lesson">▶</div><span>12:48 / 28:30</span></section><section class="tpl-lessons"><b>In this module</b>' + ["Start with the outcome", "Map the core journey", "Prototype the moment", "Share and learn"].map(function (x, i) { return '<button type="button" data-demo-action="' + esc(x) + '" class="' + (i === variant ? "is-active" : "") + '"><i>' + (i + 1) + '</i><span><b>' + x + '</b><small>' + (8 + i * 3) + ' min</small></span></button>'; }).join("") + '</section></div></main></div>';
    return browserShell(template, info, page, inner, "course", alternate);
  }
  function campaignArt(template, info, page, alternate) {
    var variant = page % 3;
    return '<div class="tpl-art tpl-art--campaign tpl-skin-' + esc(template.skin) + ' tpl-page-variant-' + (page % 6) + ' tpl-screen-' + (page + 1) + '" style="' + cssVars(template, alternate) + '"><div class="tpl-campaign-head"><b>SIGNAL / CAMPAIGN KIT</b><span>' + esc(info.pages[page]) + '</span><em>' + pageNumber(page) + '</em></div><div class="tpl-moodboard"><section class="tpl-poster"><small>DROP ' + pageNumber(page) + '</small><h2>' + ["MAKE<br>NOISE.", "SHOW<br>THE WORK.", "KEEP<br>MOVING."][variant] + '</h2><i></i></section><section class="tpl-social-post"><header><i></i><b>@signal.studio</b><span>•••</span></header><div class="tpl-social-art"><b>' + ["NEW / NOW", "BEHIND / IT", "RESULTS / IN"][variant] + '</b></div><footer>♡　⌁　↗<span>2,804 likes</span></footer></section><section class="tpl-campaign-plan"><header>CONTENT PLAN <span>W' + (12 + page) + '</span></header>' + ["Tease", "Reveal", "Explain", "Convert"].map(function (x, i) { return '<button type="button" data-demo-action="' + x + '"><span>' + ["MON", "TUE", "THU", "SAT"][i] + '</span><b>' + x + '</b><i class="' + (i < variant + 2 ? "done" : "") + '"></i></button>'; }).join("") + '</section></div></div>';
  }
  function artMarkup(template, page, lang, compact, alternate) {
    var info = localized(template, lang);
    page = Math.max(0, Math.min(info.pages.length - 1, Number(page) || 0));
    if (template.kind === "dashboard" || template.kind === "health" || template.kind === "hr" || template.kind === "ai") return dashboardArt(template, info, page, alternate);
    if (template.kind === "commerce") return commerceArt(template, info, page, alternate);
    if (template.kind === "mobile") return mobileArt(template, info, page, alternate);
    if (template.kind === "event") return eventArt(template, info, page, alternate);
    if (template.kind === "deck" || template.kind === "editorial" || template.kind === "brand" || template.kind === "report") return documentArt(template, info, page, alternate);
    if (template.kind === "portfolio") return portfolioArt(template, info, page, alternate);
    if (template.kind === "realestate" || template.kind === "restaurant" || template.kind === "travel" || template.kind === "nonprofit") return serviceArt(template, info, page, alternate);
    if (template.kind === "course") return courseArt(template, info, page, alternate);
    if (template.kind === "campaign") return campaignArt(template, info, page, alternate);
    return dashboardArt(template, info, page, alternate);
  }

  function cardMarkup(template, lang) {
    var info = localized(template, lang);
    return '<div class="tpl-card-stage">' + artMarkup(template, 0, lang, true, false) + '<span class="tpl-pro-badge">' + text(lang, "pro") + '</span><span class="tpl-card-live"><i></i>' + text(lang, "live") + '</span></div>' +
      '<div class="tpl-card-body"><div class="tpl-card-copy"><span>' + esc(info.category) + '</span><h3>' + esc(info.name) + '</h3><div class="tpl-card-tags">' + info.tags.slice(0, 2).map(function (tag) { return '<em>' + esc(tag) + '</em>'; }).join("") + '</div></div><div class="tpl-card-meta"><b>' + info.pages.length + '</b><span>' + text(lang, "screens") + '</span><i>↗</i></div></div>';
  }
  function featuredMarkup(template, lang) {
    var info = localized(template, lang);
    return '<div class="tpl-featured-art">' + artMarkup(template, 0, lang, true, false) + '</div><div class="tpl-featured-copy"><div class="tpl-featured-kicker"><span>' + text(lang, "featured") + '</span><i>' + text(lang, "commercial") + '</i></div><h3>' + esc(info.name) + '</h3><p>' + text(lang, "featuredDescription") + '</p><div class="tpl-featured-tags">' + info.tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("") + '</div><button type="button" class="btn-new tpl-featured-open" id="tpPreviewFeatured">' + text(lang, "previewScreens") + '<span>↗</span></button><small>' + esc(template.uses) + ' ' + text(lang, "uses") + '</small></div>';
  }

  var modalState = { template: null, page: 0, lang: "zh", alternate: false, viewport: "desktop", onUse: null, onClose: null, returnFocus: null };
  var keyHandlerBound = false;

  function ensureModal() {
    var modal = document.getElementById("templatePreview");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "templatePreview";
    modal.className = "tpl-preview-overlay";
    modal.hidden = true;
    modal.innerHTML =
      '<section class="tpl-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="tplPreviewTitle">' +
        '<header class="tpl-preview-head">' +
          '<div class="tpl-preview-title"><span class="tpl-preview-kicker" id="tplPreviewKicker"></span><h2 id="tplPreviewTitle"></h2><p id="tplPreviewDescription"></p><div class="tpl-preview-tags" id="tplPreviewTags"></div></div>' +
          '<div class="tpl-preview-actions"><span class="tpl-license-badge" id="tplLicenseBadge"></span><button type="button" class="tpl-head-btn" id="tplShareButton"><span>↗</span><b></b></button><button type="button" class="tpl-head-btn tpl-favorite-btn" id="tplFavoriteButton" aria-pressed="false"><span>♡</span><b></b></button><div class="tpl-use-split"><button type="button" class="tpl-use-main" id="tplUseMain"></button><button type="button" class="tpl-use-more" id="tplUseMore" aria-haspopup="menu" aria-expanded="false">⌄</button><div class="tpl-use-menu" id="tplUseMenu" role="menu"></div></div><button type="button" class="tpl-preview-close" id="tplPreviewClose" aria-label="Close">×</button></div>' +
        '</header>' +
        '<div class="tpl-preview-toolbar">' +
          '<div class="tpl-current-screen"><span id="tplScreenCounter"></span><b id="tplScreenName"></b></div>' +
          '<div class="tpl-toolbar-actions"><div class="tpl-viewport-switch" id="tplViewportSwitch"><button type="button" data-preview-viewport="desktop" aria-pressed="true"><span>▰</span><b></b></button><button type="button" data-preview-viewport="tablet" aria-pressed="false"><span>▯</span><b></b></button><button type="button" data-preview-viewport="mobile" aria-pressed="false"><span>▯</span><b></b></button></div><button type="button" class="tpl-colorway-button" id="tplColorway"><i></i><span></span></button></div>' +
        '</div>' +
        '<div class="tpl-preview-workspace">' +
          '<div class="tpl-preview-stage"><button type="button" class="tpl-preview-arrow prev" id="tplPrevScreen">‹</button><div class="tpl-preview-canvas" id="tplPreviewCanvas" data-viewport="desktop"></div><button type="button" class="tpl-preview-arrow next" id="tplNextScreen">›</button></div>' +
          '<aside class="tpl-screen-rail"><header><div><span id="tplRailCount"></span><b id="tplRailTitle"></b></div><small id="tplRailHint"></small></header><div class="tpl-preview-thumbs" id="tplPreviewThumbs" role="list"></div></aside>' +
        '</div>' +
        '<footer class="tpl-preview-foot"><div class="tpl-interaction-state"><i></i><span><b id="tplInteractionLabel"></b><small id="tplInteractionText"></small></span></div><div class="tpl-prototype-meta"><span><i></i>PROTOTYPE</span><b id="tplFooterPage"></b></div></footer>' +
      '</section>';
    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) close();
    });
    document.getElementById("tplPreviewClose").addEventListener("click", close);
    document.getElementById("tplPrevScreen").addEventListener("click", function () { changePage(-1); });
    document.getElementById("tplNextScreen").addEventListener("click", function () { changePage(1); });
    document.getElementById("tplColorway").addEventListener("click", function () {
      modalState.alternate = !modalState.alternate;
      renderCanvas();
    });
    document.getElementById("tplViewportSwitch").addEventListener("click", function (event) {
      var button = event.target.closest("[data-preview-viewport]");
      if (!button) return;
      modalState.viewport = button.getAttribute("data-preview-viewport") || "desktop";
      renderModal();
    });
    document.getElementById("tplUseMain").addEventListener("click", function () { applyTemplate("direct"); });
    document.getElementById("tplUseMore").addEventListener("click", function (event) {
      event.stopPropagation();
      var menu = document.getElementById("tplUseMenu");
      var open = !menu.classList.contains("show");
      menu.classList.toggle("show", open);
      event.currentTarget.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.getElementById("tplUseMenu").addEventListener("click", function (event) {
      var item = event.target.closest("[data-template-intent]");
      if (!item) return;
      applyTemplate(item.getAttribute("data-template-intent"));
    });
    document.getElementById("tplShareButton").addEventListener("click", shareTemplate);
    document.getElementById("tplFavoriteButton").addEventListener("click", toggleFavorite);
    document.getElementById("tplPreviewThumbs").addEventListener("click", function (event) {
      var button = event.target.closest("[data-template-page]");
      if (!button) return;
      modalState.page = Number(button.getAttribute("data-template-page")) || 0;
      renderModal();
    });
    document.getElementById("tplPreviewThumbs").addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      var button = event.target.closest("[data-template-page]");
      if (!button) return;
      event.preventDefault();
      modalState.page = Number(button.getAttribute("data-template-page")) || 0;
      renderModal();
    });
    document.getElementById("tplPreviewCanvas").addEventListener("click", function (event) {
      var canvas = document.getElementById("tplPreviewCanvas");
      var button = event.target.closest("[data-demo-action]");
      var info = modalState.template ? localized(modalState.template, modalState.lang) : null;
      var label = button ? button.getAttribute("data-demo-action") : (info ? info.pages[modalState.page] : text(modalState.lang, "page"));
      event.preventDefault();
      event.stopPropagation();
      Array.prototype.forEach.call(document.querySelectorAll("#tplPreviewCanvas .is-demo-active"), function (node) { node.classList.remove("is-demo-active"); });
      if (button) button.classList.add("is-demo-active");
      canvas.classList.remove("is-canvas-active");
      void canvas.offsetWidth;
      canvas.classList.add("is-canvas-active");
      document.getElementById("tplInteractionText").textContent = text(modalState.lang, "actionDone") + label;
    });
    document.addEventListener("click", function (event) {
      var menu = document.getElementById("tplUseMenu");
      if (!menu || event.target.closest(".tpl-use-split")) return;
      menu.classList.remove("show");
      var more = document.getElementById("tplUseMore");
      if (more) more.setAttribute("aria-expanded", "false");
    });
    if (!keyHandlerBound) {
      document.addEventListener("keydown", function (event) {
        var activeModal = document.getElementById("templatePreview");
        if (!activeModal || activeModal.hidden) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") changePage(-1);
        if (event.key === "ArrowRight") changePage(1);
      });
      keyHandlerBound = true;
    }
    return modal;
  }

  function renderCanvas() {
    if (!modalState.template) return;
    var canvas = document.getElementById("tplPreviewCanvas");
    canvas.innerHTML = artMarkup(modalState.template, modalState.page, modalState.lang, false, modalState.alternate);
    canvas.setAttribute("data-viewport", modalState.viewport || "desktop");
    Array.prototype.forEach.call(document.querySelectorAll("#tplViewportSwitch [data-preview-viewport]"), function (button) {
      var selected = button.getAttribute("data-preview-viewport") === modalState.viewport;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    document.getElementById("templatePreview").setAttribute("data-colorway", modalState.alternate ? "alternate" : "primary");
  }
  function renderModal() {
    var template = modalState.template;
    if (!template) return;
    var info = localized(template, modalState.lang);
    var c = COPY[modalState.lang];
    document.getElementById("tplPreviewKicker").textContent = info.category + " · " + c.live;
    document.getElementById("tplPreviewTitle").textContent = info.name;
    document.getElementById("tplPreviewDescription").textContent = info.desc;
    document.getElementById("tplPreviewTags").innerHTML = info.tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join("");
    document.getElementById("tplLicenseBadge").innerHTML = '<i>✓</i>' + c.commercial;
    document.getElementById("tplShareButton").querySelector("b").textContent = c.share;
    document.getElementById("tplFavoriteButton").querySelector("b").textContent = isFavorite(template.id) ? c.favorited : c.favorite;
    document.getElementById("tplFavoriteButton").querySelector("span").textContent = isFavorite(template.id) ? "♥" : "♡";
    document.getElementById("tplFavoriteButton").setAttribute("aria-pressed", isFavorite(template.id) ? "true" : "false");
    document.getElementById("tplUseMain").textContent = c.use;
    document.getElementById("tplPreviewClose").setAttribute("aria-label", c.close);
    document.getElementById("tplPrevScreen").setAttribute("aria-label", c.previous);
    document.getElementById("tplNextScreen").setAttribute("aria-label", c.next);
    document.getElementById("tplColorway").querySelector("span").textContent = c.colorway;
    document.querySelector('#tplViewportSwitch [data-preview-viewport="desktop"] b').textContent = c.desktop;
    document.querySelector('#tplViewportSwitch [data-preview-viewport="tablet"] b').textContent = c.tablet;
    document.querySelector('#tplViewportSwitch [data-preview-viewport="mobile"] b').textContent = c.mobile;
    document.getElementById("tplScreenCounter").textContent = c.page + " " + String(modalState.page + 1).padStart(2, "0") + " / " + String(info.pages.length).padStart(2, "0");
    document.getElementById("tplScreenName").textContent = info.pages[modalState.page];
    document.getElementById("tplRailCount").textContent = info.pages.length + " " + c.screens;
    document.getElementById("tplRailTitle").textContent = c.screenRailTitle;
    document.getElementById("tplRailHint").textContent = c.scrollHint;
    document.getElementById("tplInteractionLabel").textContent = c.interaction;
    document.getElementById("tplInteractionText").textContent = c.interactionReady;
    document.getElementById("tplFooterPage").textContent = String(modalState.page + 1).padStart(2, "0") + " / " + String(info.pages.length).padStart(2, "0") + " · " + info.pages[modalState.page];
    document.getElementById("tplUseMenu").innerHTML = [
      { id: "direct", title: c.useNow, sub: c.useNowSub, icon: "↗" },
      { id: "brief", title: c.useBrief, sub: c.useBriefSub, icon: "✦" },
      { id: "remix", title: c.remix, sub: c.remixSub, icon: "⎘" }
    ].map(function (item) { return '<button type="button" role="menuitem" data-template-intent="' + item.id + '"><i>' + item.icon + '</i><span><b>' + esc(item.title) + '</b><small>' + esc(item.sub) + '</small></span></button>'; }).join("");
    document.getElementById("tplPreviewThumbs").innerHTML = info.pages.map(function (name, index) {
      var number = String(index + 1).padStart(2, "0");
      return '<div role="button" tabindex="0" class="tpl-screen-item' + (index === modalState.page ? " is-active" : "") + '" data-template-page="' + index + '"><span class="tpl-screen-thumb">' + artMarkup(template, index, modalState.lang, true, modalState.alternate) + '</span><span class="tpl-screen-copy"><b><i>' + number + '</i>' + esc(name) + '</b><small>' + c[modalState.viewport || "desktop"] + ' · ' + c.interactive + '</small></span><em>›</em></div>';
    }).join("");
    renderCanvas();
    requestAnimationFrame(function () {
      var active = document.querySelector("#tplPreviewThumbs [data-template-page].is-active");
      if (active && typeof active.scrollIntoView === "function") active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }
  function changePage(direction) {
    if (!modalState.template) return;
    var pages = localized(modalState.template, modalState.lang).pages;
    modalState.page = (modalState.page + direction + pages.length) % pages.length;
    renderModal();
  }
  function applyTemplate(intent) {
    var callback = modalState.onUse;
    var template = modalState.template;
    close();
    if (typeof callback === "function" && template) callback(template, intent || "direct");
  }
  function shareTemplate() {
    if (!modalState.template) return;
    var url = location.origin + location.pathname + "#/templates/" + encodeURIComponent(modalState.template.id) + "/" + (modalState.page + 1);
    var done = function () {
      var button = document.getElementById("tplShareButton");
      if (!button) return;
      var old = button.querySelector("b").textContent;
      button.querySelector("b").textContent = text(modalState.lang, "shared");
      setTimeout(function () { if (button && button.querySelector("b")) button.querySelector("b").textContent = old; }, 1600);
    };
    var fallbackCopy = function () {
      var input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(input);
      input.select();
      try { document.execCommand("copy"); } catch (error) {}
      input.remove();
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done).catch(fallbackCopy);
    else fallbackCopy();
  }
  function favoriteIds() {
    try { return JSON.parse(localStorage.getItem("db-template-favorites") || "[]") || []; } catch (e) { return []; }
  }
  function isFavorite(id) { return favoriteIds().indexOf(id) >= 0; }
  function toggleFavorite() {
    if (!modalState.template) return;
    var ids = favoriteIds();
    var index = ids.indexOf(modalState.template.id);
    if (index >= 0) ids.splice(index, 1); else ids.push(modalState.template.id);
    try { localStorage.setItem("db-template-favorites", JSON.stringify(ids)); } catch (e) {}
    renderModal();
  }
  function open(id, options) {
    var template = typeof id === "string" ? byId(id) : id;
    if (!template) return false;
    var modal = ensureModal();
    modalState.template = template;
    modalState.lang = langOf(options && options.lang);
    modalState.page = Math.max(0, Math.min(localized(template, modalState.lang).pages.length - 1, Number(options && options.page) || 0));
    modalState.alternate = false;
    modalState.viewport = "desktop";
    modalState.onUse = options && options.onUse;
    modalState.onClose = options && options.onClose;
    modalState.returnFocus = document.activeElement;
    renderModal();
    modal.hidden = false;
    document.body.classList.add("template-preview-open");
    requestAnimationFrame(function () { modal.classList.add("show"); document.getElementById("tplPreviewClose").focus(); });
    return true;
  }
  function close() {
    var modal = document.getElementById("templatePreview");
    if (!modal || modal.hidden) return;
    modal.classList.remove("show");
    document.body.classList.remove("template-preview-open");
    setTimeout(function () { modal.hidden = true; }, 180);
    if (modalState.returnFocus && typeof modalState.returnFocus.focus === "function") modalState.returnFocus.focus();
    var onClose = modalState.onClose;
    modalState.onClose = null;
    if (typeof onClose === "function") onClose(modalState.template, modalState.page);
  }

  global.StudioTemplates = {
    items: TEMPLATES,
    byId: byId,
    localized: localized,
    categories: categoryList,
    text: text,
    cardMarkup: cardMarkup,
    featuredMarkup: featuredMarkup,
    artMarkup: artMarkup,
    open: open,
    close: close
  };
})(window);
