# react-template

React项目模板

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
首先，我们需要安装 React 和 Typescript。

```shell
pnpm add react react-dom && pnpm add -D @types/react @types/react-dom typescript
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
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

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
  return <div>Hello World!</div>
};

export default App;
```

这个时候会有两个报错，第一个报错是 React 和 ReactDOM 没有默认导出，只能使用 `esModuleInterop` 标志默认导入。第二个报错是无法使用 JSX，除非提供了 `--jsx` 标志。让我们修改一下 tsconfig.json 文件以解决报错。

tsconfig.json
```json5
{
  // ...
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "jsx": "react-jsx"
  },
}
```

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
