var db = require("../models/db");

var AuthHandler = function() {
	this.googleSignIn = googleSignIn;
	this.googleSignInCallback = googleSignInCallback;
	this.facebookSignIn = facebookSignIn;
	this.facebookSignInCallback = facebookSignInCallback
	this.localSignIn = localSignIn
	this.localSignInCallback = localSignInCallback
}

function googleSignIn(req, res, next) {
	passport = req._passport.instance;
	
	passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/userinfo.email'}, function(err, user, info) {

	})(req,res,next);

};

function googleSignInCallback(req, res, next) {
	passport = req._passport.instance;
	passport.authenticate('google',function(err, user, info) {
		if(err) {
			return next(err);
		}

        var body = "<pre>" + JSON.stringify(user,null,"\t") + "\n" + JSON.stringify(info,null,"\t") + "</pre>";

        db.query("SELECT id, oauth_token FROM api_token a JOIN oauth_token o ON a.id = o.user_id WHERE o.oauth_token = ? and o.oauth_service = 'google'", [user.token], function(err, rows, fields) { 
        
        body += "<div><a href=\"/user/" + rows[0].id + "?token=" + rows[0].oauth_token + "\">This is your user record</a></div>";

        res.writeHead(200, { "Content-Type": "text/html", "Content-Length": body.length });
        res.end(body);
        });
	})(req,res,next);
};

function facebookSignIn(req, res, next) {};
function facebookSignInCallback(req, res, next) {};
function localSignIn(req, res, next) {};
function localSignInCallback(req, res, next) {};

module.exports = AuthHandler; 
