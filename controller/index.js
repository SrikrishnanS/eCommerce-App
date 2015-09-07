var express = require('express');
var authService = require('./../service/auth');

var router = express.Router();

/* GET home page if authenticated. */
router.get('/', function(req, res, next) {
	if(authService.isAuthenticated(req))
		res.redirect('/home/');
	else	
  		res.render('login',{loginFail:false});
});

router.get('/logout', function(req, res, next) {
	authService.logout(req);
  	res.render('login',{loginFail:false});
});

module.exports = router;