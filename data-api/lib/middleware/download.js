var path = require("path");
var db = require("../db");
var queryparser = require("../queryparser");
var rutil = require("../router_util");
var config = require("config");
var logger = require("../logger");

var whitelist = config.tablequery.whitelist;

var defaults = {
    "limit": 1000,
    "offset": 0
};

module.exports = function tableQuery(req, res, next) {
    var ctx = this;

    logger.log(ctx);

    // When we get here, authentication has already happened

    command = ctx.url.pathname.split(path.sep);

    logger.log(command)

    if ((command.length != 3) || (command[2] != 'rpi-image')) {

       rutil.handleNotFound.call(ctx, req, res, next);

    } else {

		 db.query('SELECT email FROM api_token WHERE id = ?', ctx.url.query.userid, function(err, rows, fields) {
			 logger.log(rows);
			 if ( (rows.length == 1) && ('email' in rows[0]) ) {

				 var email = rows[0].email;
				 var file = config.download.basepath + '/images/kinisi-rpi-userid-' + ctx.url.query.userid + '.img.gz';
				 var visiblefilename = 'kinisi-rpi-' + email + '.img.gz'
				 logger.log(file, visiblefilename);
				 res.download(file, visiblefilename, function (err) {

				    if (err) {
				       rutil.handleNotFound.call(ctx, req, res, next);
                }

             });

			 } else {
				 logger.log('not found');
				 rutil.handleNotFound.call(ctx, req, res, next);
			 }
		 });

    }

}
