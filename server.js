var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var validator = require('express-validator');
var Mailgun = require('mailgun-js');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

/**** Setting access controll headers ****/
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/**Binding validator and sanitizing request body to prevent XSS attack**/
app.use(validator());
app.use(function(req, res, next) {
	for (var item in req.body) {
		req.sanitize(item).escape();
	}
	next();
});

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/myapp')));

/*** Handling contact form submission ***/
app.post('/api/submitquery', function (req, res) {
	enquiryData = {
		'user_name': req.body.name,
		'user_email': req.body.email,
		'user_query': req.body.query
	}

	/** Validating input data **/
	req.checkBody('name', 'Invalid name.').notEmpty();
	req.checkBody('email', 'Invalid email.').notEmpty().isEmail();
	req.checkBody('query', 'Invalid question.').notEmpty();
	var errors = req.validationErrors();
	////If there are validation errors then throw bad request
	if (errors) {
		console.log(errors);
		res.status(400);
		res.json({ 'status': 0, 'msg': 'Invalid input.' });
	}
	/////Input data is valid so continue.
	else {
		try {
			//Mailgun API key
			var api_key = 'bf72f1a6032f78f09f39953b651ed9da-0470a1f7-ec139369';

			//Domain setup in mailgun
			var domain = 'sandbox3d0006e1c89945fa874d12439d85903b.mailgun.org';

			//from email address
			var from_who = 'gauravdarak123@yahoo.com';

			/****Instantiating mailgun class****/
			var mailgun = new Mailgun({
				apiKey: api_key,
				domain: domain
			});

			var emailBody = '<p>Hi Team,</p><p>A user has submitted contact form from our website. Following are the details<br>Name: ' + enquiryData.user_name + '<br>Email: ' + enquiryData.user_email + '<br>Question: ' + enquiryData.user_query + '</p><p>Thanks</p>';

			var data = {
				//Specifying from email address
				from: from_who,
				//Specifying to email address
				to: 'webcontact@mailinator.com',
				//Specifying subject line  
				subject: 'Website contact us',
				//Specifying email body
				html: emailBody
			}

			/*****Sending email using mailgun******/
			mailgun.messages().send(data, function (err, body) {
				//There is an error so sending error response
				if (err) {
					console.log("got an error: ", err);
					res.status(500);
					res.json({ 'status': '0', 'msg': 'Something went wrong, please try after sometime.' });
				}
				//Everything worked fine so sending success response.
				else {
					res.status(200);
					res.json({ 'status': 1, 'msg': 'Thanks for contacting us. We have received your query and we will get back to you shortly.' });
				}
			});
		}
		catch (e) {
			console.log(e);
			res.status(500);
			res.json({ 'status': 0, 'msg': 'Something went wrong, please try after sometime.' })
		}

	}
});

// Handling all other requests in Angular app
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/myapp/index.html'));
});

port = 3000;
app.listen(port, function () {
	console.log(`Running on localhost:${port}`);
});