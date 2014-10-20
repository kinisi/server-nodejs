var logger = require("./logger");

module.exports.handleNotFound = function handleNotFound(req, res) {
    res.writeHead(404, "Not Found");
    res.end();
    logger.warn("Not found: " + req.url);
};

module.exports.handleUnsupported = function handleUnsupported(req, res) {
    res.writeHead(405, "Method is not allowed");
    res.end();
};

module.exports.handleUnauthorized = function handleUnauthorized(req, res) {
    res.writeHead(401, "Unauthorized");
    res.end();
};

module.exports.handleException = function handleException(req, res, err) {
    res.writeHead(500, "Server Error");
    res.end();
    if(err && err.trace instanceof Function) { 
        logger.trace(err, req.url, req.headers);
    }
};

module.exports.handleCrossDomain = function handleCrossDomain(req, res) {
    var str = '<?xml version="1.0" ?><cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>';
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/xml");
    res.setHeader("Content-Length", str.length);
    res.end(str);
};

// This should probably be in middleware:
module.exports.writeCORSHeaders = function writeCorsHeaders(req, res, next) {
    // if origin is specified, add credential allowance:
    if (req.headers.origin && req.headers.origin !== "*") {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
    }

    next();
};

module.exports.writeJSONPBody = function writeJSONPBody(req, res, next) {
    var body = this.body;
    if(this.url.query.jsonp) {
        body = this.url.query.jsonp + "(" + body + ")";
    }
    res.setHeader("Content-Length", Buffer.byteLength(body));
    res.end(body);
};
