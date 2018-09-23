// https://cli.vuejs.org/config/#vue-config-js
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  lintOnSave: false,
  devServer: {
    port: 3000
  },

  configureWebpack: {
    plugins: [
      new WorkboxPlugin.InjectManifest({
        swSrc: "public/stresscan-sw.js",
        exclude: ["img/icons"]
      })
    ]
  }
};
