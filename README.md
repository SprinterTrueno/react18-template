# react-template

React 项目模板

## 一、前言

[//]: # (TODO)

## 二、配置基本环境

在开始 webpack 配置之前，我们先初始化一个基本的 React + TS 项目。

### 操作环境

我们使用最新的 node 版本，并且使用 pnpm 作为包管理工具。

* OS: Windows 10 家庭中文版 
* [node](https://nodejs.org/zh-cn/): v18.14.2 
* [npm](https://nodejs.org/zh-cn/): v8.5.2 
* [pnpm](https://pnpm.io/zh/): v7.28.0

### 初始化仓库

1. 在根目录下执行 `pnpm init`。
2. 调整 `package.json` 文件，增加 `"private": true`，以便确保我们安装包是私有的，同时移除 `main` 入口。这可以防止意外发布你的代码。
3. 完善一些其他的信息。

### 搭建项目

首先，我们需要安装 React。

```shell
pnpm add react react-dom && pnpm add -D @types/react @types/react-dom
```

接着，我们在根目录下新建一个 src 文件夹和一个 tsconfig.json，并且在 src 目录下新建一个 index.tsx 和 App.tsx。

tsconfig.json

```json5
{
  "include": ["src"]
}
```

src/index.tsx

```typescript jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

src/App.tsx

```typescript jsx
import React from "react";

const App: React.FC = () => {
  return <div>Hello World!</div>;
};

export default App;
```

这个时候会有两个报错，第一个报错是 React 和 ReactDOM 没有默认导出，只能使用 `esModuleInterop` 标志默认导入。第二个报错是无法使用 JSX，除非提供了 `--jsx` 标志。让我们修改一下 tsconfig.json 文件以解决报错。

tsconfig.json

```json5
{
  // ...
  compilerOptions: {
    allowSyntheticDefaultImports: true,
    jsx: "react-jsx",
  },
}
```

这里可能有同志会问都使用 tsx 了为什么不安装 typescript。我们执行 `pnpm add -D typesciript` 安装的是 typescript 编译器，不是 typescript 语言。我们并不需要使用 typescript 编译器（至少目前不需要）去做编译打包的工作，所以我们不需要安装 typescript 编译器。

现在我们的基本环境已经准备好了，接下来可以配置 webpack 了。此刻你的项目看起来应该如下：

```text
react-template
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── App.tsx
│   └── index.tsx
└── tsconfig.json
```

## 三、基础配置

现在，我们要把 src 目录下的代码打包并添加到一个 html 文件中，并且打开 html 文件能够正常的展示 `Hello World!`。

第一步当然是安装 webpack 啦！

```shell
pnpm add -D webpack webpack-cli
```

接着我们在根目录下新建一个 webpack.config.js，并且添加一些配置项。

webpack.config.js

```javascript
const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
};
```

上面的配置项告诉了 webpack 使用开发模式，以 src/index.tsx 作为入口，将打包的文件输出到根目录下的 dist 文件夹。

现在我们执行一下 `pnpm webpack`，webpack 会提示我们需要一个 loader 来加载当前文件（index.tsx），原因是 webpack 只认识 js 和 json，遇到其他类型的文件需要使用 loader 给它翻译一下。比如我们编译 less 文件时需要使用 less-loader 把 less 文件变成 css 文件，再用 css-loader 把 css 文件变成 CommonJS 文件，最终 webpack 得以完成工作。

由于我们之前不打算使用 tsc（typescript 编译器），所以我们选择 [Babel](https://www.babeljs.cn) 作为我们的编译器，这里我们需要用到如下几个库：

* **babel-loader**：允许使用 Babel 和 webpack 转译 JavaScript 文件。
* **@babel/core**：Babel 的核心编译库。
* **@babel/preset-env**：Babel 转译过程中的预设。主要用于将 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。
* **@babel/preset-react**：根据不同的 runtime，调用 React.createElement 或 __jsx 来转换 jsx。
* **@babel/preset-typescript**：将 ts 语法转换为 js 语法。

我们执行以下命令安装我们需要用到的库，并更新 webpack.config.js。

```shell
pnpm add -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
```

webpack.config.js

```javascript
// ...
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        include: /src/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
        },
      },
    ],
  },
};
```

我们再次执行 `pnpm webpack`，依然有报错信息，这里我们重点看这句话：no extension. D:\xxx\react-template\src\App doesn't exist .js。webpack 提示我们没有扩展，在 src 目录下找不到 App.js。这是因为我们引入 App.tsx 的时候没有写文件后缀名导致的，webpack 默认会尝试按顺序解析以 .js、.json、.wasm 的文件，所以我们需要告诉 webpack 引入模块时不带后缀名它应该怎么去解析，让我们再增加一些配置。

webpack.config.js

```javascript
// ...
module.exports = {
  // ...
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
  },
};
```

我们再次执行 `pnpm webpack`，这次 webpack 成功的在 dist 目录下输出了一个 main.js 文件，我们在 dist 目录下新建一个 index.html，然后引入我们的 main.js 文件。

dist/index.html

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="main.js"></script>
  </body>
</html>
```

接着打开 index.html，页面成功展示了 `Hello World!`。此刻你的项目看起来应该如下：

```text
react-template
├── dist
│   ├── index.html
│   └── main.js
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── App.tsx
│   └── index.tsx
├── tsconfig.json
└── webpack.config.js
```
