// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var handler = require('./commonHandler')

// create a schema
var releaseCalendarSchema = new Schema({
    releaseDrop: {type : String, required : true},
    deliveryType: {type : String, required : true},
    label: String,
    release: {type : String, required : true},
    planDate: {type : Date, required : true},
    actDate: Date,
    version: {type : String, required : true},
    status: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending'
    },
});

// the schema is useless so far
// we need to create a model using it
var ReleaseCalendarSchema = mongoose.model('ReleaseCalendar', releaseCalendarSchema);

// make this available to our users in our Node applications
module.exports = ReleaseCalendarSchema;