const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = (env) => {
  const { NODE_ENV } = env;

  return {
    mode: NODE_ENV,
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
      clean: true,
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist")
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
            // plugins: ["react-refresh/babel"],
          }
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(jpe?g|png|gif|svg|bpm)$/i,
          type: "asset"
        }
      ]
    },
    resolve: {
      // webpack 会尝试按顺序解析，所以应该尽可能减少匹配次数，以提高性能。
      extensions: [".js", ".ts", ".tsx", ".jsx"],
      alias: { "@": path.resolve(__dirname, "src") }
    },
    devtool: "source-map",
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html"
      })
      // new ReactRefreshWebpackPlugin()
    ]
  };
};
