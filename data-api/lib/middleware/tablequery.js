var path = require("path");
var db = require("../db");
var queryparser = require("../queryparser");
var rutil = require("../router_util");
var config = require("config");

var whitelist = config.tablequery.whitelist;

var defaults = {
    "limit": 1000,
    "offset": 0
};

module.exports = function tableQuery(req, res, next) {
    var ctx = this;
    var tablename = path.basename(ctx.url.pathname);
    var limit = parseInt(ctx.url.query.limit, 10) || defaults.limit; 
    limit = isNaN(limit) ? defaults.limit : limit;
    var offset = parseInt(ctx.url.query.offset) || defaults.offset; 
    offset = isNaN(offset) ? defaults.offset : offset;

    if(whitelist.indexOf(tablename) > -1) {
        var sql = queryparser.template("select {{select}} from " + tablename + 
                  " {{where}} {{order by}} limit " + limit + " offset " + offset, ctx.url.query);
        db.query(sql, function(err, results) {
            // save results for the next handler:
            ctx.body = JSON.stringify(results);
            next(err);
        });
    } else {
        rutil.handleNotFound.call(ctx, req, res, next);
    }
}
