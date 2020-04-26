/* eslint-disable @typescript-eslint/no-var-requires */
// vue.config.js
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default

module.exports = {
  configureWebpack: (config) => {
    // js output config
    config.output.filename = 'js/[name].[contenthash:8].js' // 输出JS模块的配置
    config.output.chunkFilename = 'js/[name].[chunkhash:8].js' // 公共JS配置
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: productionGzipExtensions,
            threshold: 2048,
            minRatio: 0.8
          }),
          new WebpackDeepScopeAnalysisPlugin()
        ]
      }
    }
  },
  // 打包不生成sourcemap
  productionSourceMap: false,
  chainWebpack: config => {
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch');
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
    config.optimization.runtimeChunk(true)

    config.optimization.splitChunks({
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0, // 依赖包超过300000bit将被单独打包
      automaticNameDelimiter: '-',
      name: true,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        elementUI: {
          name: 'chunk-elementUI', // split elementUI into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
        },
        commons: {
          name: 'chunk-commons',
          test: /[\\/]src[\\/]/, // can customize your rules
          minChunks: 1, //  minimum common number
          priority: 5,
          reuseExistingChunk: true
          // maxSize: 3000
        }
      }
    })
  }
}
