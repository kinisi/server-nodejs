var http = require("http");
var config = require("config");

// local requires
var logger = require("./lib/logger");
var router = require("./lib/router");

function main() {

    // setup routes
    require("./routes");

    // start the http server
    http.createServer(router.handler).listen(config.port, function() {
        logger.info("Startup:", "Server running on port: " + config.port);
    }).on("error", function(err) {
        logger.error(err);
    });

    logger.info("Startup:", "Configuration:", JSON.stringify(config, null, "\t"));
}

main();
