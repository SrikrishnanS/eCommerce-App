var express = require('express');
var userService = require('./../service/user');

var router = express.Router();

/* REST-JSON-POST register user. */
router.post('/registerUser', function(req, res, next) {
	var user = {
		"firstName" : !(typeof req.query.fName == 'undefined') ? req.query.fName : null,
		"lastName" : !(typeof req.query.lName == 'undefined') ? req.query.lName : null,
		"address" : !(typeof req.query.address == 'undefined') ? req.query.address : null,
		"city" : !(typeof req.query.city == 'undefined') ? req.query.city : null,
		"state" : !(typeof req.query.state == 'undefined')  ?req.query.state : null,
		"zip" : !(typeof req.query.zip == 'undefined') ? req.query.zip : null,
		"email" : !(typeof req.query.email == 'undefined') ? req.query.email : null,
		"username" : !(typeof req.query.uName == 'undefined') ? req.query.uName : null,
		"password" : !(typeof req.query.pWord == 'undefined') ? req.query.pWord : null,
	};
	userService.registerUserAndRespond(user, res);
});

/* REST-JSON-GET list of user. */
router.get('/viewUsers', function(req, res, next) {
	var sessionID = req.query.sessionID;
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
		"firstName" : !(typeof req.query.fName == 'undefined') ? req.query.fName : null,
		"lastName" : !(typeof req.query.lName == 'undefined') ? req.query.lName : null
	};
	userService.viewUsersAndRespond(user, res);
});

/* REST-JSON-POST update user contact */
router.post('/updateInfo', function(req, res, next) {
	var sessionID = req.query.sessionID;
	if (sessionID != req.sessionID) {
		res.json({
			"err_message" : "Invalid sessionID"
		});
		return;
	}

	var user = {};
	if (typeof req.query.fName != 'undefined') user["FIRST_NAME"] = req.query.fName;
	if (typeof req.query.lName != 'undefined') user["LAST_NAME"] = req.query.lName;
	if (typeof req.query.address != 'undefined') user["ADDRESS"] = req.query.address;
	if (typeof req.query.city != 'undefined') user["CITY"] = req.query.city;
	if (typeof req.query.state != 'undefined') user["STATE"] = req.query.state;
	if (typeof req.query.zip != 'undefined') user["ZIP"] = req.query.zip;
	if (typeof req.query.email != 'undefined') user["EMAIL"] = req.query.email;
	if (typeof req.query.uName != 'undefined') user["USERNAME"] = req.query.uName;
	if (typeof req.query.pWord != 'undefined') user["PASSWORD"] = req.query.pWord;

	userService.updateUserAndRespond(user, req.session.user.ID, res);
});

module.exports = router;