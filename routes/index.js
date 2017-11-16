var express = require('express');
var Releasecalendar = require('../models/releasecalendar');
var router = express.Router();

router.get('/drop', function (req, res, next) {
  res.json([]);
});

router.get('/', function (req, res, next) {
    Releasecalendar.find({},function(err,calendars){
      res.json(calendars);
    })
});

router.post('/', function (req, res, next) {
  console.log("===ree",req.body);
  Releasecalendar.find({},function(err,calendars){
    res.json(calendars);
  })
});

module.exports = router;
