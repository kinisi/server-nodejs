var router = require("../lib/router");
var rutil = require("../lib/router_util");
var auth = require("../lib/middleware/auth");
var tablequery = require("../lib/middleware/tablequery");

router.add("GET", /\/table\//, auth, tablequery, rutil.writeCORSHeaders, rutil.writeJSONPBody);
