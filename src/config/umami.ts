/**
 * Umami统计配置
 */
import type { UmamiConfig } from "../types/config";

/**
 * Umami统计配置
 * 
 * 用于网站访问统计。需要有Umami服务部署并配置好
 */
export default {
  /**
   * 是否启用Umami统计
   */
  enable: true, // 本地测试时可设置为 false
  /**
   * Umami服务基础URL
   */
  baseUrl: "https://um.131714.xyz",
  /**
   * Umami分享ID
   */
  shareId: "a3FQfFJqDvjTVbVh",
  /**
   * 时区
   */
  timezone: "Asia/Shanghai",
  /**
   * 网站ID，仅用于追踪代码，不用于API请求
   */
  websiteId: "42d2e65e-b7b5-4cf0-b73d-9058a90ee2eb",
} as UmamiConfig;
