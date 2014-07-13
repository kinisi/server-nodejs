var mysql = require("mysql");
var logger = console;

var pool = mysql.createPool({
  "host": "ai1dev2",
  "user": "kuser0",
  "password": "9aad1067f476ba",
  "database": "kdev1",
  "dateStrings": true
  });

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

