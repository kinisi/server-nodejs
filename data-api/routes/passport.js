var router = require("../lib/router");
//var rutil = require("../lib/router_util");
//var auth = require("../lib/middleware/auth");
//var tablequery = require("../lib/middleware/tablequery");
var AuthHandler = require("../lib/middleware/AuthHandler");

//        app.get('/auth/google',handlers.auth.googleSignIn);
//        app.get('/auth/google/callback',handlers.auth.googleSignInCallback);

//router.add("GET", /\/table\//, auth, tablequery, rutil.writeCORSHeaders, rutil.writeJSONPBody);
router.add("GET", /\/auth\/google\/callback/, AuthHandler.googleSignInCallback);
router.add("GET", /\/auth\/google/, AuthHandler.googleSignIn);

var passport = require('passport');

var google_strategy = require('passport-google-oauth').OAuth2Strategy;

var db = require("../lib/db");

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
