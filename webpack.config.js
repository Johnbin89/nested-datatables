var webpack = require('webpack');
var path = require('path');
const webpackMerge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
let UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
console.log("target event is " + TARGET);

var outputFileName = "nested.tables";
outputFileName += (TARGET == 'prod' ? ".min.js" : ".js");

const common = {
  entry: {
    main: ['@babel/polyfill', './index.js'],
  }, 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFileName,
    library: 'nestedTables',
    libraryTarget:'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader?presets[]=es2015'
        }
      },
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(eot|ttf|svg|gif|png)$/,
        loader: "url-loader"
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
  ]
};

if (TARGET === 'build' || !TARGET) {
  module.exports = webpackMerge(common, {
    devtool: 'source-map',
    watchOptions: {
      poll: true,
    },
  });
}

if (TARGET === 'prod' || !TARGET) {


  module.exports = {
    entry: {
      'nested.tables': './index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].min.js',
      library: 'nestedTables',
      libraryTarget:'umd',
      umdNamedDefine: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(eot|ttf|svg|gif|png)$/,
          loader: "url-loader"
        }
      ]
    },
    plugins: [
      new UnminifiedWebpackPlugin()
    ]
  };
}
