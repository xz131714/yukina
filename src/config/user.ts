import type { SocialLink } from "../types/config";

/**
 * 用户个人信息配置
 */
const userConfig: {
  /** 用户名，显示在页脚和关于页面 */
  username: string;
  /** 个性签名，显示在头像下方 */
  sign: string;
  /** 头像URL，建议使用HTTPS链接 */
  avatarUrl: string;
  /** 社交媒体链接 */
  socialLinks: SocialLink[];
} = {
  username: "RyuChan",
  sign: "Ciallo～(∠・ω<)⌒★",
  avatarUrl: "https://s2.loli.net/2025/01/25/FPpTrQSezM8ivbl.webp",
  socialLinks: [
    {
      icon: "line-md:github-loop",
      link: "https://github.com/xz131714",
    },
    {
      icon: "mingcute:bilibili-line",
      link: "https://space.bilibili.com/22433608",
    },
    {
      icon: "mingcute:netease-music-line",
      link: "https://music.163.com/#/user/home?id=125291648",
    },
  ]
};

export default userConfig;
