var router = require("../lib/router");
var auth = require("../lib/middleware/auth");
var download = require("../lib/middleware/download");

router.add("GET", /\/download\//, auth, download);
