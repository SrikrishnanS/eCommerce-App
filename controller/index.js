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

router.get('/logout', function(req, res, next) {
	authService.logout(req);
  	res.redirect('/login/');
});

module.exports = router;