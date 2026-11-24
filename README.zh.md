# dsh-acrylic-skin

[English](README.md) | 中文

DeepSeek Harness Desktop 的 Windows 亚克力皮肤。标题栏带和侧边栏变成透出系统 DWM 亚克力材质的半透明面板；对话内容区保持不透明。

这是一个浏览器插件包，附带一个空的 Host 半侧。它只绘制页面表面，原生窗口材质由桌面壳提供。

## 要求

- **Windows 11 22H2（build 22621）或更高版本**上的 DeepSeek Harness Desktop。
- 桌面壳必须启用亚克力背景，并在文档根节点写入 `data-windows-material="acrylic"`。这个标记决定插件是否生效；所有选择器都限定在该标记下，因此其他平台或没有该支持的构建不会发生任何变化。
- 桌面壳的主窗口必须是透明背景，Windows 标题栏 overlay 也必须是透明颜色。渲染进程插件无法修改 `BrowserWindow` 选项；没有这些壳侧设置就没有可透出的材质。

写作时 `deepseek-harness` 的 `dev` 分支提供了上述壳侧设置和标记。没有它们的构建不会显示效果，也不会破坏布局。

## 安装

从仓库把 bundle 安装到 Desktop profile：

```sh
dsh plugin --profile desktop add github:ihankun/dsh-acrylic-skin#<完整 commit>
```

请使用完整的 40 位 commit 以保证可复现。插件管理器会把 bundle 加入 profile；bundle 的 patch 挂载 Host 行，而同一个包通过 `./client` 提供浏览器半侧。如果安装结果显示 `restart-required`，重启 Desktop；启用 HMR 时会立即生效。

卸载：

```sh
dsh plugin --profile desktop remove dsh-acrylic-skin
```

## 改了什么

- 页面和窗口背景透明，让原生材质透出。
- 在应用框架上只铺一层半透明色调；标题栏带和侧边栏列保持透明，因此色调和材质读起来是一个表面。
- 浅色模式的色调把主题侧栏填充混入少量蓝色，再稀释到 40%；深色模式使用 50% 且不带蓝色，并调整玻璃填充。自定义主题跟随 `--dsw-specific-sidebar-fill`。
- New Session 控件使用与 macOS vibrancy 侧栏相同的玻璃填充，包括收起状态。
- 隐藏侧边栏滚动渐隐，因为它的不透明渐变会在材质上画出一条实色带。
- `prefers-reduced-transparency: reduce` 下把色调提高到 90%，并恢复不透明控件填充。

内容列保留自己的不透明底色，所以对话、面板和弹窗不受影响。

## 浏览器半侧如何接入

包同时声明两个面：

- `dsh.bundle.patch` 插入 `acrylic-skin` Host 行。
- `dsh.client.platform: "web"` 与 `exports["./client"]` 为该行提供浏览器 bundle。

浏览器 bundle 通过 `window.__ModuleLoader__.load` 注册一个 Cordis 插件，在 `apply` 中插入一个 `<style data-plugin="dsh-acrylic-skin">`，并通过 `ctx.effect` 在插件卸载时移除。选择器使用渲染器稳定的 `data-slot` 锚点（`root`、`sidebar`），而不是 CSS Module 哈希；仅两个外观选择器使用 `_scrollFade` 和 `_newSession` 类名后缀。

没有构建步骤：`lib/client.js` 内联自己的样式表。

## 兼容性

`engines.dsh` 要求 `>=0.2.2-rc.5`。皮肤针对该版本的客户端 DOM。亚克力材质本身仍然需要壳侧写入标记：0.2.2-rc.5 只在欢迎窗口使用亚克力，因此该版本上皮肤保持不生效。如果未来的侧栏改版重命名了这两个类名后缀，色调、透明和玻璃填充需要同步更新选择器；其余部分都依赖 slot 锚点和主题 token。

该皮肤与 `deepseek-harness` 的 `dev` 分支上当前内置的亚克力规则重复。它存在的目的是把视觉处理做成插件；当壳侧只保留原生材质支持时，这个插件可以独立提供页面表面。

## 许可证

MIT
