/**
 * RyuChan 博客主题配置文件
 * 
 * 此配置文件是对模块化配置的统一导出，便于在项目中使用。
 * 所有实际配置项已按功能分类并移至 src/config 目录中。
 * 修改配置后需要重新构建项目才能生效。
 */
import config from './src/config';
import type { Configuration } from "./src/types/config";

const RyuChanConfig: Configuration = config;
/**
 * 为了向后兼容和提供一个统一入口点，该文件重新导出配置
 * 
 * 如需修改配置，请修改 src/config/ 目录下的相应文件:
 * - site.ts: 站点基本信息
 * - navigation.ts: 导航菜单配置
 * - user.ts: 用户个人信息
 * - appearance.ts: 外观和布局配置
 * - comment.ts: 评论系统配置
 */

export default config;
