var db = require("../db");

module.exports.googleSignIn = function googleSignIn(req, res, next) {
	passport = req._passport.instance;
	
	passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/userinfo.email'}, function(err, user, info) {

	})(req,res,next);

};

module.exports.googleSignInCallback = function googleSignInCallback(req, res, next) {
	passport = req._passport.instance;
	passport.authenticate('google',function(err, user, info) {
		if(err) {
			return next(err);
		}

        // From: http://stackoverflow.com/questions/11355366/nodejs-redirect-url
        db.query("SELECT id, token, oauth_token FROM api_token a JOIN oauth_token o ON a.id = o.user_id WHERE o.oauth_token = ? and o.oauth_service = 'google'", [user.token], function(err, rows, fields) {
            var map = "/static/dashboard.html";
            try {
               map = map + "?userid=" + rows[0].id + "&api_token=" + rows[0].api_token + "&oauth_token=" + rows[0].oauth_token;
            } catch (err) {
               // do nothing
            }
            res.writeHead(301, {
                'Location': (req.socket.encrypted ? 'https://' : 'http://') +
                req.headers.host + map}
            );

            res.end();
        });
	})(req,res,next);
};

module.exports.facebookSignIn = function facebookSignIn(req, res, next) {};
module.exports.facebookSignInCallback = function facebookSignInCallback(req, res, next) {};
module.exports.localSignIn = function localSignIn(req, res, next) {};
module.exports.localSignInCallback = function localSignInCallback(req, res, next) {};
