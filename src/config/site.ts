/**
 * 站点基础信息配置
 */
const siteConfig = {
  /** 网站标题，显示在浏览器标签和首页大标题 */
  title: "RyuChan's Blog",
  
  /** 网站副标题，显示在首页标题下方 */
  subTitle: "欲买桂花同载酒，终不似，少年游！",
  
  /** 导航栏品牌标题 */
  brandTitle: "RyuChan",

  /** 网站描述，用于SEO和分享卡片 */
  description: "Ciallo～(∠・ω<)⌒★",

  /** 网站完整URL，用于生成sitemap和绝对链接 */
  site: "https://hub.xiaozhangya.xin",

  /** 网站语言和日期格式设置 */
  locale: "zh-CN" as const,
  
  /** 文章URL生成模式 */
  slugMode: "RAW" as const,

  /** 文章版权许可证配置 */
  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  }
};

export default siteConfig;
