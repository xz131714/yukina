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
