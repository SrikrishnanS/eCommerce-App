var express = require('express');
var authService = require('./../service/auth');

var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
	if(authService.isAuthenticated(req))
		res.redirect('/home/');
	else	
  		res.render('login', {
  			loginFail:false
  		});
});

/** POST login information to check if such an user exists. */
router.post('/', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	authService.authenticate(username, password, req, res);
});

/* GET login page in case of incorrect username and password. */
router.get('/failed', function(req, res, next) {
	if(authService.isAuthenticated(req))
		res.redirect('/home/');
	else
  		res.render('login', {
  			loginFail:true
  		});
});

module.exports = router;