const webpack = require("webpack");

module.exports = {
  entry : [
    './static/scripts/src/dashboard.js'
  ],
  module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
  },
  resolve: {
        extensions: ['', '.js']
  },
  output: {
        path: './static/scripts/dist',
        filename: 'app.js'
  },
  devtool: "source-map"
}
