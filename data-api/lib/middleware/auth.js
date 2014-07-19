var path = require("path");
var db = require("../db");
var queryparser = require("../queryparser");
var rutil = require("../router_util");
var logger = require("../logger");

var AUTH_HEADER = "X-Api-Token";
var AUTH_QS = "api_token";

module.exports = function authApi(req, res, next) {
    var ctx = this;
    var clientAddr = req.connection.remoteAddress;
    var remoteAddr = req.headers["remote_addr"] || req.headers["x-forwarded-for"] || clientAddr;
    var auth_token = req.headers[AUTH_HEADER] || (req.method == "GET" ? ctx.url.query[AUTH_QS] : null);

    if(auth_token) {
        db.query("select * from api_token where token = ?", [auth_token], function(err, results) {
            if(results.length == 1 && results[0].status) {
                next();
            } else {
                logger.warn("Rejected API token", auth_token, "from source IP", remoteAddr, "via", clientAddr);
                rutil.handleUnauthorized.call(ctx, req, res, next);
            }
        });
    } else {
        rutil.handleUnauthorized.call(ctx, req, res, next);
    }
}
