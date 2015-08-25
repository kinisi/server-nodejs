var router = require("../lib/router");
var AuthHandler = require("../lib/middleware/AuthHandler");
var passport = require("passport");
var google_strategy = require("passport-google-oauth").OAuth2Strategy;
var db = require("../lib/db");

router.add("GET", /^\/auth\/google\/callback/, AuthHandler.googleSignInCallback);
router.add("GET", /^\/auth\/google/, AuthHandler.googleSignIn);
router.add("GET", /^\/$/, AuthHandler.googleSignIn);

var saveToken = function(email, accessToken, callback) {
    db.query("insert into oauth_token (user_id, oauth_service, oauth_token, oauth_expires) select id, 'google', ?, date_add(now(), interval 1 hour) from api_token where email = ?",
        [accessToken, email],
        function(err, rows, fields) {
            callback(err);
        });
};

passport.use(new google_strategy({
        clientID: '605951486945-holdhofl3eeln2d070vclevdecfipud1.apps.googleusercontent.com',
        clientSecret: 'x43BSgjZVg66EbciZTtj7nCw',
        callbackURL: 'https://dashboard.kinisi.cc/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        saveToken(profile._json.email, accessToken, function(err) {
            done(err, { "token": accessToken, "profile": profile });
        });
    }
));
