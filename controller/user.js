var express = require('express');
var userService = require('./../service/user');
var authService = require('./../service/auth');

var router = express.Router();

/* REST-JSON-POST register user. */
router.post('/registerUser', function(req, res, next) {
	var user = {
		"firstName" : !(typeof req.body.fname == 'undefined') ? req.body.fname : null,
		"lastName" : !(typeof req.body.lname == 'undefined') ? req.body.lname : null,
		"address" : !(typeof req.body.address == 'undefined') ? req.body.address : null,
		"city" : !(typeof req.body.city == 'undefined') ? req.body.city : null,
		"state" : !(typeof req.body.state == 'undefined')  ?req.body.state : null,
		"zip" : !(typeof req.body.zip == 'undefined') ? req.body.zip : null,
		"email" : !(typeof req.body.email == 'undefined') ? req.body.email : null,
		"username" : !(typeof req.body.username == 'undefined') ? req.body.username : null,
		"password" : !(typeof req.body.password == 'undefined') ? req.body.password : null,
	};
	userService.registerUserAndRespond(user, res);
});

/* REST-JSON-GET list of user. */
router.get('/viewUsers', function(req, res, next) {
	if(!authService.isAuthenticated(req)){
		res.json({
			"err_message" : "You are not logged in"
		});
		return;
	}
	if(req.session.user.DESCRIPTION != 'Administrator') {
		res.json({
			"err_message" : "Access Forbidden"
		});
		return;
	}
	var user = {
		"firstName" : !(typeof req.query.fname == 'undefined') ? req.query.fname : '',
		"lastName" : !(typeof req.query.lname == 'undefined') ? req.query.lname : ''
	};
	userService.viewUsersAndRespond(user, res);
});

/* REST-JSON-POST update user contact. */
router.post('/updateInfo', function(req, res, next) {
	if(!authService.isAuthenticated(req)){
		res.json({
			"err_message" : "You are not logged in"
		});
		return;
	}

	var user = {};
	if (typeof req.body.fname != 'undefined') user["FIRST_NAME"] = req.body.fname;
	if (typeof req.body.lname != 'undefined') user["LAST_NAME"] = req.body.lname;
	if (typeof req.body.address != 'undefined') user["ADDRESS"] = req.body.address;
	if (typeof req.body.city != 'undefined') user["CITY"] = req.body.city;
	if (typeof req.body.state != 'undefined') user["STATE"] = req.body.state;
	if (typeof req.body.zip != 'undefined') user["ZIP"] = req.body.zip;
	if (typeof req.body.email != 'undefined') user["EMAIL"] = req.body.email;
	if (typeof req.body.username != 'undefined') user["USERNAME"] = req.body.username;
	if (typeof req.body.password != 'undefined') user["PASSWORD"] = req.body.password;

	userService.updateUserAndRespond(user, req.session.user.ID, res, req.session);
});

module.exports = router;