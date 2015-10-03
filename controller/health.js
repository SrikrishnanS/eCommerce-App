var express = require('express');
var router = express.Router();

/* GET site health status. */
router.get('/', function(req, res, next) {
	console.log(req.sessionID);
	res.send('OK');
});

module.exports = router;
