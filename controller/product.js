var express = require('express');
var productService = require('./../service/product');
var authService = require('./../service/auth');

var router = express.Router();

/* REST-JSON-GET view products available. */

router.get('/getProducts', function(req, res, next) {
	var product = {
		"productId" : !(typeof req.query.productId == 'undefined') ? req.query.productId : '',
		"category" : !(typeof req.query.category == 'undefined') ? req.query.category : '',
		"keyword" : !(typeof req.query.keyword == 'undefined') ? req.query.keyword : ''
	};
	productService.getProductsAndRespond(product, res);
});

/* REST-JSON-POST update product information. */
router.post('/modifyProduct', function(req, res, next) {
	if(!authService.isAuthenticated(req)){
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
	var product = {};
	if (typeof req.body.productDescription != 'undefined') product["DESCRIPTION"] = req.body.productDescription;
	if (typeof req.body.productTitle != 'undefined') product["TITLE"] = req.body.productTitle;

	productService.updateProductAndRespond(product, req.body.productId, res);
});

module.exports = router;