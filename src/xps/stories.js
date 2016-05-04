'use strict'

var path = require('path');
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');
var url = 'mongodb://localhost:27017/stories';

function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, database) => {
            if(err) {
                console.log("Couldn't connect to MongoDB server.");
                reject(err);
            } else {
                console.log('Connected to MongoDB server.');
                resolve(database);
            }
        });
    });
}

function insertStory(db, topic, json) {
    return new Promise((resolve, reject) => {
        console.log('Inserting story');
        db.collection(topic).save(json);
        resolve();
    });
}

function retrieveStory(db, storyId, topic, callback) {
    return new Promise((resolve, reject) => {
        db.collection(topic, (error, collection) => {
            if(error) {
                resolve(error);
            } else {
                console.log('Retrieving story');
                collection.findOne({ _id : storyId }, (e, json) => {
                    e ? reject(e) : resolve(json);
                });
            }
        });
    });
}

function retrieveAllStories(db, topic) {
    return new Promise((resolve, reject) => {
        db.collection(topic, (err, collection) => {
            if(err) {
                reject(err);
            } else {
                console.log('Retrieving all stories');
                collection.find().toArray((e, stories) => {
                    e ? reject(e) : resolve(stories);
                });
            }
        });
    });
}

// Construct stories for a specific topic with multiple parts from the story-config
function construct(stories) {
    let topic = [];
    let result = {};
    const config = require(path.join(__dirname, '..', '..', 'story-config.json'));

    if(stories[0].seedling === 'environment') {
        topic = config.env;
        result = {
            id: 0,
            parts: [],
            seedling: 'environment',
            description: 'Stories in this series deal with local and global environmental issues.'
        };
    } else if(stories[0].seedling === 'society') {
        topic = config.soc;
        result = {
            id: 1,
            parts: [],
            seedling: 'society',
            description: 'The stories in this series deal with issues of social justice'
        };
    } else if(stories[0].seedling === 'misc') {
        topic = config.misc;
        result = {
            id: 2,
            parts: [],
            seedling: 'misc',
            description: 'These stories can be about anything. Hope you like surprises!'
        };
    } else {
        console.error(`ERROR: Invalid seedling value (${stories[0].seedling}) in database story.`);
        process.exit(0);
    }

    const total = [];
    const matched = [];
    for(let i = 0; i < stories.length; i++) {
        let story = stories[i];
        total.push(story.storyName);
        for(let j = 0; j < topic.length; j++) {
            if(topic[j] === story.storyName) {
                result.parts = result.parts.concat(story.parts);
                matched.push(story.storyName);
            }
        }
    }

    if(!result.parts.length) {
        const unmatched = total.filter(function(x) { return matched.indexOf(x) < 0 })
        console.log(`ERROR: Invalid [${result.seedling}] stories!`);
        console.log('Unmatched stories: ' + JSON.stringify(unmatched,null,2));
        process.exit(0);
    }

    return result.parts.length ? result : null;
}

exports.connect = connect;
exports.construct = construct;
exports.insertStory = insertStory;
exports.retrieveStory = retrieveStory;
exports.retrieveAllStories = retrieveAllStories;
