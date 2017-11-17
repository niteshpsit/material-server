var express = require('express');
var Releasecalendar = require('../models/releasecalendar');
var constant = require('../config/constant')
var router = express.Router();

router.get('/', function (req, res, next) {
  Releasecalendar.find({}, function (err, calendars) {
    res.json(calendars);
  })
});

router.post('/', function (req, res, next) {
  var { releaseDrop, deliveryType, label, version, planDate } = req.body;
  var releasecalendar = new Releasecalendar({
    releaseDrop: releaseDrop,
    deliveryType: deliveryType,
    label: label,
    release: constant.getReleaseName(releaseDrop, deliveryType, label),
    planDate: planDate,
    version: version,
  })
  Releasecalendar.find({ release: releasecalendar.release }, function (err, releases) {
    if (err) {
      res.status(422).json(err)
      return;
    }
    if (releases && releases.length > 0) {
      res.status(422).json({ message: releasecalendar.release + ": Entry must be unique:" })
      return;
    }
    releasecalendar.save((err, data) => {
      if (err) {
        res.statusCode(422).json(err)
        return;
      }
      res.json(data);
    });
  })

});

router.put('/', function (req, res, next) {
  // get the user starlord55
  var { id, releaseDrop, deliveryType, label, version, planDate, actDate, status } = req.body;
  Releasecalendar.find({  _id:{ $ne: id } , releaseDrop: releaseDrop, deliveryType: deliveryType, label: label }, function (err, releases) {
    if (err) {
      res.status(422).json(err)
      return;
    }
    if (releases && releases.length > 0 ) {
      res.status(422).json({ message: releases[0].release + ": Entry must be unique:" })
      return;
    }

    var updatedRelease = {}
    if (releaseDrop)
      updatedRelease.releaseDrop = releaseDrop

    if (deliveryType)
      updatedRelease.deliveryType = deliveryType

    if (label)
      updatedRelease.label = label

    if(releaseDrop || deliveryType || label)
      updatedRelease.release = constant.getReleaseName(releaseDrop,deliveryType,label);
    
    if (version)
      updatedRelease.version = version

    if (planDate)
      updatedRelease.planDate = planDate

    if (actDate)
      updatedRelease.actDate = actDate

    if (status)
      updatedRelease.status = status

    Releasecalendar.findOneAndUpdate({ _id: id }, updatedRelease, function (err, release) {
      if (err) {
        res.statusCode(422).json(err)
        return;
      }
      res.json(release);
    });
  });
})

router.post('/delete', function (req, res, next) {
  // get the user starlord55
  var { releaseDrop, deliveryType, label, _id } = req.body;
  Releasecalendar.findOne({ _id: _id }, function (err, release) {
    if (err) {
      res.status(422).json(err)
      return;
    }
    release.remove(function (err) {
      if (err) {
        res.status(422).json(err)
        return;
      }
      res.json({ message: "Deleted" });
    });

  });
})

module.exports = router;
