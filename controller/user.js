var express = require('express');
var userService = require('./../service/user');

var router = express.Router();

/* REST-JSON-POST register user. */
router.post('/', function(req, res, next) {
	console.log("1");
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
	userService.registerUserAndRespond(user,req,res);
});

module.exports = router;