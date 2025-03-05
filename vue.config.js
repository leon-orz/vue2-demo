const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://192.168.10.14:8089/',
        changeOrigin: true,
        pathRewrite: {
          '/': '/',
        },
      },
    },
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '物流设备管理平台'
      return args
    })
  },
})
