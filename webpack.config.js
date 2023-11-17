const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env) => {
  const { NODE_ENV } = env;

  const DEVELOPMENT_ENV = NODE_ENV === "development";
  const PRODUCTION_ENV = NODE_ENV === "production";

  return {
    mode: NODE_ENV,
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
      clean: true,
      filename: "[name].[contenthash:8].js",
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
            ],
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
      }),
      DEVELOPMENT_ENV && new ReactRefreshWebpackPlugin(),
      PRODUCTION_ENV &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash:8].css"
        }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: path.resolve(__dirname, "bundle-analyze-result.html"),
        openAnalyzer: false
      })
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          /*// 多线程，默认值为true：os.cpus().length - 1。
          parallel: true,
          // 提取注释，默认值为true，这将提取所有注释，将其保存在名为LICENSE.txt的文件中，设置为false则不提取注释。
          extractComments: true,
          terserOptions: {
            compress: {
              // 禁用控制台输出
              drop_console: true
            }
          }*/
        })
      ],
      splitChunks: {
        chunks: "all",
        name: "vendors"
      }
    }
  };
};
