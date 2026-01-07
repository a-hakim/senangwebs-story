const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      sws: './src/js/sws.js',
      styles: './src/css/sws.css'
    },
    output: {
      // Output sws.min.js in production, sws.js in development
      filename: isProduction ? '[name].min.js' : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'SWS',
        type: 'umd',
        export: 'default'
      },
      globalObject: 'this',
      clean: false // Don't clean to keep both dev and prod builds
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'sws.css'
      })
    ]
  };
};