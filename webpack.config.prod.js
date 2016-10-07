const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  devtool: 'cheap-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:9090',
    path.resolve(__dirname, 'app/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[chunkhash:8].bundle.js',
    publicPath: '/'  //静态资源（图片，字体文件）打包后的引用路径，修改为服务端host:port
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel']
      },
      {
        test: /(\.css|\.scss)$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=[hash:8].[name].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }
    ]
  },
  plugins: [
  //定义一些全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    //检查重复代码，减少打包体积
    new webpack.optimize.DedupePlugin(),
    //代码混淆
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    //自动创建html文件
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',//模板
      filename: 'index.html',
      inject: true
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:9090/' })//自动打开浏览器
  ]
};

module.exports = config;
