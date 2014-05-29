'use strict';

var
    http = require('http'),
    bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    ejs = require('ejs'),
    logger = require('./logger/lib/logger'),
    path = require('path'),
    request = require('request'),
    boat = require('./app.js'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || process.env.npm_config_port || process.env.npm_package_config_port || 3000;

/* middleware */
app.use(bodyParser());
app.use(express['static'](__dirname + '/app'));
app.use(express['static'](__dirname + '/logger/public'));

app.set('view engine', 'ejs');
app.set('views', path.normalize(__dirname + '/logger/views'));
app.engine('html', require('ejs').__express);

/* logger */
logger.init(io, true, 100);

/* application routes */
app.get(/^\/(index.html)?$/i, function (request, response) {
    response.sendfile('./app/views/index.html');
});

/* logging */
app.get('/log', logger.view);
app.get('/log/add', logger.add);
app.get('/log/logmessage', logger.add);
app.get('/log/clear', logger.clear);
app.get('/log/test', logger.test);

/* start server */
console.log('node boat listening on port %d, cap\'n', port);
app.listen(port);
