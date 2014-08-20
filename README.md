# moxyproxy

Moxyproxy a node.js proxy server for Web UI developers:

* Serve Web UI resources from local development directories.
* Proxy REST API calls to a remote server.
* Selectively mock those REST API calls to return canned JSON data, for ease of debugging or test automation.

## Installation

Install [node.js](http://nodejs.org/), clone this repository, then run `npm install`.

Next, copy `config-EXAMPLE.js` to `config.js` and it for your own settings. (__See below for details.__)

## Run

   npm start

Then browse to `http://localhost:3000/` (or whatever port you're configured for).


## Configuration details

(more)

## License

MIT License. See [LICENSE.txt](LICENSE.txt) for details.