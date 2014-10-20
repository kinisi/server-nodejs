function setup(app,handlers) {
	app.get('/auth/google',handlers.auth.googleSignIn);
	app.get('/auth/google/callback',handlers.auth.googleSignInCallback);
	//app.get('/auth/facebook',handlers.auth.facebookSignIn);
	//app.get('/auth/facebook/callback',handlers.auth.facebookSignInCallback);
	//app.get('/auth/local',handlers.auth.localSignIn);
	//app.get('/auth/local/callback',handlers.auth.localSignInCallback);
	app.get('/user',handlers.user.getUsers);
	app.get('/token/:token',handlers.user.getUserByToken);
	app.get('/user/:id',handlers.user.getUser);
	app.get('/user/:first/:last/:email',handlers.user.createUser);
	console.log("Successfully set up routes");
}

exports.setup = setup;
