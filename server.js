'use strict';

var
    app,
    http = require('http'),
    bodyParser = require('body-parser'),
    express = require('express'),
    ejs = require('ejs'),
    logger = require('morgan'),
    path = require('path'),
    request = require('request'),
    boat = require('./app.js'),
    port = process.env.PORT || process.env.npm_config_port || process.env.npm_package_config_port || 3000;

app = express();

/* middleware */
app.use(logger());
app.use(bodyParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express['static'](path.join(__dirname, '/app')));
app.set('views', path.join(__dirname, '/app/views'));

/* application routes */

/* main page */
app.get('/', function (req, res) {
    res.render('index.html');
});

/* logs */
app.get('/log', function (req, res) {
    res.render('logs.html');
});

/* start server */
console.log('node boat listening on port %d, cap\'n', port);
app.listen(port);
