var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {
	recordResponses : function(user, responses) {
		var statement = 'INSERT INTO COMM_USER_RESPONSES (USER_ID,ANSWER_ONE,ANSWER_TWO,ANSWER_THREE,FEEDBACK_ONE,FEEDBACK_TWO,FEEDBACK_THREE) VALUES(?,?,?,?,?,?,?)';
		var userId = user.ID;
		var answerOne = responses.answer1.value;
		var answerTwo = responses.answer2.value;
		var answerThree = responses.answer3.value;
		var feedbackOne = responses.answer1.response;
		var feedbackTwo = responses.answer2.response;
		var feedbackThree = responses.answer3.response;

		connection.query(statement,[userId,answerOne,answerTwo,answerThree,feedbackOne,feedbackTwo,feedbackThree], function(err, rows, fields) {
			if (err) throw err;
		});
	}
};