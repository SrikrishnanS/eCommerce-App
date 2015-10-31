var express = require('express');
var orderService = require('./../service/order');
var authService = require('./../service/auth');

var router = express.Router();

/* REST-JSON-GET view products available. */

router.post('/buyProduct', function(req, res, next) {
	
});

router.get('/getOrders', function(req, res, next) {
	authService.isAuthenticated(req, function(isAuthenticated){
		if(!isAuthenticated){
			res.json({
				"err_message" : "You are not logged in"
			});
			return;
		}
		if(req.session.user.DESCRIPTION != 'Administrator') {
			res.json({
				"err_message" : "Access Forbidden"
			});
			return;
		}
		orderService.getOrders(function(response){
			res.json(response);
			return;	
		});
	});
});

module.exports = router;
