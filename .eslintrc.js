const webpackConfig = require("./webpack.config");

module.exports = {
  // 是否停止在父级目录寻找配置文件。
  root: true,
  // 全局变量。
  env: {
    // 浏览器全局变量。
    browser: true,
    // 添加所有 ECMAScript 2024 的全局变量，并自动将解析器选项 ecmaVersion 设置为 15。
    es2024: true,
  },
  extends: [
    "airbnb",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  // 将 TypeScript 转换为与 ESTree 格式兼容的解析器，好可以在 ESLint 中使用。
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      webpack: {
        // 这里的 config 就是我们 webpack 配置文件中的 resolve。
        // 如果你的 webpack.config.js 导出的不是一个函数而是一个对象，
        // 你可以直接写 config: "webpack.config.js"。
        config: webpackConfig("development"),
      },
    },
  },
  ignorePatterns: ["react-app-env.d.ts"],
  rules: {
    // 允许以下文件类型在引入的时候不加扩展名。
    "import/extensions": [
      "error",
      "ignorePackages",
      { js: "never", jsx: "never", ts: "never", tsx: "never" },
    ],
    "no-shadow": "off",
    "no-use-before-define": "off",
    // 指定命名函数组件的定义风格为箭头函数。
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],
    // 允许包含 JSX 的文件扩展名。
    "react/jsx-filename-extension": ["error", { extensions: ["tsx"] }],
    "react/jsx-props-no-spreading": "off",
    // 使用 JSX 时允许缺少 React。
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off",
    // 使用未使用的变量进行警告。
    "@typescript-eslint/no-unused-vars": "warn",
  },
  // 根据文件扩展名应用不同的规则集。
  overrides: [
    {
      files: ["*.js"],
      rules: {
        // 允许调用 require()。
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};
