import type { SakuraConfig } from "../types/config";

/**
 * 外观和布局配置
 */
const appearanceConfig: {
  /** 侧边栏分类显示数量（建议设置为2和3的公倍数） */
  maxSidebarCategoryChip: number;
  /** 侧边栏标签显示数量 */
  maxSidebarTagChip: number;
  /** 页脚分类显示数量 */
  maxFooterCategoryChip: number;
  /** 页脚标签显示数量 */
  maxFooterTagChip: number;
  /** 横幅图片URL列表 */
  banners: string[];
  /** 横幅显示方式 */
  bannerStyle: "LOOP" | "STATIC" | "HIDDEN";
  /** 樱花飘落特效配置 */
  sakura: SakuraConfig;
} = {
  maxSidebarCategoryChip: 6,
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,
  banners: [
    "https://s2.loli.net/2025/01/25/PBvHFjr5yDu6t4a.webp",
    "https://s2.loli.net/2025/01/25/6bKcwHZigzlM4mJ.webp",
    "https://s2.loli.net/2025/01/25/H9WgEK6qNTcpFiS.webp",
    "https://s2.loli.net/2025/01/25/njNVtuUMzxs81RI.webp",
    "https://s2.loli.net/2025/01/25/tozsJ8QHAjFN3Mm.webp",
    "https://s2.loli.net/2025/01/25/Pm89OveZq7NWUxF.webp",
    "https://s2.loli.net/2025/01/25/UCYKvc1ZhgPHB9m.webp",
    "https://s2.loli.net/2025/01/25/JjpLOW8VSmufzlA.webp",
  ],
  bannerStyle: "LOOP",
  sakura: {
    enable: true,
    sakuraNum: 21,
    limitTimes: -1,
    size: { min: 0.5, max: 1.1 },
    speed: {
      horizontal: { min: -1.7, max: -1.2 },
      vertical: { min: 1.5, max: 2.2 },
      rotation: 0.03
    },
    zIndex: 100
  }
};

export default appearanceConfig;
