'use strict';

var
    bodyParser = require('body-parser'),
    deviceId = '51ff6f065067545715550287',
    express = require('express'),
    app = express(),
    ejs = require('ejs'),
    logger = require('./logger/lib/logger'),
    path = require('path'),
    port = process.env.npm_package_config_port || 3000,
    request = require('request'),
    sparkEndpoint = 'https://api.spark.io/v1/devices/',
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    accessToken = '868ea91f13af5f3e18b4c69875a011155a2c82d8';


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


/* api routes */
app.get('/api/v1/test/:func/:value', function (req, res) {
    request.post(sparkEndpoint + deviceId + '/' + req.params.func).form({
        access_token: accessToken,
        args: req.params.value
    });

    res.json({func: req.params.func, value: req.params.value});
});

app.get('/api/v1/motorspeed/:value', function (req, res) {
    if (req.params.value <= 255 && req.params.value >= -255) {
        request.post(sparkEndpoint + deviceId + '/motorSpeed', function (error, response, body) {
            res.json({func: 'motorSpeed', value: req.params.value, response: body});
            console.log(body);
        }).form({
            access_token: accessToken,
            args: req.params.value
        });

//        res.json({func: 'motorSpeed', value: req.params.value});
    } else {
        res.json({error: 'value must be between -255 and 255'});
    }
});

app.get('/api/v1/angle/:value', function (req, res) {
    if (req.params.value <= 175 && req.params.value >= 0) {
        request.post(sparkEndpoint + deviceId + '/angle').form({
            access_token: accessToken,
            args: req.params.value
        });

        res.json({func: 'angle', value: req.params.value});
    } else {
        res.json({error: 'value must be between 0 and 175'});
    }
});

/* start server */
console.log('node boat listening on port %d, cap\'n', port);
app.listen(port);
