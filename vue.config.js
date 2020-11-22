module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pwa: {
    themeColor: '#000000',
    backgroundColor: '#000000',
  },
  chainWebpack: config => {
    config.performance
      .maxEntrypointSize(400000)
      .maxAssetSize(400000)
  }
}