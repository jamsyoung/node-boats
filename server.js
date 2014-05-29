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
app.get('/api/v1/:func/:value', function (req, res) {

    request.post(sparkEndpoint + deviceId + '/' + req.params.func).form({
        access_token: accessToken,
        args: req.params.value
    });

    res.json({
        func: req.params.func,
        value: req.params.value
    });
});



/* logs */
app.get('/log', function (req, res) {
    res.render('logs.html');
});


/* start server */
console.log('node boat listening on port %d, cap\'n', port);
app.listen(port);
