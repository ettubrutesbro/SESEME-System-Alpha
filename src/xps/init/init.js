// Format json using http://jsonviewer.stack.hu
// Validate using http://jsonlint.com

'use strict'
var mongo = require('../stories.js');

mongo.connect().then(db => {
    db.collection('environment').save(require('./cool_schools.json'));
    db.collection('environment').save(require('./ucd_building_annual_energy_costs.json'));
    db.collection('environment').save(require('./energy_use_intensity.json'));
    db.collection('society').save(require('./wage_inequity.json'));
    db.collection('society').save(require('./mass_incarceration.json'));
    db.collection('misc').save(require('./cost_of_education.json'));
});
