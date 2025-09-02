import type I18nKeys from "../locales/keys";

interface Configuration {
  title: string;
  subTitle: string;
  brandTitle: string;

  description: string;

  site: string;

  locale: "en" | "zh-CN";

  navigators: { nameKey: I18nKeys; href: string }[];

  username: string;
  sign: string;
  avatarUrl: string;

  socialLinks: { icon: string; link: string }[];

  maxSidebarCategoryChip: number;
  maxSidebarTagChip: number;
  maxFooterCategoryChip: number;
  maxFooterTagChip: number;

  banners: string[];

  slugMode: "HASH" | "RAW";

  license: {
    name: string;
    url: string;
  };

  // 添加 Giscus 评论系统配置  
  giscus?: {  
    enable: boolean;  
    repo: string;  
    repoId: string;  
    category: string;  
    categoryId: string;  
    mapping: string;  
    strict: string;  
    reactionsEnabled: string;  
    emitMetadata: string;  
    inputPosition: string;  
    theme: string;  
    lang: string;  
    loading: string;  
  };  

   // 添加樱花配置类型  
  sakura?: {  
    enable: boolean;  
    sakuraNum: number;  
    limitTimes: number;  
    size: { min: number; max: number };  
    speed: {  
      horizontal: { min: number; max: number };  
      vertical: { min: number; max: number };  
      rotation: number;  
    };  
    zIndex: number;  
  };

  bannerStyle: "LOOP";
}

export type { Configuration };
