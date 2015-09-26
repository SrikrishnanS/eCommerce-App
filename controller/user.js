var express = require('express');
var userService = require('./../service/user');

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
	var sessionID = req.body.sessionID;
	if (sessionID != req.sessionID) {
		res.json({
			"err_message" : "Invalid sessionID"
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
		"firstName" : !(typeof req.body.fName == 'undefined') ? req.body.fName : '',
		"lastName" : !(typeof req.body.lName == 'undefined') ? req.body.lName : ''
	};
	userService.viewUsersAndRespond(user, res);
});

/* REST-JSON-POST update user contact. */
router.post('/updateInfo', function(req, res, next) {
	var sessionID = req.body.sessionID;
	if (sessionID != req.sessionID) {
		res.json({
			"err_message" : "Invalid sessionID"
		});
		return;
	}

	var user = {};
	if (typeof req.body.fName != 'undefined') user["FIRST_NAME"] = req.body.fName;
	if (typeof req.body.lName != 'undefined') user["LAST_NAME"] = req.body.lName;
	if (typeof req.body.address != 'undefined') user["ADDRESS"] = req.body.address;
	if (typeof req.body.city != 'undefined') user["CITY"] = req.body.city;
	if (typeof req.body.state != 'undefined') user["STATE"] = req.body.state;
	if (typeof req.body.zip != 'undefined') user["ZIP"] = req.body.zip;
	if (typeof req.body.email != 'undefined') user["EMAIL"] = req.body.email;
	if (typeof req.body.uName != 'undefined') user["USERNAME"] = req.body.uName;
	if (typeof req.body.pWord != 'undefined') user["PASSWORD"] = req.body.pWord;

	userService.updateUserAndRespond(user, req.session.user.ID, res, req.session);
});

module.exports = router;