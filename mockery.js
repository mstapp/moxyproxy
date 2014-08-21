var config = require('./config'),
    fs = require('fs');

// Returns true if there is mock data for the given request verb + path
exports.isMocked = function(req) {
    return fs.existsSync( mockedFilePath(req.method, req.path) );
};

// Handle the current request by returning mock data.
// Should only call this function if isMocked returns true for the same request.
// Returns 200 + the mocked data if found, or 404 if no mocked data found.
exports.mock = function(req, res) {
    var fname = mockedFilePath(req.method, req.path);
    console.log('Mocking ' + fname);
    fs.readFile(fname, function(err, data) {
        if (err) {
            console.log("Can't read file " + fname);
            send404(res);
            return;
        }

        var data = JSON.parse(data);
        // allow special key to indicate desired return code,
        // with the "data" property holding the return data.
        if (data['__status__']) {
            res.statusCode = data['__status__'];
            data = data.data;
        }
        res.send( data );
    });
};

// Return path of mocked file, if any, for the given HTTP verb + URL path.
// This function strips off the base path of any proxied URL paths,
// like /api/v1/ in these examples.
// Examples:
//      GET  /api/v1/foo/bar/1: foo-bar-1.json
//      POST /api/v1/foo/bar/1: post-foo-bar-1.json
function mockedFilePath(verb, path) {
    path = stripPath(path);
    var segs = path.split('/');
    if (verb !== 'GET') segs.unshift(verb.toLowerCase());
    path = segs.join('-') + '.json'
    return [config.mockFilesRoot, path].join('/');
}

// Strip off the proxied URL path, if any.
// Always returns path WITHOUT leading slash.
function stripPath(path) {
    for (var i = 0; i < config.proxyUrlPaths.length; i++) {
        if (path.indexOf(config.proxyUrlPaths[i]) === 0)
            return path.substr(config.proxyUrlPaths[i].length);
    }
    if (path.indexOf('/') === 0) return path.substr(1);
    return path;
}

var send404 = function(res) {
    res.statusCode = 404;
    res.end();
};
