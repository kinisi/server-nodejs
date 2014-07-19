var mysql = require("mysql");
var config = require("config");
var logger = require("./logger");

var pool = mysql.createPool(config.mysql.conn);

module.exports.query = function query(q, p, cb) {

    // handle no-params case
    if(p instanceof Function) {
        cb = p;
        p = [];
    }

    pool.query(mysql.format(q, p), function(err, rows, fields) {
        if(err) {
            logger.error("error running query", err);
            return cb(err);
        }
        
        // callback with unwrapped array
        cb(null, rows);
    });
}
