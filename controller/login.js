var express = require('express');
var dbService = require('./../service/db');

var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  	res.render('login',{loginFail:false});
});

/** POST login information to check if such an user exists. */
router.post('/', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	dbService.authenticate(username, password, res);
});

/* GET login page. */
router.get('/failed', function(req, res, next) {
  	res.render('login',{loginFail:true});
});

module.exports = router;