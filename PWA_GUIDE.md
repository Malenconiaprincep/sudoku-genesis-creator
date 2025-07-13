# PWA 用户指南

## 什么是 PWA？

PWA（Progressive Web App）是一种渐进式网络应用程序，它结合了网站的便利性和原生应用的功能。

## 项目中的 PWA 功能

### 1. 离线访问

- 应用可以在没有网络连接的情况下正常运行
- 使用 Service Worker 技术缓存关键资源
- 提供流畅的离线体验

### 2. 安装到桌面

- 用户可以将应用安装到桌面，就像原生应用一样
- 支持 Windows、macOS、Linux 和移动设备
- 提供原生应用般的启动图标和启动体验

### 3. 自动更新

- 应用会自动检查和更新到最新版本
- 使用 Workbox 提供可靠的缓存策略
- 无需用户手动更新

## 如何使用 PWA 功能

### 在桌面浏览器中：

1. 打开 Chrome/Edge 浏览器
2. 访问应用
3. 点击地址栏右侧的"安装"按钮
4. 或者点击浏览器菜单中的"安装 Sudoku Genesis Creator"
5. 应用将被安装到桌面

### 在移动设备上：

1. 打开 Safari (iOS) 或 Chrome (Android)
2. 访问应用
3. iOS: 点击分享按钮，选择"添加到主屏幕"
4. Android: 浏览器会自动显示安装横幅，点击"安装"

## 技术实现

### 使用的技术栈：

- **vite-plugin-pwa**: 提供 PWA 构建支持
- **Workbox**: 提供 Service Worker 和缓存策略
- **Web App Manifest**: 定义应用元数据

### 配置特点：

- 自动更新模式
- 预缓存关键资源
- 离线导航支持
- 自定义图标和启动画面

## 开发者信息

### 构建 PWA 版本：

```bash
npm run build
```

### 预览 PWA：

```bash
npm run preview
```

### 检查 PWA 功能：

1. 打开 Chrome DevTools
2. 切换到 Application 面板
3. 检查 Manifest 和 Service Worker 状态
4. 使用 Lighthouse 进行 PWA 评估

## 注意事项

1. PWA 功能需要 HTTPS 环境才能完全工作
2. 本地开发时，localhost 被认为是安全上下文
3. 生产环境必须配置 HTTPS 证书
4. 某些浏览器可能不支持所有 PWA 特性

## 浏览器兼容性

- ✅ Chrome 67+
- ✅ Firefox 62+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ✅ Samsung Internet 8.2+

## 资源文件

项目中包含的 PWA 相关文件：

- `public/pwa-192x192.svg` - 192x192 应用图标
- `public/pwa-512x512.svg` - 512x512 应用图标
- `public/apple-touch-icon.svg` - Apple Touch 图标
- `public/screenshot-desktop.svg` - 桌面截图
- `public/screenshot-mobile.svg` - 移动端截图
- `dist/manifest.webmanifest` - Web 应用清单
- `dist/sw.js` - Service Worker 文件
