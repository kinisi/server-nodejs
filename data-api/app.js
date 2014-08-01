var express = require("express");
var config = require("config");
var passport = require("passport");

// local requires
var logger = require("./lib/logger");
var router = require("./lib/router");

function main() {

    require("./routes");

    var app = express();

    app.disable('x-powered-by');

    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(passport.initialize());
    app.use(router.handler);
    app.use(express.static(__dirname + '/static'));

    app.listen(config.port);
    logger.info("Startup:", "Server running on port: " + config.port);

    logger.info("Startup:", "Configuration:", JSON.stringify(config, null, "\t"));
}

main();
