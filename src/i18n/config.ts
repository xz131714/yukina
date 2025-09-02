/**
 * i18n 配置
 */

import type { Translation } from './translation';
import { en } from './languages/en';
import { zh_CN } from './languages/zh_cn';

/**
 * 支持的语言列表
 */
export const supportedLanguages = ['en', 'zh-CN'];

/**
 * 语言映射
 */
export const languageMappings: Record<string, Translation> = {
  en,
  'zh-CN': zh_CN,
};

/**
 * 默认语言
 */
export const defaultLanguage = 'zh-CN';
