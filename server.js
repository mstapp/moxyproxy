var express = require('express'),
    config = require('./config'),
    _ = require('underscore'),
    fs = require('fs'),
    httpProxy = require('http-proxy'),
    mockery = require('./mockery');

var app = express();

// statics
_.each(config.staticPaths, function(path){
    app.use(express.static(path));
});

// proxy paths & mocks
var proxy = httpProxy.createProxyServer();
_.each(config.proxyUrlPaths, function(basePath) {
    _.each('get,post,put,delete'.split(','), function(verb){
        app[verb](basePath + '*', function(req, res){
            try {
                if (config.enableMocking && mockery.isMocked(req)) {
                    mockery.mock(req, res);
                }
                else {
                    proxy.web(req, res, { target: config.proxyTarget });
                }
            }
            catch (err) {
                console.log('Error during proxy call: ' + err);
            }
        });
    });
});

// start
app.listen(config.port);
console.log('moxyproxy listening on http://localhost:' + config.port);
console.log('(proxying ' + config.proxyTarget + ')');
console.log( (config.enableMocking) ? 'Mocking is ENABLED' : 'Mocking is off');
