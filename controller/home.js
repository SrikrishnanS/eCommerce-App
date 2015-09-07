var express = require('express');
var authService = require('./../service/auth');
var ansUtil = require('./../util/ans');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(authService.isAuthenticated(req))
  		res.render('home', {'user' : req.session.user});
  	else
  		res.redirect('/login/');
});

router.post('/', function(req, res, next) {
	var answer1 = req.body.question1;
	var answer2 = req.body.question2;
	var answer3 = req.body.question3;
	var feedback = ansUtil.validate(answer1, answer2, answer3);
	res.render('home', {'user' : req.session.user, 'feedback' : feedback});
});

module.exports = router;
