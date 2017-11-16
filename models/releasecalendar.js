// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var releaseCalendarSchema = new Schema({
    drop: String,
    type: String,
    label: String,
    planDate: Date,
    actDate: Date,
    version: String,
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