const webpack = require('webpack');
const card = require('./webpack.config.card.js');
const edit_card = require('./webpack.config.edit_card.js');
const express = require('express');
const app = express();

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/javascript');
  next();
});

// app.get('*', function(req, res) {
//   res.sendFile(path.join( __dirname, 'index.html'));
// });

module.exports = [
  card,
  edit_card
];
