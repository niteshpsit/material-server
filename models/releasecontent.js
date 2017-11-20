// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var releaseContentSchema = new Schema({
    name: {type : String, required : true},
    label: {type : String, required : true},
    releases: [{
        name: String,
        needToBeDeliver: Boolean,
        delivered: { type: Boolean, default: false }
    }]
});

// the schema is useless so far
// we need to create a model using it
var ReleaseContentSchema = mongoose.model('ReleaseContent', releaseContentSchema);

// make this available to our users in our Node applications
module.exports = ReleaseContentSchema;