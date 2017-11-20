var express = require('express');
var Releasecalendar = require('../models/releasecalendar');
var ReleaseContent = require('../models/releasecontent');
var constant = require('../config/constant')
var async = require('async');
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

  Releasecalendar.find({ releaseDrop: releaseDrop, deliveryType: deliveryType, label: label }, function (err, releases) {
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
  Releasecalendar.find({ _id: { $ne: id }, releaseDrop: releaseDrop, deliveryType: deliveryType, label: label }, function (err, releases) {
    if (err) {
      res.status(422).json(err)
      return;
    }
    if (releases && releases.length > 0) {
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

    if (releaseDrop || deliveryType || label)
      updatedRelease.release = constant.getReleaseName(releaseDrop, deliveryType, label);

    if (version)
      updatedRelease.version = version

    if (planDate)
      updatedRelease.planDate = planDate

    if (actDate)
      updatedRelease.actDate = actDate

    if (status)
      updatedRelease.status = status

    async.series([
      (callback) => {
        if (status === "done") {
          ReleaseContent.find({ "releases.name": updatedRelease.release }, function (err, content) {
            if (err) {
              callback(err, null)
              return;
            }
            console.log("===con", content);
            if (content && content.length) {
              let message = ""
              content.forEach((data) => {
                data.releases && data.releases.forEach(release => {
                  if (release.name === updatedRelease.release && release.needToBeDeliver === true && release.delivered === false)
                    message = message+`   '${data.name} ${data.label}'`
                })
              })
              console.log("====mesa", message)
              if (message && message.trim() !== "") {
                callback(constant.getMessageForNotDeliveredList(message), null);
                return;
              }
            }
            callback(null, !err);
          })
        }
        else
          callback(null, true);
      },
      (callback) => {
        Releasecalendar.findOneAndUpdate({ _id: id }, updatedRelease, function (err, release) {
          if (err) {
            callback(err, null)
            return;
          }
          callback(null, !err)
        });
      }
    ], (err, result) => {
      if (err) {
        res.status(422).json(constant.getErrorMsgResponseFormate(err))
        return;
      }
      res.json({ message: "Successfully Updated" });
    })
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
