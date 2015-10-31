var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

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
				callback(jsonResponse)
				return;
			}
			else {
				jsonResponse = {
					"order_list" : rows
				};
				callback(jsonResponse);
			}			
		});		
	}
};