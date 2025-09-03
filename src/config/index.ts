/**
 * 配置入口文件，整合所有配置模块
 */
import siteConfig from "./site";
import navigationConfig from "./navigation";
import userConfig from "./user";
import appearanceConfig from "./appearance";
import commentConfig from "./comment";
import umamiConfig from "./umami";
import type { Configuration } from "../types/config";

/**
 * RyuChan 博客主题配置
 * 整合所有模块配置为一个完整的配置对象
 */
const config: Configuration = {
  // 站点基本信息
  title: siteConfig.title,
  subTitle: siteConfig.subTitle,
  brandTitle: siteConfig.brandTitle,
  description: siteConfig.description,
  site: siteConfig.site,
  locale: siteConfig.locale,
  slugMode: siteConfig.slugMode,
  license: siteConfig.license,

  // 导航配置
  navigators: navigationConfig.navigators,

  // 用户信息
  username: userConfig.username,
  sign: userConfig.sign,
  avatarUrl: userConfig.avatarUrl,
  socialLinks: userConfig.socialLinks,

  // 外观配置
  maxSidebarCategoryChip: appearanceConfig.maxSidebarCategoryChip,
  maxSidebarTagChip: appearanceConfig.maxSidebarTagChip,
  maxFooterCategoryChip: appearanceConfig.maxFooterCategoryChip,
  maxFooterTagChip: appearanceConfig.maxFooterTagChip,
  banners: appearanceConfig.banners,
  bannerStyle: appearanceConfig.bannerStyle,
  sakura: appearanceConfig.sakura,

  // 评论系统
  giscus: commentConfig.giscus,

  // Umami统计系统
  umami: umamiConfig
};

export default config;
