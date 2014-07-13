var db = require("./db");

module.exports.saveToken = function(email, accessToken, callback) {
    db.query("insert into oauth_token (user_id, oauth_service, oauth_token, oauth_expires) select id, 'google', ?, date_add(now(), interval 1 hour) from api_token where email = ?", 
        [accessToken, email], 
        function(err, rows, fields) {
            callback(err);
        });
};

