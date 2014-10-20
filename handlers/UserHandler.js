var user = require('../models/user');
var db = require("../models/db");

var UserHandler = function() {
	this.createUser = handleCreateUserRequest;
	this.getUsers = handleGetUsersRequest;
	this.getUser = handleGetUserRequest;
    this.getUserByToken = handleGetUserByToken;
	this.updateUser = handleUpdateUserRequest;
	this.deleteUser = handleDeleteUserRequest;
	console.log("User Handler Set Up");
};

function handleCreateUserRequest(req,res) {
	console.log(req.params);
}

function handleGetUsersRequest(req, res) {
	console.log("I am here");
	user.find({}, function (err, users) {
		if(err) {
			console.log(err);
		}	
		else {
			res.send(users);
		}
	});	
}

function handleGetUserRequest(req, res) {
    console.log("Get User");
    db.query("SELECT a.* FROM api_token a JOIN oauth_token o on a.id = o.user_id WHERE oauth_token = ? and a.id = ?", [req.query.token, req.params.id], function(err, rows, fields) {
        res.end(JSON.stringify(rows));
    });
}

function handleGetUserByToken(req, res) {
	console.log("Lookup User by Token");
	db.query("SELECT a.* FROM api_token a JOIN oauth_token o on a.id = o.user_id WHERE oauth_token = ?", [req.params.token], function(err, rows, fields) {
        res.end(JSON.stringify(rows));
    });
}

function handleUpdateUserRequest(req, res) {
	var dummy = {text: "dummy get"};
	res.end(dummy);
}

function handleDeleteUserRequest(req, res) {
	var dummy = {text: "dummy get"};
	res.end(dummy);
}

module.exports = UserHandler;

