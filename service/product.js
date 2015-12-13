var pool = require("./../db/conn/conn.js")

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
		pool.getConnection(function(err, connection) {	
			connection.query(statement, function(err, rows, fields) {
				var jsonResponse;
				if (err) {
					jsonResponse = {
						"message" : "There was a problem with this action."
					};
					console.log(err);
					connection.release();
					res.json(jsonResponse);
					return;
				}
				else {
					jsonResponse = {
						"message" : "The product information has been updated."
					};
					connection.release();
					res.json(jsonResponse);
				}				
			});
		});
	},

	//Fetch a list of products matching the filter criteria
	getProductsAndRespond : function(product, res) {
		var statement;
		if(product.productId=='')
			statement = 'SELECT DISTINCT P.TITLE FROM COMM_PRODUCTS P, COMM_PRODUCT_CATEGORY C WHERE P.ID = C.PRODUCT_ID AND (TITLE LIKE "%'+product.keyword+'%" OR DESCRIPTION LIKE "%'+product.keyword+'%") AND C.CHAIN LIKE "%'+product.category+'%";';
		else
			statement = 'SELECT DISTINCT P.TITLE FROM COMM_PRODUCTS P, COMM_PRODUCT_CATEGORY C WHERE P.ID = C.PRODUCT_ID AND (TITLE LIKE "%'+product.keyword+'%" OR DESCRIPTION LIKE "%'+product.keyword+'%") AND C.CHAIN LIKE "%'+product.category+'%" AND P.ID = '+ product.productId +';';
		
		pool.getConnection(function(err, connection) {	
			connection.query(statement, function(err, rows, fields) {
				var jsonResponse;
				if (err) {
					jsonResponse = {
						"message" : "There was a problem fetching the users"
					};
					console.log(err);
					connection.release();
					res.json(jsonResponse);
					return;
				}
				else {
					jsonResponse = {
						"product_list" : rows
					};
					connection.release();
					res.json(jsonResponse);
				}			
			});
		});
	},
	addAlsoBought : function(product, callback) {
		var statement = 'INSERT INTO COMM_PRODUCT_BOUGHT (PRODUCT_1_ID,PRODUCT_2_ID) VALUES(?,?)';
		pool.getConnection(function(err, connection) {	
			connection.query(statement,[product.productId1,product.productId2], function(err, rows, fields) {
				var jsonResponse;
				if (err) {
					jsonResponse = {
						"message" : "there was a problem processing the request"
					};
					console.log(err);
					connection.release();
					callback(jsonResponse);
					return;
				}
				else {
					jsonResponse = {
						"message" : "the request was successful"
					};
					connection.release();
					callback(jsonResponse);
					return;
				}				
			});
		});
	}
};