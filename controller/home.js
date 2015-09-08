var express = require('express');
var authService = require('./../service/auth');
var ansService = require('./../service/ans');
var ansUtil = require('./../util/ans');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(authService.isAuthenticated(req)) {
		var user = req.session.user;
		if(user.DESCRIPTION === 'Customer') {
  			res.render('home', {
  				'user' : user
  			});
		}
  		else if(user.DESCRIPTION === 'Administrator') {
  			ansService.getCustomerResponses(res);
  		}
	}
  	else
  		res.redirect('/login/');
});

/* GET the home page with the responses for the customer. */
router.post('/', function(req, res, next) {
	var answer1 = req.body.question1;
	var answer2 = req.body.question2;
	var answer3 = req.body.question3;
	var feedback = ansUtil.validate(answer1, answer2, answer3);
	ansService.recordResponses(req.session.user,feedback);
	res.render('home', {
		'user' : req.session.user, 
		'feedback' : feedback
	});
});

module.exports = router;
