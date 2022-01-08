module.exports = {
  outputDir: "dist",
  transpileDependencies: [
    "vuetify"
  ],
  devServer: {
    proxy: {
        "^/api": {
            target: "http://localhost:8080/api"
        },
        "^/docs": {
            target: "http://localhost:8080"
        }
    }
  }
}; 