const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpackConfig = require("./webpack.config");

module.exports = (env) => {
  const smp = new SpeedMeasurePlugin();
  const config = webpackConfig(env);

  // SpeedMeasurePlugin 目前与 MiniCssExtractPlugin 有点不兼容，MiniCssExtractPlugin 需要包装一次再将其放回。
  // 这样操作可以解决 MiniCssExtractPlugin 报错，但是统计不到 MiniCssExtractPlugin 的数据。
  // 我们也不需要 BundleAnalyzerPlugin 的数据，所以也放在下面添加。
  // https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
  const MiniCssExtractPluginIndex = config.plugins.findIndex((item) => {
    return item.constructor.name === "MiniCssExtractPlugin";
  });
  const MiniCssExtractPlugin = config.plugins[MiniCssExtractPluginIndex];

  const smpConfig = smp.wrap(config);
  smpConfig.plugins[MiniCssExtractPluginIndex] = MiniCssExtractPlugin;

  return smpConfig;
};
