var express = require('express');
var productService = require('./../service/product');

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
	var sessionID = req.query.sessionID;
	if (sessionID != req.sessionID) {
		res.json({
			"err_message" : "Invalid sessionID"
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
	if (typeof req.query.productDescription != 'undefined') product["DESCRIPTION"] = req.query.productDescription;
	if (typeof req.query.productTitle != 'undefined') product["TITLE"] = req.query.productTitle;

	productService.updateProductAndRespond(product, req.query.productId, res);
});

module.exports = router;