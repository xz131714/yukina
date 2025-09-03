/**
 * Sakana Widget 类型声明
 */

interface SakanaWidgetState {
  /**
   * 惯性
   */
  i: number;
  /**
   * 粘性
   */
  s: number;
  /**
   * 衰减
   */
  d: number;
  /**
   * 角度
   */
  r: number;
  /**
   * 高度
   */
  y: number;
  /**
   * 垂直速度
   */
  t: number;
  /**
   * 水平速度
   */
  w: number;
}

interface SakanaWidgetCharacter {
  image: string;
  initialState: SakanaWidgetState;
}

interface SakanaWidgetOptions {
  /**
   * 组件大小，默认 `200`
   */
  size?: number;
  /**
   * 自动适应容器大小 (最小 120px)，默认 `false`
   */
  autoFit?: boolean;
  /**
   * 角色，默认 `chisato`
   */
  character?: string;
  /**
   * 控制栏，默认 `true`
   */
  controls?: boolean;
  /**
   * 展示支撑杆，默认 `true`
   */
  rod?: boolean;
  /**
   * 可拖动，默认 `true`
   */
  draggable?: boolean;
  /**
   * canvas 线条设置，默认 `#b4b4b4` & `10`
   */
  stroke?: {
    color?: string;
    width?: number;
  };
  /**
   * 停止动画的阈值，默认 `0.1`
   */
  threshold?: number;
  /**
   * 旋转角度，默认 `0`
   */
  rotate?: number;
  /**
   * 开启 title 属性，默认 `false`
   */
  title?: boolean;
}

declare class SakanaWidget {
  constructor(options?: SakanaWidgetOptions);

  /**
   * 获取某个已注册角色的数据
   */
  static getCharacter(name: string): SakanaWidgetCharacter | null;

  /**
   * 获取所有已注册的角色
   */
  static getCharacters(): Record<string, SakanaWidgetCharacter>;

  /**
   * 注册一个新角色
   */
  static registerCharacter(name: string, character: SakanaWidgetCharacter): void;

  /**
   * 设置组件的当前状态
   */
  setState(state: Partial<SakanaWidgetState>): SakanaWidget;

  /**
   * 设置组件的当前角色
   */
  setCharacter(name: string): SakanaWidget;

  /**
   * 切换到下一个角色
   */
  nextCharacter(): SakanaWidget;

  /**
   * 切换自走模式
   */
  triggetAutoMode(): SakanaWidget;

  /**
   * 挂载组件
   */
  mount(el: HTMLElement | string): SakanaWidget;

  /**
   * 移除组件
   */
  unmount(): SakanaWidget;
}

interface Window {
  SakanaWidget: typeof SakanaWidget;
}
