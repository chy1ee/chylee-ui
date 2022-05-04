module.exports = {
  indexPath: 'doc.html',
  outputDir: '../module-chyee-ui/src/main/resources',
  devServer: {
    port: 3000,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
}