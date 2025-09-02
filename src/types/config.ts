import type I18nKeys from "../locales/keys";

/**
 * 导航项配置
 */
export interface NavigatorItem {
  /** 导航项显示文本的国际化键名 */
  nameKey: I18nKeys;
  /** 导航项链接地址 */
  href: string;
}

/**
 * 社交媒体链接配置
 */
export interface SocialLink {
  /** 图标名称（基于已导入的图标库） */
  icon: string;
  /** 社交媒体链接 */
  link: string;
}

/**
 * 许可证配置
 */
export interface License {
  /** 许可证名称 */
  name: string;
  /** 许可证URL */
  url: string;
}

/**
 * 樱花特效配置
 */
export interface SakuraConfig {
  /** 是否启用樱花特效 */
  enable: boolean;
  /** 樱花数量 */
  sakuraNum: number;
  /** 樱花重生次数，-1表示无限 */
  limitTimes: number;
  /** 樱花大小范围 */
  size: { min: number; max: number };
  /** 樱花移动和旋转速度 */
  speed: {
    horizontal: { min: number; max: number };
    vertical: { min: number; max: number };
    rotation: number;
  };
  /** 樱花层级，控制是否显示在其他元素之上 */
  zIndex: number;
}

/**
 * Giscus评论系统配置
 */
export interface GiscusConfig {
  /** 是否启用评论功能 */
  enable: boolean;
  /** GitHub仓库，格式为"用户名/仓库名" */
  repo: string;
  /** 仓库ID */
  repoId: string;
  /** 讨论分类名称 */
  category: string;
  /** 讨论分类ID */
  categoryId: string;
  /** 页面和讨论的映射关系，可选值：pathname、url、title、og:title */
  mapping: string;
  /** 严格匹配，0=松散，1=严格 */
  strict: string;
  /** 是否启用表情反应，0=禁用，1=启用 */
  reactionsEnabled: string;
  /** 是否发出元数据，0=不发出，1=发出 */
  emitMetadata: string;
  /** 评论框位置，top=顶部，bottom=底部 */
  inputPosition: string;
  /** 主题，preferred_color_scheme=跟随系统 */
  theme: string;
  /** 语言 */
  lang: string;
  /** 加载方式，lazy=延迟加载 */
  loading: string;
}

/**
 * 博客主题完整配置接口
 */
interface Configuration {
  // 基础网站信息
  /** 网站标题 */
  title: string;
  /** 网站副标题 */
  subTitle: string;
  /** 导航栏品牌标题 */
  brandTitle: string;
  /** 网站描述，用于SEO和分享卡片 */
  description: string;
  /** 网站完整URL，用于生成sitemap和绝对链接 */
  site: string;
  /** 网站语言和日期格式设置 */
  locale: "en" | "zh-CN";

  // 导航相关
  /** 导航栏菜单项配置 */
  navigators: NavigatorItem[];

  // 用户个人信息
  /** 用户名，显示在页脚和关于页面 */
  username: string;
  /** 个性签名，显示在头像下方 */
  sign: string;
  /** 头像URL */
  avatarUrl: string;
  /** 社交媒体链接 */
  socialLinks: SocialLink[];

  // 布局和显示控制
  /** 侧边栏分类显示数量 */
  maxSidebarCategoryChip: number;
  /** 侧边栏标签显示数量 */
  maxSidebarTagChip: number;
  /** 页脚分类显示数量 */
  maxFooterCategoryChip: number;
  /** 页脚标签显示数量 */
  maxFooterTagChip: number;

  // 横幅相关
  /** 横幅图片URL列表 */
  banners: string[];

  // 内容相关
  /** 文章URL生成模式：RAW=原始文件名, HASH=文件名哈希值 */
  slugMode: "HASH" | "RAW";
  /** 文章版权许可证配置 */
  license: License;

  // 特效配置
  /** 樱花飘落特效配置 */
  sakura?: SakuraConfig;

  // 集成配置
  /** Giscus评论系统配置 */
  giscus?: GiscusConfig;

  // 布局与展示方式
  /** 横幅显示方式: LOOP=轮换显示, STATIC=静态显示, HIDDEN=隐藏 */
  bannerStyle: "LOOP" | "STATIC" | "HIDDEN";
}

export type { Configuration };
