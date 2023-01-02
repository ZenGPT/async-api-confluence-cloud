const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const { execSync } = require('child_process');
// const descriptor = require('./scripts/descriptor');

process.env.VUE_APP_GIT_HASH = execSync('git rev-parse --short HEAD').toString().trim()
process.env.VUE_APP_GIT_BRANCH = execSync('git branch --show-current').toString().trim()
// https://stackoverflow.com/a/45993185/529187
process.env.VUE_APP_GIT_TAG = execSync('git describe --tags --always --abbrev=0').toString().trim()
console.log(`Building ${process.env.VUE_APP_GIT_TAG} (${process.env.VUE_APP_GIT_HASH}) on ${process.env.VUE_APP_GIT_BRANCH}`)

module.exports = {
  publicPath: '/confluence-plugin',
  pages: {
    "asyncapi-viewer": {
      entry: 'src/asyncapi-viewer.ts',
      template: 'public/asyncapi-viewer.html',
      chunks: ['chunk-common', 'chunk-asyncapi-viewer-vendors', 'asyncapi-viewer']
    },
    "asyncapi-editor": {
      entry: 'src/asyncapi-editor.ts',
      template: 'public/asyncapi-editor.html',
      chunks: ['chunk-common', 'chunk-asyncapi-editor-vendors', 'asyncapi-editor']
    }
  },
  chainWebpack: config => {
    const rule = config.module.rule('js');
    // clear babel-loader
    rule.uses.clear()

    // add esbuild-loader
    rule.use('esbuild-loader').loader('esbuild-loader');

    const ruleTs = config.module.rule('ts');
    // clear babel-loader
    ruleTs.uses.clear()

    // add esbuild-loader
    ruleTs.use('esbuild-loader').loader('esbuild-loader')
      .options( {
          loader: 'ts', // 如果使用了 ts, 或者 vue 的 class 装饰器，则需要加上这个 option 配置， 否则会报错： ERROR: Unexpected "@"
          target: 'es2015',
          tsconfigRaw: require('./tsconfig.json')
        } );

    // 删除底层 terser, 换用 esbuild-minimize-plugin
    config.optimization.minimizers.delete('terser');

    // 使用 esbuild 优化 css 压缩
    config.optimization
      .minimizer('esbuild')
      .use(ESBuildMinifyPlugin, [{ minify: true, css: true }]);

    const options = module.exports
    const pages = options.pages
    const pageKeys = Object.keys(pages)
    const IS_VENDOR = /[\\/]node_modules[\\/]/
    config.optimization
      .splitChunks({
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            priority: -10,
            chunks: 'initial',
            minChunks: 1,
            test: IS_VENDOR,
            reuseExistingChunk: false, //        <<< THIS
            enforce: true,
          },
          ...pageKeys.map((key) => ({
            name: `chunk-${key}-vendors`,
            priority: -1, //                     <<< THIS
            chunks: (chunk) => chunk.name === key,
            minChunks: 1,
            test: IS_VENDOR,
            reuseExistingChunk: false, //        <<< THIS
            enforce: true,
          })),
          common: {
            name: 'chunk-common',
            priority: -20,
            chunks: 'initial',
            minChunks: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      });
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new SpeedMeasureWebpackPlugin(),
    ],
    resolve: {
      fallback: {"stream": false},
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
    proxy: {
      // '/descriptor': {
      //   target: 'http://localhost:8788/',
      //   changeOrigin: true
      // },
      // '/atlassian-connect-lite.json': {
      //   target: 'http://localhost:8788/',
      //   changeOrigin: true
      // },
      // '/installed': {
      //   target: 'http://localhost:8788/',
      //   changeOrigin: true
      // },
      // '/uninstalled': {
      //   target: 'http://localhost:8788/',
      //   changeOrigin: true
      // },
      // '/attachment': {
      //   target: 'http://localhost:8788/',
      //   changeOrigin: true
      // }
    },
    compress: true,  // This reduces the app.js from 4.8MB to 1.2MB
    onBeforeSetupMiddleware: function (devServer) {
      devServer.app.post(/installed/, function (req, res) {
        res.status(200).send(`OK`);
      })
      devServer.app.post(/uninstalled/, function (req, res) {
        res.status(200).send(`OK`);
      })
      // devServer.app.get(/descriptor/, function (req, res) {
      //   res.json(descriptor.onRequestGet(req));
      // })
      devServer.app.get(/attachment/, function (req, res) {
        res.send(`<ac:image> <ri:attachment ri:filename="zenuml-${req.query.uuid}.png" /> </ac:image>`);
      })
    },
    allowedHosts: "all",
  }
};