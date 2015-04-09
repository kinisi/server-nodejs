var fs = require("fs");
var path = require("path");
var config = require("config");
var router = require("../lib/router");
var rutil = require("../lib/router_util");

var urlPrefix = /^\/static\//;
router.add("GET", urlPrefix, rutil.writeCORSHeaders, staticHandler);

function staticHandler(req, res, next) { 
    var ctx = this;
    var filepath = path.join(config.static.basepath, ctx.url.pathname.replace(urlPrefix, ""));

    fs.exists(filepath, function(exists) {
        if(!exists) {
             rutil.handleNotFound.call(ctx, req, res);
         } else if (fs.statSync(filepath).isDirectory()) {
             handleDirectoryRedirect(req, res);
         } else {
             handleStatic.call(ctx, req, res);
         }
    });
}

function handleDirectoryRedirect(req, res) {
    res.writeHead(301, {
        "Location": req.url + config.static.defaultIndexPath
    }); 
    res.end();
}

function handleStatic(req, res) {
	var ctx = this;
    var filepath = path.join(config.static.basepath, ctx.url.pathname.replace(urlPrefix, ""));
	var mimeType = findMIME(path.extname(ctx.url.pathname).slice(1));
	var s = fs.createReadStream(filepath);
	s.on("error", function() { res.writeHead(500); res.end(); });
	s.once("open", function() { res.writeHead(200, { "Content-Type": mimeType }); });
	s.pipe(res);
}

function findMIME(extension) {
    var mimes = {
        "js": "application/javascript",
        "html": "text/html",
        "php": "text/html",
        "txt": "text/plain",
        "css": "text/css",
        "flv": "video/x-flv",
        "xml": "application/xml",
        "xsl": "application/xslt+xml",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "gif": "image/gif",
        "png": "image/png"
    };
  
    var mime = (extension && mimes[extension]) || "application/octet-stream;charset=UTF-8";
	return mime;
}

