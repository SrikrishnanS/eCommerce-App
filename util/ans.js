//Util method to validate the user answers
module.exports = {
	validate : function(answer1, answer2, answer3) {
		var f1='Incorrect', f2='Incorrect', f3='Incorrect';
		if(answer1 === '4')
			f1 = 'Correct';
		if(answer2 === '12')
			f2 = 'Correct';
		if(answer3 === '1')
			f3 = 'Correct';
		var response = {
			'answer1' : {
				'value' : answer1,
				'response' : f1,	
			},
			'answer2' : {
				'value' : answer2,
				'response' : f2,	
			},
			'answer3' : {
				'value' : answer3,
				'response' : f3,	
			}
		};
		return response;
	}
};
