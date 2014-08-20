var express = require('express'),
    config = require('./config'),
    _ = require('underscore'),
    fs = require('fs'),
    domain = require('domain').create(),
    httpProxy = require('http-proxy'),
    mockery = require('./mockery');

var app = express();

// trap any errors on this domain, sync or async
domain.on('error', function(err){
    console.log(err);
});


// statics
_.each(config.staticPaths, function(path){
    app.use(express.static(path));
});

// proxy paths & mocks
//
var proxy = httpProxy.createProxyServer();
_.each(config.proxyUrlPaths, function(basePath) {
    _.each('get,post,put,delete'.split(','), function(verb){
        app[verb](basePath + '*', function(req, res){
            // run in a domain to safely handle sync or async errors
            domain.run(function() {
                if (config.enableMocking && mockery.isMocked(req)) {
                    mockery.mock(req, res);
                }
                else {
                    proxy.web(req, res, { target: config.proxyTarget });
                }
            });
        });
    });
});

// start
app.listen(config.port);
console.log('moxyproxy listening on http://localhost:' + config.port);
console.log('(proxying ' + config.proxyTarget + ')');
console.log( (config.enableMocking) ? 'Mocking is ENABLED' : 'Mocking is off');
