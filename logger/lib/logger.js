/* jshint camelcase: false */

'use strict';

var _sio,
    http = require('http'),
    urlObj = require('url'),
    _latestLogs = [],
    _logSocketNS = '/_logs_',
    historyCount = 10,
    _unhookConsole,
    _captureConsole = false,
    externalLogURL;


function hook_stdout(stdoutcallback, stderrcallback) {
    var old_stdout_write = process.stdout.write,
        old_stderr_write = process.stderr.write;

    process.stdout.write = (function (write) {
        return function (string, encoding, fd) {
            write.apply(process.stdout, arguments);
            stdoutcallback(string, encoding, fd);
        };
    })(process.stdout.write);

    process.stderr.write = (function (write) {
        return function (string, encoding, fd) {
            write.apply(process.stderr, arguments);
            stderrcallback(string, encoding, fd);
        };
    })(process.stderr.write);

    return function () {
        process.stdout.write = old_stdout_write;
        process.stderr.write = old_stderr_write;
    };
}


function internalLog(message, source, level) {
    var date = new Date().toISOString(), // moment.utc().format('MM-DD-YYYY HH:mm:ss');
        output = { date: date, message: message, source: source, level: level },
        replacedURL,
        url,
        options;

    if (_latestLogs.length >= historyCount) {
        _latestLogs.pop();
    }

    _latestLogs.unshift(output);

    _sio.of(_logSocketNS).emit('log_data', output);

    if (externalLogURL) {
        replacedURL = externalLogURL.replace('{message}', message);
        replacedURL = replacedURL.replace('{date}', date);
        replacedURL = replacedURL.replace('{source}', source);
        replacedURL = replacedURL.replace('{level}', level);

        url = urlObj.parse(replacedURL);
        options = {
            host: url.hostname,
            path: url.path
        };

        http.get(options, function () {
           //message sent
        });
    }
}


function consoleStdoutCallback(message) {
    internalLog(message, 'console', 'I');
}


function consoleStderrCallback(message) {
    internalLog(message, 'console', 'E');
}



module.exports = {
    historyCount: historyCount,
    externalLogURL: undefined,
    init: function (sio, captureConsole, historyCount) {
        _sio = sio;
        _sio.set('log level', 1);
        _sio.of(_logSocketNS).emit('log_start');

        historyCount = this.historyCount;

        if (captureConsole) {
            this.enableCaptureConsole(captureConsole);
        }
    },
    log: internalLog,
    add: function (req, resp) {
        var msg = req.query.message,
            source = req.query.source,
            level = req.query.level;

        internalLog(msg, source || 'unknown', level || 'I');

        resp.end('OK');
    },
    view: function (req, resp) {
        resp.render('angularLogView.html', {
            logHistory: _latestLogs,
            requestURL: req.protocol + '://' + req.get('host'),
            logSocketNS: _logSocketNS,
            appName: 'logger'
        });
    },
    clear: function (req, resp) {
        _latestLogs =  [];
        resp.end('OK');
    },
    test: function (req, res) {
        internalLog('Direct log information', 'web', 'I');
        internalLog('Direct log warning', 'web', 'W');
        internalLog('Direct log information', 'web', 'I');
        internalLog('Direct log error', 'web', 'E');
        console.log('Console log');
        console.error('Console error');
        res.end('OK');
    },
    enableCaptureConsole: function (enable) {
        if (enable && !_captureConsole) {
            _unhookConsole = hook_stdout(consoleStdoutCallback, consoleStderrCallback);
            _captureConsole = true;
        }
        else if (_captureConsole) {
            _unhookConsole();
            _captureConsole = false;
        }
    }
};
