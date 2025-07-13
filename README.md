# Sudoku Genesis Creator

一个优雅的数独游戏创作工具，支持PWA功能，可以离线使用。

## 🎯 项目特性

- 🎮 **数独游戏功能** - 完整的数独游戏体验
- 📱 **PWA 支持** - 可安装到桌面，支持离线使用
- 🎨 **现代设计** - 使用 shadcn-ui 和 Tailwind CSS
- ⚡ **高性能** - 基于 Vite 构建，启动速度快
- 🔧 **TypeScript** - 完整的类型安全

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📱 PWA 功能

本项目支持完整的 PWA 功能：

### 主要特性
- **离线访问** - 使用 Service Worker 缓存关键资源
- **安装到桌面** - 支持各种设备和操作系统
- **自动更新** - 应用会自动检查和更新到最新版本
- **原生体验** - 提供原生应用般的启动体验

### 如何安装到桌面

#### 桌面浏览器 (Chrome/Edge)
1. 访问应用
2. 点击地址栏右侧的"安装"按钮
3. 或者点击浏览器菜单中的"安装 Sudoku Genesis Creator"

#### 移动设备
- **iOS**: 点击分享按钮，选择"添加到主屏幕"
- **Android**: 浏览器会自动显示安装横幅，点击"安装"

详细的PWA使用指南请参考 [PWA_GUIDE.md](./PWA_GUIDE.md)

## 🛠️ 技术栈

- **构建工具**: Vite
- **前端框架**: React 18
- **语言**: TypeScript
- **UI组件**: shadcn-ui
- **样式**: Tailwind CSS
- **PWA支持**: vite-plugin-pwa + Workbox
- **路由**: React Router DOM

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── ui/             # shadcn-ui 组件
│   └── SudokuGame.tsx  # 数独游戏组件
├── hooks/              # 自定义 hooks
├── lib/                # 工具函数
├── pages/              # 页面组件
└── main.tsx           # 入口文件

public/
├── pwa-192x192.svg    # PWA 图标 (192x192)
├── pwa-512x512.svg    # PWA 图标 (512x512)
├── apple-touch-icon.svg # Apple Touch 图标
├── screenshot-desktop.svg # 桌面截图
├── screenshot-mobile.svg  # 移动端截图
└── favicon.ico        # 网站图标
```

## 🧪 测试 PWA 功能

### 使用 Chrome DevTools
1. 打开 Chrome DevTools (F12)
2. 切换到 Application 面板
3. 检查 Manifest 和 Service Worker 状态
4. 使用 Lighthouse 进行 PWA 评估

### 检查清单
- ✅ Web App Manifest 配置正确
- ✅ Service Worker 注册成功
- ✅ HTTPS 或 localhost 环境
- ✅ 离线功能正常工作
- ✅ 安装提示正常显示

## 🌐 浏览器兼容性

- ✅ Chrome 67+
- ✅ Firefox 62+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ✅ Samsung Internet 8.2+

## 🚀 部署

项目可以部署到任何支持静态文件的服务器：

- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

**注意**: 生产环境需要配置 HTTPS 才能使用完整的 PWA 功能。

## 📝 开发说明

### 代码风格
- 使用 ESLint 进行代码检查
- TypeScript 严格模式
- 组件使用函数式写法
- 样式使用 Tailwind CSS

### 构建优化
- 自动代码分割
- 资源压缩
- Tree shaking
- PWA 预缓存

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📄 许可证

MIT License
