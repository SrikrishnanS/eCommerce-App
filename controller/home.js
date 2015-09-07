var express = require('express');
var authService = require('./../service/auth');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(authService.isAuthenticated(req))
  		res.render('home', {'user' : req.session.user});
  	else
  		res.redirect('/login/');
});

module.exports = router;