/**
 * 音乐播放器配置文件
 * 
 * 配置Yukina博客的音乐播放器功能
 */

/**
 * 音乐播放器配置
 * @typedef {Object} MusicPlayerConfig
 * @property {boolean} enable - 是否启用音乐播放器功能
 * @property {"local"|"meting"} mode - 播放模式，local为本地音乐，meting为在线API获取
 * @property {string} meting_api - Meting API地址
 * @property {string} id - 歌单ID，默认为网易云音乐ID
 * @property {string} server - 音乐服务器，netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐
 * @property {string} type - 内容类型，如playlist=歌单
 */

/**
 * 音乐播放器配置
 */
export default {
  /**
   * 是否启用音乐播放器
   * 设置为 true 时会在页面左下角显示音乐播放器
   */
  enable: true,

  /**
   * 播放模式
   * - "local": 本地音乐播放
   * - "meting": 通过API获取在线音乐
   */
  mode: "local" as "local" | "meting",  /**
   * Meting API 地址
   * 默认使用bilibili.uno的公共API
   * 也可以自建API服务
   */
  meting_api: "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&auth=:auth&r=:r",

  /**
   * 歌单ID
   * - 网易云音乐：歌单ID
   * - QQ音乐：歌单ID
   */
  id: "14164869977", // 默认为网易云音乐示例歌单

  /**
   * 音乐平台
   * - "netease": 网易云音乐
   * - "tencent": QQ音乐
   * - "kugou": 酷狗音乐
   * - "xiami": 虾米音乐
   * - "baidu": 百度音乐
   */
  server: "netease",

  /**
   * 内容类型
   * - "playlist": 歌单
   * - "song": 单曲
   * - "album": 专辑
   * - "artist": 艺术家
   */
  type: "playlist",
};
