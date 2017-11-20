var express = require('express');
var constant = require('../config/constant');
var ReleaseCalendar = require('../models/releasecalendar');
var router = express.Router();

router.get('/drop', function (req, res, next) {
    res.json(constant.dropList);
});

router.get('/releaseType', function (req, res, next) {
    res.json(constant.releaseType);
});

router.get('/latestRelease',function(req, res, next){
    ReleaseCalendar.find({},function(err,releases){
        res.json(releases);
    })
})

router.get('/taskType', function (req, res, next) {
    res.json(constant.taskType);
});

router.get('/releases',function(req,res,next){
    ReleaseCalendar.find({status:'pending'},{_id:0,release:1},function(err, releases){
        let releasesList = releases.map(release=>release.release);
        res.json(releasesList)
    })
});


module.exports = router;
