const webpackConfig = require("./webpack.config");

module.exports = {
  // 是否停止在父级目录寻找配置文件。
  root: true,
  // 全局变量。
  env: {
    // 浏览器全局变量。
    browser: true,
    // 添加所有 ECMAScript 2024 的全局变量，并自动将解析器选项 ecmaVersion 设置为 15。
    es2024: true
  },
  extends: [
    "airbnb",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  // 将 TypeScript 转换为与 ESTree 格式兼容的解析器，好可以在 ESLint 中使用。
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      webpack: {
        // 这里的 config 就是我们webpack配置文件中的 resolve。
        // 如果你的 webpack.config.js 导出的不是一个函数而是一个对象，
        // 你可以直接写 config: "webpack.config.js"。
        config: webpackConfig("development")
      }
    }
  },
  rules: {
    // todo 配置 prettier 之后删除
    quotes: ["error", "double"],
    "comma-dangle": ["error", "never"],
    "operator-linebreak": "off",
    "spaced-comment": "off",
    "linebreak-style": "off",

    // 允许使用不必要的块语句。
    "arrow-body-style": "off",
    // 允许命名组件和默认导出组件都使用箭头函数
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function", defaultProps: "arrow-function" }
    ],
    // 允许 React 组件的文件扩展名为 tsx。
    "react/jsx-filename-extension": ["error", { extensions: ["tsx"] }]
  },
  // 根据文件扩展名应用不同的规则集。
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      rules: {
        // 不强制要求函数和方法的返回类型必须显式声明。
        "@typescript-eslint/explicit-function-return-type": "off",
        // 允许使用 var require 语法来动态地导入模块。
        "@typescript-eslint/no-var-requires": "off"
      }
    },
    {
      files: ["webpack.speedMeasure.js"],
      rules: {
        "import/no-extraneous-dependencies": "off"
      }
    }
  ]
};
