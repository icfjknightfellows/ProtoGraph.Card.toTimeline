const webpack = require('webpack');

module.exports = {
  entry: ['./main.js','./main_edit.js'],
  output: {
    path: './',
    filename: './dist/0.0.1/edit-card.min.js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    '../../lib/js/react-jsonschema-form.js': 'JSONSchemaForm',
    'axios': 'axios'
  },
  node: {
    net: 'empty',
    tls: 'empty',
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query:
        {
          presets:['react']
        }
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
