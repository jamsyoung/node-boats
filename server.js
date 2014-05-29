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
    port = process.env.PORT || process.env.npm_config_port || process.env.npm_package_config_port || 3000;

app = express();

/* middleware */
app.use(logger());
app.use(bodyParser());

/* application routes */

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/log', function (req, res) {
    res.render('logs.html');
});

/* start server */
console.log('node boat listening on port %d, cap\'n', port);
app.listen(port);
