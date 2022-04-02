// Create React App Configuration Override is an easy and comprehensible configuration layer for create-react-app.
//
// Get all the benefits of create-react-app and customization without using 'eject' by adding a single configuration
// (e.g. craco.config.js) file at the root of your application and customize your eslint, babel, postcss configurations
// and many more.
module.exports = {
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    public: 'air.zenuml.com',
    host: 'localhost',
    port: 8080,
    sockHost: 'air.zenuml.com',
    sockPort: 443,
    proxy: {
      '/atlassian-connect.json': {
        target: 'http://localhost:5000/',
        changeOrigin: false
      },
      '/installed': {
        target: 'http://localhost:5000/',
        changeOrigin: false
      },
    },
    compress: true,  // This reduces the app.js from 4.8MB to 1.2MB
    before: function (app) {
      app.get(/installed/, function (req, res) {
        res.status(200).send(`OK`);
      })
      app.get(/uninstalled/, function (req, res) {
        res.status(200).send(`OK`);
      })
    },
    allowedHosts: [
      '.zenuml.com'
    ]
  },

  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  }
}