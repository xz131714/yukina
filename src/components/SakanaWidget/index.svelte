<!--
  SakanaWidget.svelte - 石蒜模拟器组件
  添加一个可爱的可交互式立牌小部件到网页右下角
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import config from '../../config';

  // 从配置文件读取石蒜模拟器设置
  const sakanaConfig = config.sakanaWidget;
  
  // 组件配置项
  let size = 200; // 组件大小 - 增大尺寸
  let autoFit = false; // 不需要自适应容器
  let character = sakanaConfig?.character || 'chisato'; // 角色
  let controls = sakanaConfig?.controls !== undefined ? sakanaConfig.controls : true; // 是否显示控制栏
  let rod = sakanaConfig?.rod !== undefined ? sakanaConfig.rod : true; // 是否显示支撑杆
  let draggable = sakanaConfig?.draggable !== undefined ? sakanaConfig.draggable : true; // 是否可拖动
  let rotate = 0; // 旋转角度
  let threshold = 0.1; // 停止动画的阈值

  // 内部状态
  let widgetContainer: HTMLElement;
  let widget: any = null;
  
  // 当组件挂载时，初始化Sakana Widget
  onMount(() => {
    // 动态加载CSS和JS
    loadCSS();
    loadJS().then(() => {
      if (window.SakanaWidget) {
        // 按官方推荐方式注册自定义角色
        const base = window.SakanaWidget.getCharacter('chisato');
        base.image = 'https://xz131714.github.io/PicBed/20250820231537259.png';
        window.SakanaWidget.registerCharacter('custom', base);
      }
      initWidget();
    });

    return () => {
      // 组件卸载时，清理widget
      if (widget) {
        widget.unmount();
      }
    };
  });

  // 加载Sakana Widget的CSS
  function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/sakana-widget@2.7.1/lib/sakana.min.css';
    document.head.appendChild(link);
  }

  // 加载Sakana Widget的JS
  function loadJS() {
    return new Promise((resolve) => {
      if (window.SakanaWidget) {
        resolve(window.SakanaWidget);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sakana-widget@2.7.1/lib/sakana.min.js';
      script.onload = () => resolve(window.SakanaWidget);
      document.body.appendChild(script);
    });
  }

  // 初始化Widget
  function initWidget() {
    if (!window.SakanaWidget || !widgetContainer) return;
    // 创建widget实例
    widget = new window.SakanaWidget({
      size,
      autoFit,
      character: 'custom',
      controls,
      rod,
      draggable,
      rotate,
      threshold
    });
    // 挂载到DOM
    widget.mount(widgetContainer);
  }
</script>

<div class="sakana-container" bind:this={widgetContainer}></div>

<style>
  .sakana-container {
    position: fixed;
    right: 30px;
    bottom: 4px;
    width: 200px;
    height: 250px;
    z-index: 999;
    pointer-events: none;
  }
  
  /* 确保模拟器本身可以交互，但占位容器不阻挡其他元素的点击 */
  :global(.sakana-container > *) {
    pointer-events: auto;
  }
  
  /* 移动设备上稍微调整位置 */
  @media (max-width: 768px) {
    .sakana-container {
      right: 10px;
      bottom: 4px;
      width: 150px;
      height: 200px;
    }
  }
</style>
