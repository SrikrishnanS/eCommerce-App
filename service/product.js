var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {

	//Fetch a list of products matching the filter criteria
	getProductsAndRespond : function(product, res) {
		var statement;
		if(product.productId=='')
			statement = 'SELECT P.ID, P.ASIN, P.TITLE, P.CLASS, P.DESCRIPTION FROM COMM_PRODUCTS P, COMM_PRODUCT_CATEGORY C WHERE P.ID = C.PRODUCT_ID AND (TITLE LIKE "%'+product.keyword+'%" OR DESCRIPTION LIKE "%'+product.keyword+'%") AND C.CHAIN LIKE "%'+product.category+'%" GROUP BY P.ID;';
		else
			statement = 'SELECT P.ID, P.ASIN, P.TITLE, P.CLASS, P.DESCRIPTION FROM COMM_PRODUCTS P, COMM_PRODUCT_CATEGORY C WHERE P.ID = C.PRODUCT_ID AND (TITLE LIKE "%'+product.keyword+'%" OR DESCRIPTION LIKE "%'+product.keyword+'%") AND C.CHAIN LIKE "%'+product.category+'%" AND P.ID = '+ product.productId +' GROUP BY P.ID;';
		
		console.log(statement);
		connection.query(statement, function(err, rows, fields) {
			var jsonResponse;
			if (err) {
				jsonResponse = {
					"message" : "There was a problem fetching the users"
				};
				console.log(err);
				res.json(jsonResponse);
				return;
			}
			else {
				jsonResponse = {
					"product_list" : rows
				};
				res.json(jsonResponse);
			}			
		});
	}
};