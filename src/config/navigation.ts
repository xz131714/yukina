import key from "../i18n/keys";
import type { NavigatorItem } from "../types/config";

/**
 * 导航菜单配置
 */
const navigationConfig: {
  /** 导航栏菜单项 */
  navigators: NavigatorItem[];
} = {
  navigators: [
    {
      nameKey: key.nav_bar_home,
      href: "/",
    },
    {
      nameKey: key.nav_bar_archive,
      href: "/archive",
    },
    {  
      nameKey: key.nav_bar_navigation,
      href: "/navigation",
    },
    {
      nameKey: key.nav_bar_bangumi,
      href: "/bangumi",
    },
    {
      nameKey: key.nav_bar_music,  
      href: "/music",  
    },  
    {
      nameKey: key.nav_bar_about,
      href: "/about",
    },
    // {
    //   nameKey: key.nav_bar_github,
    //   href: "https://github.com/WhitePaper233/yukina",
    // },
  ]
};

export default navigationConfig;

