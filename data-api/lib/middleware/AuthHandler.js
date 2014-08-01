var db = require("../db");
var logger = require("../logger");

module.exports.googleSignIn = function googleSignIn(req, res, next) {
	passport = req._passport.instance;
	
	passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/userinfo.email'}, function(err, user, info) {

	})(req,res,next);

};

module.exports.googleSignInCallback = function googleSignInCallback(req, res, next) {
        logger.log("google callback 1")
	passport = req._passport.instance;
	passport.authenticate('google',function(err, user, info) {
		if(err) {
			return next(err);
		}

        logger.log("google callback 2")
        var body = "<pre>" + JSON.stringify(user,null,"\t") + "\n" + JSON.stringify(info,null,"\t") + "</pre>";

        db.query("SELECT id, oauth_token FROM api_token a JOIN oauth_token o ON a.id = o.user_id WHERE o.oauth_token = ? and o.oauth_service = 'google'", [user.token], function(err, rows, fields) { 
        
        body += "<div><a href=\"/user/" + rows[0].id + "?token=" + rows[0].oauth_token + "\">This is your user record</a></div>";
        body += "<div><a href=\"/static/testmap-osm.html?userid=" + rows[0].id + "&token=" + rows[0].oauth_token + "\">This is your map</a></div>";

        res.writeHead(200, { "Content-Type": "text/html", "Content-Length": body.length });
        res.end(body);
        });
	})(req,res,next);
        logger.log("google callback 3")
};

module.exports.facebookSignIn = function facebookSignIn(req, res, next) {};
module.exports.facebookSignInCallback = function facebookSignInCallback(req, res, next) {};
module.exports.localSignIn = function localSignIn(req, res, next) {};
module.exports.localSignInCallback = function localSignInCallback(req, res, next) {};
