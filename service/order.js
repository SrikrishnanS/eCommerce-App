var connection = require("./../db/conn/conn.js")

module.exports = {
	getOrders : function(callback) {
		var statement = 'select ID, QUANTITY_SOLD from COMM_PRODUCT_ORDERS WHERE QUANTITY_SOLD <> 0;'

		connection.query(statement, function(err, rows, fields) {
			var jsonResponse;
			if (err) {
				jsonResponse = {
					"message" : "There was a problem fetching the orders information"
				};
				console.log(err);
				callback(jsonResponse);
				return;
			}
			else {
				jsonResponse = {
					"order_list" : rows
				};
				callback(jsonResponse);
			}			
		});		
	},
	placeOrder : function(productId, callback){
		var jsonResponse;
		connection.beginTransaction(function(err){
			var statement = "";
			var quantity=0;
			//query 1 - check if the product is available
			statement = 'SELECT QUANTITY_REM FROM COMM_PRODUCT_WAREHOUSE WHERE ID = ?;';
			connection.query(statement,[productId], function(err, rows, fields) {
  			
  				if (err) {
  					return connection.rollback(function(){
						throw err;
						jsonResponse = {
			  				"message" : "Could not complete the transaction"
			  			};
			  			callback(jsonResponse);
			  			return;
					});
  				}
  				quantity = rows[0].QUANTITY_REM;

  				if(quantity == 0) {
	  				jsonResponse = {
	  					"message" : "The product is out of stock"
	  				};
	  				callback(jsonResponse);
	  				return;
  				}
  				//query 2 - if product is available, decrement quantity avaiable
				statement = 'update COMM_PRODUCT_WAREHOUSE SET QUANTITY_REM = QUANTITY_REM - 1 WHERE ID=?;';
				connection.query(statement,[productId], function(err, rows, fields) {
	  			
	  				if (err) {
	  					return connection.rollback(function(){
							throw err;
							jsonResponse = {
				  				"message" : "Could not complete the transaction"
				  			};
				  			callback(jsonResponse);
				  			return;
						});
	  				}
	  				console.log('Updated warehouse');

	  				//query 3 - if product is available and quantity avaiable decremented, increment quantity sold
					statement = 'update COMM_PRODUCT_ORDERS SET QUANTITY_SOLD = QUANTITY_SOLD + 1 WHERE ID=?;';
					connection.query(statement,[productId], function(err, rows, fields) {

		  				if (err) {
		  					return connection.rollback(function(){
								throw err;
								jsonResponse = {
					  				"message" : "Could not complete the transaction"
					  			};
					  			callback(jsonResponse);
					  			return;
							});
		  				}

		  				console.log('Updated sold information');
		  				connection.commit(function(err) {
							if (err) {
								return connection.rollback(function(){
									throw err;
									jsonResponse = {
						  				"message" : "Could not complete the transaction"
						  			};
						  			callback(jsonResponse);
						  			return;
								});
							}
							console.log('Transction complete');
							jsonResponse = {
			  					"message" : "The purchase has been made successfully"
			  				};
			  				callback(jsonResponse);
			  				return;
						});
					});// end query-3
				});// end query-2
			});// end query-1
		});//end transaction
	}
};
