var rutil = require("./router_util");
var url = require("url");

// default routes
var routes = {
    "GET": [
        [ /^\/crossdomain\.xml$/, rutil.writeCORSHeaders, rutil.handleCrossDomain ]
    ]
};

module.exports.add = function add(method, pattern) {
    var handlers = Array.prototype.slice.call(arguments, 2);
    if(!routes[method.toUpperCase()]) { 
        routes[method.toUpperCase()] = []; 
    }
    routes[method.toUpperCase()].push([pattern].concat(handlers));
};

module.exports.handler = function handler(req, res) {
    var method = req.method.toUpperCase();
    var urlobj = url.parse(req.url, true);
    var path = urlobj.pathname;

    try {
        if(routes[method]) {
            if(routes[method].every(function(r) {
                if(r[0].test(path)) {
                    callHandlers(req, res, r, urlobj);
                    return false; // short-circuit, and fail if statement
                }
                return true; // try next route
            })) {
                rutil.handleNotFound(req, res);
            }
        } else {
            rutil.handleUnsupported(req, res);
        }
    } catch (err) {
        rutil.handleException(req, res, err);
    }
};

function callHandlers(req, res, route, urlobj) {
    var handler = 1;
    var context = {
        "url": urlobj,
        "body": ""
    };

    var next = function(err) {
        try {
            if(err || !(route[handler] instanceof Function)) {
                rutil.handleException(req, res, err);
            } else {
                route[handler++].call(context, req, res, next);
            }
        } catch(ex) {
            logger.trace(ex);
            rutil.handleException(req, res, err);
        }
    };
    next();
}
