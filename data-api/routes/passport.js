var router = require("../lib/router");
var AuthHandler = require("../lib/middleware/AuthHandler");
var passport = require('passport');
var google_strategy = require('passport-google-oauth').OAuth2Strategy;
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
        clientID: '584161997041-6rmosthf1f3vfl6u5se1gml5pv973va0.apps.googleusercontent.com',
        clientSecret: 'db4T8HsTPF62gKmUlUF_QBZn',
        callbackURL: 'https://maps.kinisi.cc/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        saveToken(profile._json.email, accessToken, function(err) {
            done(err, { "token": accessToken, "profile": profile });
        });
    }
));
