const path = require('path')

module.exports = {
  // 基础路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // HTML配置
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '物流设备管理平台'
      args[0].minify = {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      }
      return args
    })
  },

  // 输出配置
  outputDir: 'dist',
  assetsDir: 'static',

  // 开发服务配置
  devServer: {
    open: true,
    hot: true,
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
    },
    proxy: {
      '/api/*': {
        target: 'http://192.168.10.127:8089',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '/': '/',
        },
        logLevel: 'debug',
      },
    },
  },

  // 模块解析配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        assets: path.resolve(__dirname, 'src/assets'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  },

  // 生产优化
  productionSourceMap: false,

  // CSS处理配置
  css: {
    extract: process.env.NODE_ENV === 'production',
    sourceMap: false,
  },
}
