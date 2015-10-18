var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {

	//Update the given fields of a given user
	updateUserAndRespond : function(user, userId, res, session) {
		var statement = "UPDATE COMM_USERS SET ";
		for(field in user) {
			statement += field + " = '" + user[field] + "',";
		}
		statement +=" WHERE ID = "+userId+";";

		var pos = statement.lastIndexOf(',');
		statement = statement.substr(0,pos) + statement.substr(pos+1);
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
				for(field in user) {
					session.user[field] = user[field];
				}

				jsonResponse = {
					"message" : "Your information has been updated."
				};
				res.json(jsonResponse);
			}
			
		});
	},

	// Fetch a list of users using partial first name and last name
	viewUsersAndRespond : function(user, res) {
		var statement = 'SELECT U.USERNAME, U.FIRST_NAME, U.LAST_NAME FROM COMM_USERS U, COMM_ROLES R, COMM_USER_ROLES UR WHERE U.ID = UR.USER_ID AND R.ID=UR.ROLE_ID  AND (U.FIRST_NAME LIKE "%'+user.firstName+'%" OR U.LAST_NAME LIKE "%'+user.lastName+'%")';
			connection.query(statement, function(err, rows, fields) {
			var jsonResponse;
			if (err) {
				jsonResponse = {
					"message" : "There was a problem fetching the users."
				};
				console.log(err);
				res.json(jsonResponse);
				return;
			}
			else {
				jsonResponse = {
					"user_list" : rows
				};
				res.json(jsonResponse);
			}
			
		});
	},

	//Register a user as customer with his details and also register the role
	registerUserAndRespond : function(user, res) {
		var statement = 'INSERT INTO COMM_USERS (FULL_NAME, FIRST_NAME,LAST_NAME,ADDRESS, CITY, STATE, ZIP, EMAIL, USERNAME, PASSWORD) VALUES(?,?,?,?,?,?,?,?,?,?);';
		var userId;
		connection.query(statement,[user.firstName+' '+user.lastName,user.firstName,user.lastName, user.address, user.city, user.state, user.zip, user.email, user.username, user.password], function(err, rows, fields) {
			var jsonResponse;
			if (err) {
				jsonResponse = {
					"message" : "There was a problem with your registration."
				};
				console.log(err);
				res.json(jsonResponse);
				return;
			}
			else {
				userId = rows.insertId;		
				console.log(userId);
				var customerRoleId = 2;
				console.log(rows);
				var secondStatement = 'INSERT INTO COMM_USER_ROLES (USER_ID, ROLE_ID) VALUES (?,?);';
				connection.query(secondStatement,[userId,customerRoleId], function(err, rows, fields) {				
					if (err) {
						jsonResponse = {
							"message" : "There was a problem with your registration."
						};
						console.log(err);
						res.json(jsonResponse);
					}
					else{
						jsonResponse = {
							"message" : "Your account has been registered."
						};
						
						res.json(jsonResponse);
					}
				});
			}
		});

		
	}
};
