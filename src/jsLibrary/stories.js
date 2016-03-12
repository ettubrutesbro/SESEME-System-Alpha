var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/stories';
var fs = require('fs');
var db;

// Driver
MongoClient.connect(url, function(err, database) {
    if(err) {
        console.log("Couldn't connect to MongoDB server.");
        throw err;
    } else {
        console.log('Connected to MongoDB server.');
    }
});
