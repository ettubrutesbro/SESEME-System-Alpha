'use strict'
var mongo = require('../stories.js');

mongo.connect().then(db => {
    db.collection('environment').save(require('./annual_energy_costs.json'));
    db.collection('environment').save(require('./cool_schools.json'));
    db.collection('society').save(require('./wage_inequity.json'));
    db.collection('society').save(require('./mass_incarceration.json'));
    db.collection('misc').save(require('./college_stats.json'));
});
