import type { GiscusConfig } from "../types/config";

/**
 * 评论系统配置
 */
const commentConfig: {
  /** Giscus 评论系统配置 */
  giscus: GiscusConfig;
} = {
  giscus: {
    enable: true,
    repo: "xz131714/gsc",
    repoId: "R_kgDOPTM-mA",
    category: "General",
    categoryId: "DIC_kwDOPTM-mM4CtcFq",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    theme: "preferred_color_scheme",
    lang: "zh-CN",
    loading: "lazy"
  }
};

export default commentConfig;
