'use strict';

var
    accessToken = '868ea91f13af5f3e18b4c69875a011155a2c82d8',
    app,
    bodyParser = require('body-parser'),
    deviceId = '51ff6f065067545715550287',
    express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    port = process.env.npm_package_config_port || 3000,
    request = require('request'),
    sparkEndpoint = 'https://api.spark.io/v1/devices/';

app = express();


/* middleware */
app.use(logger());
app.use(bodyParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express['static'](path.join(__dirname, '/app')));
app.set('views', path.join(__dirname, '/app/views'));


/* application routes */
app.get('/', function (req, res) {
    res.render('index.html');
});


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
        request.post(sparkEndpoint + deviceId + '/motorSpeed').form({
            access_token: accessToken,
            args: req.params.value
        });

        res.json({func: 'motorSpeed', value: req.params.value});
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


/* logs */
app.get('/log', function (req, res) {
    res.render('logs.html');
});


/* start server */
console.log('node boat listening on port %d, cap\'n', port);
app.listen(port);
