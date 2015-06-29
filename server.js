// Dependencias
var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Setup App
var app = module.exports = express();
var port = process.env.PORT || 8000;

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());

// Rutas
var planetas = require('./routes/planetas');
app.use('/planetas', planetas);

mongoose.connect('mongodb://localhost/planetasDB', function() {
  app.listen(port, function () {
    console.log('Escuchando en el puerto ' + port + '...');
  });
});