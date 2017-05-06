var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static('docs'));

app.get('/', function (req, res, next) {
	res.sendFile('index.html');
});
app.listen(port, function () {
	console.log('server is running on port:', port);
});
