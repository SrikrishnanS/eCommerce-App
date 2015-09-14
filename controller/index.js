var express = require('express');
var authService = require('./../service/auth');

var router = express.Router();

/* GET home page if authenticated. */
router.get('/', function(req, res, next) {
	if(authService.isAuthenticated(req))
		res.redirect('/home/');
	else
  		res.redirect('/login/');
});

/* REST-JSON-Logout the user and REDIRECT to login page*/
router.post('/logout', function(req, res, next) {
	var sessionID = req.query.sessionID;
	var jsonResponse;
	if (sessionID === req.sessionID){
		authService.logout(req);
		jsonResponse = {
			"message" : "You have been logged out"
		};
		
	}
	else {
		jsonResponse = {
			"message" : "You are not currently logged in"
		};
	}
	res.json(jsonResponse);
});

/* Logout the user and REDIRECT to login page*/
router.get('/logout', function(req, res, next) {
	authService.logout(req);
  	res.redirect('/login/');
});

module.exports = router;