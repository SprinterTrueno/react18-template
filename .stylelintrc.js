module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  overrides: [
    { files: "**/*.less", customSyntax: "postcss-less" },
    {
      files: "**/*.ts",
      // 这两个二选一就行了，官方示例使用的是 postcss-styled-syntax。
      customSyntax: "postcss-styled-syntax"
      // customSyntax: "postcss-styled-components"
    }
  ],
  rules: {
    // 这些是v14版本的规则，现在已经弃用了，随后更新一下。
    // "max-empty-lines": 1,
    // "no-empty-first-line": true,
    // "no-eol-whitespace": [true, { ignore: ["empty-lines"] }],
    // "no-missing-end-of-source-newline": true
  }
};
