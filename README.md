# ele-music

项目预览地址：https://elemusic.vercel.app

## 目录结构

- NeteaseCloudMusicApi：网易云音乐 API
- admin：管理系统
- serve：服务端
- public：公共文件
- reportermap：数据请求解决方案
- src：源码
- .browserslistrc：浏览器兼容性配置
- .eslintrc.js：ESLint 配置
- .gitignore：Git 忽略文件配置
- .gitmodules：Git 子模块配置
- .nvmrc：Node 版本管理配置
- LICENSE：开源协议
- README.md：项目说明文档
- babel.config.js：Babel 配置
- debug.log：调试日志
- package-lock.json：NPM 依赖版本锁定文件
- package.json：NPM 项目配置及依赖
- vue.config.js：Vue 项目配置

## 安装与使用

1. 克隆项目到本地：

```bash
git clone https://github.com/zhengdechang/elemusic.git
```

2. 进入项目目录：

```bash
cd elemusic
```

3. 安装依赖：

```bash
npm install
```

4. 运行项目：
   
 运行前保证下面两个项目已经启动
- NeteaseCloudMusicApi：网易云音乐 API
- serve：服务端

```bash
npm run serve
```

现在，你可以在浏览器中访问 `http://localhost:3000` 。

## 贡献

如果你在使用过程中发现任何问题，或者有好的建议和想法，欢迎提交 Issue 或 Pull Request。

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./LICENSE) 文件。
