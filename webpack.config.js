const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
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
            "@babel/preset-typescript"
          ]
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|svg|bpm)$/i,
        type: 'asset'
      },
    ],
  },
  resolve: {
    // webpack 会尝试按顺序解析，所以应该尽可能减少匹配次数，以提高性能。
    extensions: [".js", ".ts", ".tsx", ".jsx"]
  },
  devtool: "source-map"
};
