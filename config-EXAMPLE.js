module.exports = {
    enableMocking: false, // set to true to enable mocking (DANGER!)

    port: 3000,

    proxyTarget: 'http://localhost:3001',
    // URL paths to send to proxy target
    proxyUrlPaths: [
        '/api/v1/',
        '/admin/api/v1/',
    ],

    // local file system paths to look for static files in
    staticPaths: [
        '../client/dist',
        '../admin/dist',
    ],

    mockFilesRoot: 'json',
};
