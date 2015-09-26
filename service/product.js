var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {

	//Update the given fields of a given product
	updateProductAndRespond : function(product, productId, res) {
		var statement = "UPDATE COMM_PRODUCTS SET ";
		for(field in product) {
			statement += field + " = '" + product[field] + "',";
		}
		statement +=" WHERE ID = "+productId+";";

		var pos = statement.lastIndexOf(',');
		statement = statement.substr(0,pos) + statement.substr(pos+1);
		console.log(statement);
		connection.query(statement, function(err, rows, fields) {
			var jsonResponse;
			if (err) {
				jsonResponse = {
					"message" : "There was a problem with this action."
				};
				console.log(err);
				res.json(jsonResponse);
				return;
			}
			else {
				jsonResponse = {
					"message" : "The product information has been updated."
				};
				res.json(jsonResponse);
			}
			
		});
	},

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