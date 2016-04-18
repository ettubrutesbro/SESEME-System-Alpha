'use strict'

var fs = require('fs');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('./stories.js');

// Retrieve all stories from the database
mongo.connect().then(db => {
    const p1 = mongo.retrieveAllStories(db, 'environment');
    const p2 = mongo.retrieveAllStories(db, 'society');
    const p3 = mongo.retrieveAllStories(db, 'misc');
    Promise.all([p1, p2, p3]).then(result => {
        console.log('Completed all promises!');
        const stories = {
            environment: mongo.construct(result[0]) || result[0][0],
            society: mongo.construct(result[1]) || result[1][0],
            misc: mongo.construct(result[2]) || result[2][0],
        };
        fs.writeFileSync('./test.json', JSON.stringify(stories,null,2));
        console.log("Finished constructing stories json :)");
    }).catch(reason => {
        throw reason;
    });
})

