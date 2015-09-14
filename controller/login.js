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

/** REST-JSON-POST login information to check if such an user exists. */
router.post('/', function(req, res, next) {
	if(authService.isAuthenticated(req)) {
		var jsonResponse = {
			"err_message" : "The user is already logged in",
			"menu":[],
			"sessionID":req.sessionID
		};
		res.json(jsonResponse);
	}		
	else {
		var username = req.query.username;
		var password = req.query.password;
		authService.authenticateAndRespond(username, password, req, res);
	}
});

/** POST login information to check if such an user exists. */
router.post('/post', function(req, res, next) {
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