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

/*
 * This should be a dependent library
 */
function postToSparkApi(endpoint, args, res) {
    console.log('POST request to: %s with args: %s', endpoint, args);

    request.post({ timeout: 1000 * 2, url: endpoint }, function (error, response, body) {
        if (error) {
            console.error('error: %j', error);
            res.json(error);
        }

        console.log('response from %s: %s', endpoint, body);

        res.json({
            endpoint: endpoint,
            value: args,
            response: JSON.parse(body)
        });
    }).form({
        access_token: accessToken,
        args: args
    });
}



/* middleware */
app.use(logger());
app.use(bodyParser());
app.use(express['static'](__dirname + '/app'));
app.use(express['static'](__dirname + '/logger/public'));

app.set('view engine', 'ejs');
app.set('views', path.normalize(__dirname + '/logger/views'));
app.engine('html', require('ejs').__express);



/* application routes */
app.get(/^\/(index.html)?$/i, function (request, response) {
    response.sendfile('./app/views/index.html');
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
    var sparkRequestUri = sparkEndpoint + deviceId + '/motorSpeed';

    if (req.params.value <= 255 && req.params.value >= -255) {
        postToSparkApi(sparkRequestUri, req.params.value, res);
    } else {
        console.error('value must be between -255 and 255');

        res.json({
            error: 'value must be between -255 and 255'
        });
    }
});

app.get('/api/v1/angle/:value', function (req, res) {
    var sparkRequestUri = sparkEndpoint + deviceId + '/angle';

    if (req.params.value <= 175 && req.params.value >= 0) {
        postToSparkApi(sparkRequestUri, req.params.value, res);
    } else {
        console.error('value must be between 0 and 175');

        res.json({
            error: 'value must be between 0 and 175'
        });
    }
});


/* start server */
console.log('node boat listening on port %d, cap\'n', port);
app.listen(port);
