# react-template

React 项目模板

## 一、前言

[//]: # "TODO"

## 二、基本环境配置

在开始 webpack 配置之前，我们先初始化一个基本的 React + TS 项目。

### 操作环境

我们使用最新的 node 版本，并且使用 pnpm 作为包管理工具。

- [node](https://nodejs.org/zh-cn/): v18.16.0
- [pnpm](https://pnpm.io/zh/): v8.4.0

### 初始化仓库

1. 在根目录下执行 `pnpm init`。
2. 调整 `package.json` 文件，增加 `"private": true`，以便确保我们安装包是私有的，同时移除 `main` 入口。这可以防止意外发布你的代码。
3. 完善一些其他的信息。

### 搭建项目

首先，我们需要安装 [React](https://react.dev)。

```shell
pnpm add react react-dom && pnpm add -D @types/react @types/react-dom
```

接着，我们在根目录下新建一个 src 文件夹和一个 tsconfig.json，并且在 src 目录下新建一个 index.tsx 和 App.tsx。

tsconfig.json

```json5
{
  include: ["src"]
}
```

src/index.tsx

```typescript jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

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
    jsx: "react-jsx"
  }
}
```

这里可能有同志会问都使用 tsx 了为什么不安装 typescript。我们执行 `pnpm add -D typesciript` 安装的是 typescript 编译器，不是 typescript 语言。我们只需要静态类型检查，并不需要它去做编译打包的工作（至少目前不需要），所以我们使用 IDE 自带的版本即可。当然，想体验 typescript 最新特性的也可以安装。

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

## 三、基础功能配置

### 加载 TS/TSX

现在，我们要把 src 目录下的代码打包并添加到一个 html 文件中，并且打开 html 文件能够正常的展示 `Hello World!`。

第一步当然是安装 [webpack](https://webpack.docschina.org) 啦！

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
    path: path.resolve(__dirname, "dist")
  }
};
```

上面的配置项告诉了 webpack 使用开发模式，以 `当前目录/src/index.tsx` 作为入口，将打包的文件输出到 `当前目录/dist` 文件夹。

现在我们执行一下 `pnpm webpack`，webpack 会提示我们需要一个 loader 来加载当前文件（index.tsx），原因是 webpack 只认识 js 和 json，遇到其他类型的文件需要使用 loader 给它翻译一下。比如我们编译 less 文件时需要使用 less-loader 把 less 文件变成 css 文件，再用 css-loader 把 css 文件变成 CommonJS 文件，最终 webpack 得以完成工作。

由于我们之前不打算使用 tsc（typescript 编译器），所以我们选择 [Babel](https://www.babeljs.cn) 作为我们的编译器，这里我们需要用到如下几个库：

- **babel-loader**：允许使用 Babel 和 webpack 转译 JavaScript 文件。
- **@babel/core**：Babel 的核心编译库。
- **@babel/preset-env**：Babel 转译过程中的预设，主要用于将 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中，如果确定项目不会运行在旧版本浏览器中可以不用。
- **@babel/preset-react**：Babel 转译过程中的预设，根据不同的 runtime，调用 React.createElement 或 \_\_jsx 来转换 jsx。
- **@babel/preset-typescript**：Babel 转译过程中的预设，将 ts 语法转换为 js 语法。

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
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript"
          ]
        }
      }
    ]
  }
};
```

上面的配置项会让 babel-loader 加载所有 ts/tsx 文件（所以这里也包括你代码中使用的三方库），然后按照 preset-typescript --> preset-react --> preset-env 顺序使用预设。

我们再次执行 `pnpm webpack`，依然有报错信息，这里我们重点看这句话：no extension. D:\xxx\react-template\src\App doesn't exist .js。webpack 提示我们没有扩展，在 src 目录下找不到 App.js。这是因为我们引入 App.tsx 的时候没有写文件后缀名导致的，webpack 默认会尝试按顺序解析以 .js、.json、.wasm 的文件，所以我们需要告诉 webpack 引入模块时不带后缀名它应该怎么去解析，让我们再增加一些配置。

webpack.config.js

```javascript
// ...
module.exports = {
  // ...
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"]
  }
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

### 加载 CSS

为了在 JavaScript 模块中 import 一个 CSS 文件，我们需要安装 [style-loader](https://github.com/webpack-contrib/style-loader) 和 [css-loader](https://github.com/webpack-contrib/css-loader)，并在 module 配置 中添加这些 loader：

- **style-loader**：把 CSS 插入到 DOM 中。
- **css-loader**：对 @import 和 url() 进行处理，就像 js 解析 import/require() 一样。

```shell
pnpm add -D style-loader css-loader
```

webpack.config.js

```javascript
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
```

loader 可以链式调用，链中的每个 loader 都将对资源进行转换。链会逆序执行，第一个 loader 将其结果（被转换后的资源）传递给下一个 loader，依此类推。最后，webpack 期望链中最后的 loader 返回 JavaScript。

上述配置项使我们可以在依赖于此样式的 js 文件中 import './style.css'。现在，在此模块执行过程中，含有 CSS 字符串的 `<style>` 标签，将被插入到 html 文件的 `<head>` 中。

让我们来尝试一下，在 src 目录下新建一个 App.css 文件，并将其 import 到我们的 App.tsx 中：

src/App.css

```css
.text {
  color: coral;
}
```

src/App.tsx

```typescript jsx
import React from "react";
import "./App.css";

const App: React.FC = () => {
  return <div className="text">Hello World!</div>;
};

export default App;
```

让我们再次运行 `pnpm webpack`，然后打开我们的 index.html，`Hello World!` 的颜色变为了 coral，我们查看元素也能看到 head 标签中插入了 `<style>.text { color: coral; }</style>`。此刻你的项目看起来应该如下：

```text
react-template
├── dist
│   ├── index.html
│   └── main.js
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── App.css
│   ├── App.tsx
│   └── index.tsx
├── tsconfig.json
└── webpack.config.js
```

### 加载 Images

我们已经成功加载了样式文件，下面让我们加载图像试试。在 webpack 5 中，我们可以使用内置的 [Asset Module](https://webpack.docschina.org/guides/asset-modules) 来加载图像。

Asset Module 是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。

首先，我们在 src/assets/images 目录下新增一张图片 doge.jpg，并且在 App.tsx 中引入这张图片，同时我们要修改 webpack 的配置文件：

src/App.tsx

```typescript jsx
import React from "react";
import doge from "./assets/images/doge.jpg";
import "./App.css";

const App: React.FC = () => {
  return (
    <div>
      <div className="text">Hello World!</div>
      <img src={doge} alt="doge" />
    </div>
  );
};

export default App;
```

webpack.config.js

```javascript
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(jpe?g|png|gif|svg|bpm)$/i,
        type: "asset"
      }
    ]
  }
};
```

这里我们导入图片的时候会有一个 ts 报错，提示我们无法找到模块或找不到相应的类型声明。原因是 ts 无法识别非代码资源，因此我们需要新建一个 ts 声明文件来声明 .jpg module，这样 ts 就可以识别非代码资源。d.ts 文件不能随便放置在项目中，这类文件一样需要被 Babel 或者 tsc 编译，所以要放置在 tsconfig.json 中 include 属性所配置的文件夹下。

根据我们的 tsconfig 配置，我们需要在 src 文件夹下新建我们的 d.ts 文件，这里我们直接复制 react 官方写的 d.ts 文件：

src/react-app-env.d.ts

```typescript
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

到了这里，我们会发现 react-app-env.d.ts 的第一行有一个报错：TS2688: Cannot find type definition file for 'node'. 这是由于我们没有显式安装 node 类型声明库导致的，我们根据提示安装一下即可：

```shell
pnpm add -D @types/node
```

完成这一步之后，我们可以发现报错已经没有了，同时我们引入图片的报错也已经消失了。

最后我们执行 `pnpm webpack`，可以看到 dist 文件夹下新增了一个名为 15f87fc5b4b106db6ee7.jpg 的文件，同时我们的图片也在页面上正常加载了。

其他类型资源的配置方法大体相同，不再做配置，如有需要可自行查阅文档。此刻你的项目看起来应该如下：

```text
react-template
├── dist
│   ├── 15f87fc5b4b106db6ee7.jpg
│   ├── index.html
│   └── main.js
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── images
│   │       └── doge.jpg
│   ├── index.tsx
│   └── react-app-env.d.ts
├── tsconfig.json
└── webpack.config.js
```

### 设置 HtmlWebpackPlugin

webpack 最终构建好的静态资源需要引入到一个 html 文件中，这样才能在浏览器中运行。我们之前手动的在 dist 文件夹下维护了一个 html 文件，如果我们更改了我们的一个入口起点的名称，甚至添加了一个新的入口，webpack 会在构建时重新命名生成的 bundle，但是我们的 index.html 文件仍然引用旧的名称。[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) 可以帮助我们解决这个问题。

首先安装插件，并且调整 webpack.config.js 文件：

```shell
pnpm add -D html-webpack-plugin
```

webpack.config.js

```javascript
// ...
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [new HtmlWebpackPlugin()]
};
```

我们重新构建一下，可以看到 dist 文件夹下生成了一个 index.html 文件，但是打开它页面并不能正常展示。我们来看一看这个 html 文件的内容：

dist/index.html

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="utf-8" />
    <title>Webpack App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script defer src="main.js"></script>
  </head>
  <body></body>
</html>
```

这个 html 文件中缺少了我们的 root 节点，我们需要给 HtmlWebpackPlugin 提供一个模板，我们在根目录下新建一个 public 文件夹，并在其中新增一个 index.html 文件作为我们的模板。

public/index.html

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

模板创建好了，我们还要还要为 HtmlWebpackPlugin 指定我们的模板。

webpack.config.js

```javascript
// ...
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html"
    })
  ]
};
```

我们再次构建并打开 dist 文件夹下的 index.html，页面正常打开！

### 清理 dist 文件夹

你可能已经注意到，由于遗留了之前的代码示例，我们的 dist 文件夹显得相当杂乱。webpack 将生成文件并放置在 dist 文件夹中，但是它不会追踪哪些文件是实际在项目中用到的。

通常比较推荐的做法是，在每次构建前清理 dist 文件夹，这样只会生成用到的文件。让我们使用 `output.clean` 配置项实现这个需求。

webpack.config.js

```javascript
// ...

module.exports = {
  // ...
  output: {
    // ...
    clean: true
  }
};
```

现在，执行 `pnpm build`，检查 dist 文件夹。如果一切顺利，现在只会看到构建后生成的文件，而没有旧文件！

## 四、开发环境

### 路径别名

我们经常使用路径别名，来确保模块引入变得更简单。例如使用 @ 来代替 src 文件夹：

index.tsx

```typescript jsx
import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import App from "@/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

这个时候我们可以看到已经有 TS 报错了：Cannot find module '@/App' or its corresponding type declarations（找不到模块“@/App”或其相应的类型声明）.

这里我们需要修改一下 tsconfig：

tsconfig.json

```json5
{
  compilerOptions: {
    // ...
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"]
    }
  },
  include: ["src"]
}
```

注意，这里我们只是解决了 TS 报错，webpack 同样的也不知道 `@` 是什么，我们还需要修改 webpack.config.js：

webpack.config.js

```javascript
// ...
module.exports = {
  // ...
  resolve: {
    // ...
    alias: { "@": path.resolve(__dirname, "src") }
  }
};
```

我们重新构建项目，页面正常地展示了 App.tsx。

### 使用 source map

当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。我们在 App.tsx 中制造一些错误来看看效果。

App.tsx

```typescript jsx
import React from "react";
import doge from "./assets/images/doge.jpg";
import "./App.css";

const App: React.FC = () => {
  console.logs("我是中国DotA的希望");

  return (
    <div>
      <div className="text">Hello World!</div>
      <img src={doge} alt="doge" />
    </div>
  );
};

export default App;
```

注意看，我们在第六行写了错误代码，我们现在执行 `pnpm webpack` 并且打开浏览器控制台，得到了这样的错误信息：console.logs is not a function at App (App.tsx:13:11)。这明显不是我们错误代码所在的地方，为了更容易地追踪 error 和 warning，JavaScript 提供了 source maps 功能，可以将编译后的代码映射回原始源代码。

webpack.config.js

```javascript
// ...
module.exports = {
  // ...
  devtool: "source-map"
};
```

现在我们再尝试一下，控制台现在显示的错误为：console.logs is not a function at App (App.tsx:6:11)。现在我们得到了准确的错误信息，这会非常有助于我们快速定位问题所在的位置。

### 使用 webpack-dev-server

在每次编译代码时，手动运行 pnpm webpack 会显得很麻烦，我们可以借助 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 在代码发生变化后自动编译代码。

安装 webpack-dev-server

```shell
pnpm add -D webpack-dev-server
```

为了方便我们执行命令，我们添加一些 script。

package.json

```json5
{
  // ...
  scripts: {
    start: "webpack serve",
    build: "webpack"
  }
}
```

我们现在执行 `pnpm start`，然后打开 localhost:8080 就可以看到我们的页面。如果你更改任何源文件并保存它们，web server 将在编译代码后自动重新加载。

现在我们修改 css 文件，页面样式可以在不刷新浏览器的情况实时生效，因为此时样式都在 style 标签里面，style-loader 做了替换样式的热替换功能。但是修改 App.tsx 浏览器会自动刷新后再显示修改后的内容，我们想要的不是刷新浏览器，而是在不需要刷新浏览器的前提下模块热更新，并且能够保留 react 组件的状态。

我们可以借助 [@pmmmwh/react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin) 插件来实现，但是该插件依赖于 react-refresh，所以我们需要安装一下两个依赖：

```shell
pnpm add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

webpack.config.js

```javascript
// ...
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: "babel-loader",
        options: {
          // ...
          plugins: ["react-refresh/babel"]
        }
      }
    ]
  },
  plugins: [
    // ...
    new ReactRefreshWebpackPlugin()
  ]
};
```

我们再次启动开发服务器，修改 App.tsx 会发现在不刷新浏览器的情况下，页面内容进行了热更新。

## 五、环境变量

### 命令行参数

development(开发环境) 和 production(生产环境) 这两个环境下的构建目标存在着巨大差异。在开发环境中，我们需要强大的 source map 和一个有着 live reloading(实时重新加载) 或 hot module replacement(热模块替换) 能力的 localhost server。而生产环境目标则转移至其他方面，关注点在于压缩 bundle、更轻量的 source map、资源优化等，通过这些优化方式改善加载时间。想要消除 webpack.config.js 在 开发环境 和 生产环境 之间的差异，我们需要环境变量(environment variable)。

webpack 命令行 环境配置 的 --env 参数，可以允许我们传入任意数量的环境变量。而在 webpack.config.js 中可以访问到这些环境变量。例如，--env production 或 --env goal=local。

我们先修改一下我们的脚本：

package.json

```json5
{
  // ...
  scripts: {
    start: "webpack serve --env development",
    build: "webpack --env NODE_ENV=production"
  }
}
```

接着，我们在 webpack.config.js 中接收我们的环境变量：

webpack.config.js

```javascript
// ...
module.exports = (env) => {
  console.log(env);
  return {
    // ...
  };
};
```

我们依次执行我们的脚本，env 会打印出如下结果：

```text
pnpm start：{ WEBPACK_SERVE: true, development: true }
pnpm build：{ WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, NODE_ENV: 'production' }
```

### 指定 mode

许多 library 通过与 process.env.NODE_ENV 等环境变量关联，以决定 library 中应该引用哪些内容（比如 React）。从 webpack v4 开始, 指定 mode 会自动地配置 [DefinePlugin](https://webpack.docschina.org/plugins/define-plugin)（允许在 编译时 将你代码中的变量替换为其他值或表达式）：

package.json

```json5
{
  // ...
  scripts: {
    start: "webpack serve --env NODE_ENV=development",
    build: "webpack --env NODE_ENV=production"
  }
}
```

这里要把 [webpack-dev-server](#使用-webpack-dev-server) 相关的配置临时注释掉，因为 production 模式不支持其相关配置。

webpack.config.js

```javascript
// ...
module.exports = (env) => {
  const { NODE_ENV } = env;

  return {
    // ...
    mode: NODE_ENV,
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ]
            // plugins: ["react-refresh/babel"]
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html"
      })
      // new ReactRefreshWebpackPlugin()
    ]
  };
};
```

index.tsx

```typescript jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if (process.env.NODE_ENV === "production") {
  console.log("生产环境");
} else {
  console.log("开发环境");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

我们依次执行命令，可以看到控制台中打印出了我们当前的所处环境。

## 六、缓存

webpack 在打包之后，会生成一个可部署的 /dist 目录，一旦 /dist 目录中的内容部署到服务器上，客户端（通常是浏览器）就能够访问此服务器以获取站点及其资源。但是为了减少网络请求的数量，提高网页加载速度，并减轻服务器的负载，浏览器会使用缓存。然而，如果在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本。由于缓存的存在，当你需要获取新的代码时，就会显得很棘手。我们现在要通过配置，让文件内容发生改变之后，浏览器可以请求到新的文件。

### 输出文件的文件名

更改 output.filename 中的 substitutions（可替换模板字符串） 以定义输出文件的名称。其中，[contenthash] substitution 将根据资源内容创建唯一哈希值。当资源内容发生变化时，[contenthash] 也会发生变化。

webpack.config.js

```javascript
// ...
module.exports = (env) => {
  const { NODE_ENV } = env;

  return {
    // ...
    output: {
      clean: true,
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist")
    }
  };
};
```

调整配置之后，我们再次进行构建，会发现我们的输出文件的名称增加了哈希值，只要我们修改文件，输出产物的哈希值就会发生变化，浏览器就会发现我们的文件进行了更新。

### 代码分离

代码分离是 webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle、控制资源加载优先级，如果使用合理，会极大减小加载时间。

一般三方包的代码变化频率很小，我们可以把 node_modules 中的代码单独打包，这样我们的三方包的 hash 值不会改变，浏览器就可以将其缓存起来，减少加载时间。

webpack.config.js

```javascript
// ...
module.exports = (env) => {
  const { NODE_ENV } = env;

  return {
    // ...
    optimization: {
      splitChunks: {
        chunks: "all",
        name: "vendors"
      }
    }
  };
};
```

我们再次构建，可以看到我们的构建产物中出现了了一个名为 vendors.js 的文件，这个就是我们 node_modules 里面的模块，而我们的业务代码则在 main.js 中。这样我们改动业务代码时，vendors.js 的哈希值不会发生变化，浏览器可以使用缓存来加载 vendors.js，只需要重新请求 main.js。

## 七、优化构建结果

### bundle 分析

webpack-bundle-analyzer 是一个 bundle 分析插件，使用交互式可缩放树形图可视化 bundle 的大小。通过该插件可以对 bundle 进行观察和分析，方便我们对不完美的地方进行针对性优化。

```shell
pnpm add -D webpack-bundle-analyzer
```

// webpack.config.js

```javascript
// ...
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env) => {
  const { NODE_ENV } = env;

  return {
    // ...
    plugins: [new BundleAnalyzerPlugin()]
  };
};
```

我们再次构建我们的项目，会发现构建结束后自动打开了 127.0.0.1:8888 显示了 bundle 报告。如果你想保存这个结果也可以生成一个 html 文件：

```javascript
// ...
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env) => {
  const { NODE_ENV } = env;

  return {
    // ...
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: path.resolve(__dirname, "bundle-analyze-result.html")
      })
    ]
  };
};
```

这样配置项说明我们将在当前目录下生成一个名为 bundle-analyze-result 的 html 文件，我们再次构建就可以看到根目录下看到它。

### 抽取 css

在开发环境我们希望 CSS 嵌入在 style 标签里面，方便样式热替换，但打包时我们希望把 CSS 单独抽离出来，可以使浏览器并行加载 CSS 文件和其他文件，提高页面加载速度和性能，同时可以利用浏览器缓存机制，减少网络请求。

[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 可以帮助我们做这件事，它可以为每个包含 CSS 的 JS 文件创建一个 CSS 文件，同时支持 CSS 和 SourceMaps 的按需加载。首先我们需要安装它：

```shell
pnpm add -D mini-css-extract-plugin
```

由于我们在构建的时候才会用到它，所以我们需要区分环境。我们顺便把之前临时禁用掉的 [webpack-dev-server](#使用-webpack-dev-server) 相关配置也加上。

webpack.config.js

```javascript
// ...
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
  const { NODE_ENV } = env;

  const DEVELOPMENT_ENV = NODE_ENV === "development";
  const PRODUCTION_ENV = NODE_ENV === "production";

  return {
    // ...
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          loader: "babel-loader",
          options: {
            // ...
            plugins: [
              DEVELOPMENT_ENV && require.resolve("react-refresh/babel")
            ].filter(Boolean)
          }
        },
        {
          test: /\.css$/i,
          use: [
            DEVELOPMENT_ENV ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        }
      ]
    },
    plugins: [
      DEVELOPMENT_ENV && new ReactRefreshWebpackPlugin(),
      PRODUCTION_ENV &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash:8].css"
        })
    ].filter(Boolean)
  };
};
```

大功告成，我们来看一下效果。在开发模式下，我们的样式在 style 标签中。在生产模式下，我们的 dist 文件夹中多了一个 main.css 文件。

### 压缩 css

我们刚才抽离出来的 main.css 文件是没有经过压缩的，为了进一步减小我们 css 文件的体积，我们需要借助 [css-minimizer-webpack-plugin](https://github.com/webpack-contrib/css-minimizer-webpack-plugin)。

```shell
pnpm add -D css-minimizer-webpack-plugin
```

webpack.config.js

```javascript
// ...
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = () => {
  return {
    // ...
    optimization: {
      // ...
      minimizer: [new CssMinimizerPlugin()]
    }
  };
};
```

再次执行 `pnpm build` 就可以看到 css 已经被压缩了。

### 压缩 js

当我们的 mode 为 production 时，webpack 会使用内置插件 [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin) 来压缩 js，但是我们上面配置了 optimization.minimizer 之后 webpack 就会以我们的配置为准，不再压缩 js，所以我们现在需要重新配置压缩 js。

虽然 webpack 已经内置了 terser-webpack-plugin，但是我们需要显示的引用它，所以我们还是手动需要安装一下。

```shell
pnpm add -D terser-webpack-plugin
```

webpack.config.js

```javascript
// ...
const TerserPlugin = require("terser-webpack-plugin");

module.exports = () => {
  return {
    // ...
    optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
    }
  };
};
```

现在我们就可以同时压缩 css 和 js 了。

## 八、优化构建速度

**不要为了很小的性能收益，牺牲应用程序的质量！** 注意，在大多数情况下，优化代码质量比构建性能更重要。

### 构建耗时分析

首先我们需要知道构建的时间都花在了什么地方，才能优化我们的构建速度。[speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin) 可以帮助我们做到这件事，我们首先安装依赖：

```shell
pnpm add -D speed-measure-webpack-plugin
```

由于我们不需要每次构建都统计构建耗时，所以我们在新增一个 webpack.speedMeasure.js 专门用来统计耗时，同时增加我们的 script：

webpack.speedMeasure.js

```javascript
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpackConfig = require("./webpack.config");

module.exports = (env) => {
  const smp = new SpeedMeasurePlugin();

  const config = smp.wrap(webpackConfig(env));

  return config;
};
```

package.json

```json5
{
  scripts: {
    // ...
    speedMeasure: "webpack --config webpack.speedMeasure.js --env NODE_ENV=production"
  }
}
```

我们来执行一下 `pnpm speedMeasure`，会发现出现了一个错误，提示我们没有添加 `mini-css-extract-plugin`，这是由于它们目前不兼容，我们需要改造一下我们的配置文件。

webpack.speedMeasure.js

```javascript
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpackConfig = require("./webpack.config");

module.exports = (env) => {
  const smp = new SpeedMeasurePlugin();
  const config = webpackConfig(env);

  const MiniCssExtractPluginIndex = config.plugins.findIndex((item) => {
    return item.constructor.name === "MiniCssExtractPlugin";
  });
  const MiniCssExtractPlugin = config.plugins[MiniCssExtractPluginIndex];

  const smpConfig = smp.wrap(config);
  smpConfig.plugins[MiniCssExtractPluginIndex] = MiniCssExtractPlugin;

  return smpConfig;
};
```

这样操作可以解决刚才的报错，但是统计不到 MiniCssExtractPlugin 的数据。我们再次执行 `pnpm speedMeasure`，可以在控制台中看到总耗时、Plugins 耗时和 Loaders 耗时。

### 持久化缓存

缓存生成的 webpack 模块和 chunk，来改善构建速度。

webpack.config.js

```javascript
module.exports = () => {
  return {
    // ...
    cache: { type: "filesystem" }
  };
};
```

我们现在执行 `pnpm build` 两次，第一次耗时 8067ms，第二次仅耗时 642ms。缓存的存储位置在 node_modules/.cache/webpack，里面又区分了 development 和 production 缓存。

### 缩小 loader 作用范围

合理配置 loader 的作用范围，减少不必要的 loader 解析。一般三方库都是已经处理好的，不需要再次使用 loader 去解析，使用 include 和 exclude 两个配置项，可以实现这个功能：

- include：引入符合以下任何条件的模块。
- exclude：排除所有符合条件的模块，优先级更高。

我们之前编译 ts/tsx 文件时就没有限定模块，我们现在只需要编译自己写的代码即可，由于我们所有的代码都在 src 目录下，所以我们可以写`exclude: /node_modules/` 或者 `include: /src/`。

webpack.config.js

```javascript
module.exports = (env) => {
  return {
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          loader: "babel-loader",
          exclude: /node_modules/
          // include: /src/
          // ...
        }
      ]
    }
  };
};
```

我们来对比一下优化前后的构建时间，优化前的时间为 9762ms，优化后的时间为 7128ms，由于我们目前所使用三方库比较少，实际项目中效果会更加明显。

### 精确使用 loader/plugin

每个额外的 loader/plugin 都有其启动时间。尽量少地使用工具。比如使用 less-loader 来解析 css 文件，由于我们目前没有使用 less，所以我们从 ts/tsx 来下手。按照我们目前的配置，@babel/preset-react 也会处理 ts 文件，由于 ts 文件中不能写 jsx 语法，所以这就像是用 less-loader 解析 css，我们修改一下配置。

webpack.config.js

```javascript
module.exports = (env) => {
  return {
    // ...
    module: {
      rules: [
        {
          test: /\.ts$/i,
          loader: "babel-loader",
          include: /src/,
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: [
              DEVELOPMENT_ENV && require.resolve("react-refresh/babel")
            ].filter(Boolean)
          }
        },
        {
          test: /\.tsx$/i,
          loader: "babel-loader",
          include: /src/,
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ],
            plugins: [
              DEVELOPMENT_ENV && require.resolve("react-refresh/babel")
            ].filter(Boolean)
          }
        }
      ]
    }
  };
};
```

### devtool

不同的 devtool 设置会导致性能差异。对于开发环境，通常希望更快速的 source map，需要添加到 bundle 中以增加体积为代价，但是对于生产环境，则希望更精准的 source map，需要从 bundle 中分离并独立存在。

devtool 的命名规则为 `/^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$/`

- **source map 文件**：当 devtool 设置为 `source-map` 时，webpack 会生成一个 source map 文件，并在打包后的 bundle.js 文件最后添加一行注释，指向 source map 文件。
- **不生成 source map 文件**：`false | none` 这两种方式不会生成 bundle.js.map 文件，也不会在 bundle.js 引入 bundle.js.map 。
- **内联 source-map**：除了直接生成 source map 文件，还可以将 source map 内容直接内联到编译后的 bundle.js 中，有三种方式来配置 devtool。

  - eval：development 模式下的默认值（没有定义 devtool 时），通过 eval 函数来执行文件内容，并在最后增加指向该内容所在的源文件地址。
  - eval-source-map：生成的 source map 以 base64 编码的形式添加到 eval 函数中。
  - inline-source-map：生成的 source map 以 base64 编码放置在打包后文件的最后面。

  因为 source map 会占据较大空间，将 source map 内联到 bundle.js 文件中，会使打包后文件体积变大。

- **报错精确到行**：以上的报错信息都是精确到列的，而精确到行的话，只会告知这一行中有错误。这样编译速度会稍快一点，同时也会生成 source map 文件。
  - cheap-source-map：只精确到行，对于有 loader 的情况，会不够准确。
  - cheap-module-source-map：只精确到行，可以很好的处理有 loader 的情况。
- **不显示源码**：既生成 sourcemap，又不显示源代码。
  - hidden-source-map：与 devtool 定义成 source-map 一样都会生成 source map 文件，只是在打包后文件 bundle.js 中，没有对 source-map 的引用，如果手动加入，也是会生效的。
  - nosources-source-map：会生成 source map，但是生成的 source map 只有错误信息的提示，不会生成源代码文件， 会在控制台告诉错误的内容及文件，但是点击文件名的时候看不到源码。

开发环境推荐：`eval-cheap-module-source-map`，根据我们上面的描述，翻译过来就是不会生成 source map 文件，而是将 source map 以 base64 编码的形式添加到 eval 函数中、只精确到列、存在 loader 时，可准确定位源码。
