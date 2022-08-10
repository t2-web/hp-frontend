const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
      analyzerMode: 'disabled',
    },
  },
  // pwa: {
  //   workboxOptions: {
  //     skipWaiting: true,
  //     clientsClaim: true
  //     // exclude: [/.htaccess/]
  //   }
  // },
  chainWebpack: config => {
    const imgRule = config.module.rule('images');
    imgRule
      .use('file-loader')
      .loader('image-webpack-loader')
      .tap(options => {
        const ret = options || {};
        ret.pngquant = {
          quality: [0.65, 0.9],
          speed: 4,
        };
        ret.webp = {
          quality: 75,
        };
        console.log(isProd, 'isProd');
        ret.disable = !isProd;
        return ret;
      });
  },
  configureWebpack: {
    plugins: [
      new Dotenv({
        safe: false,
        systemvars: true,
        silent: false,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
    devServer: {
      watchOptions: {
        ignored: /node_modules/,
        poll: false,
      },
      // disableHostCheck: true,
      // https: false,
      // port: 3001
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
      minimizer: isProd
        ? [
            new UglifyJsPlugin({
              uglifyOptions: {
                compress: {
                  drop_console: isProd,
                },
              },
            }),
          ]
        : [],
    },
  },
};
