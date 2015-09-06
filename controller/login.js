var express = require('express');
var service = require('./../service/db');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('login');
});

router.post('/', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
  	
});

module.exports = router;