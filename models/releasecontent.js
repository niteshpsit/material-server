// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var releaseContentSchema = new Schema({
    type: String,
    label: String,
    release: [{
        name: String,
        needToBeDeliver: Boolean,
        deliver: Boolean
    }]
});

// the schema is useless so far
// we need to create a model using it
var ReleaseContentSchema = mongoose.model('ReleaseCalendar', releaseContentSchema);

// make this available to our users in our Node applications
module.exports = ReleaseContentSchema;