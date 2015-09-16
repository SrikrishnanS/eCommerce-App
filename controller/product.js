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

module.exports = router;