var path = require("path");
var db = require("../db");
var queryparser = require("../queryparser");
var rutil = require("../router_util");
var logger = require("../logger");

var AUTH_HEADER = "X-Api-Token";
var AUTH_QS = "api_token";
var AUTH_OAUTH = "oauth_token";
var AUTH_OAUTH_USERID = "userid";

module.exports = function authApi(req, res, next) {
    var ctx = this;
    var clientAddr = req.connection.remoteAddress;
    var remoteAddr = req.headers["remote_addr"] || req.headers["x-forwarded-for"] || clientAddr;
    var auth_token = req.headers[AUTH_HEADER] || (req.method == "GET" ? ctx.url.query[AUTH_QS] : null);
    var oauth_token = (req.method == "GET" ? ctx.url.query[AUTH_OAUTH] : null);
    var userid = (req.method == "GET" ? ctx.url.query[AUTH_OAUTH_USERID] : null);

    if(oauth_token && userid) {
        //db.query("SELECT a.* FROM api_token a JOIN oauth_token o on a.id = o.user_id WHERE oauth_token = ?", [req.params.token], function(err, rows, fields) {
        //  res.end(JSON.stringify(rows));
        //});
        db.query("SELECT a.* FROM api_token a JOIN oauth_token o on a.id = o.user_id WHERE oauth_token = ? and a.id = ?", [oauth_token, userid], function(err, results, fields) {
            //res.end(JSON.stringify(rows));
            if(results.length == 1 && results[0].status) {
                next();
            } else {
                logger.warn("Rejected OAUTH token", oauth_token, "and userid", userid, "from source IP", remoteAddr, "via", clientAddr);
                rutil.handleUnauthorized.call(ctx, req, res, next);
            }
        });
    } else if(auth_token) {
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
