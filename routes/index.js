var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

/* Loads articles page and fills with entries from the db  */
router.get('/articles', function(req, res, next) {
	var MongoClient = require('mongodb').MongoClient;

	MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
	  	if(!err) {
	   		var collection = db.collection('comments');
			collection = collection.find().toArray(function(err,resp){
				console.log(resp);
				var item;
				var count = 0;
				var items = [];
			  	db.close();
				res.render('articles', { data: JSON.stringify(resp)});				
			});
	  	}else{
	   		console.log(err);
	  	}
	});
});

/* Writes text entry into db and redirects to articles page*/
router.post('/articles', function(req, res, next) {
	console.log(req.body.article);
  	var MongoClient = require('mongodb').MongoClient;

	MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
	  	if(!err) {
	   		console.log("We are connected");
	   		var collection = db.collection('comments');
	   		var count;
			collection.count({}, function(error, numOfDocs) {
			    count = numOfDocs;
	   	   		console.log(count);
	   	   		var entry = {id: count+1, text: req.body.article} 

		   		collection.insert(entry, function (err,result){
		   			if (err) {
	        			console.log(err);
	      			} else {
	        			console.log('Inserted new comment with id %d',count);
	      			}
			   		db.close();
		   		});
			});
	  	}else{
	   		console.log(err);
	  	}
	});
    res.redirect('/articles');
    res.end();
});

module.exports = router;
