var express = require('express');
var ReleaseContent = require('../models/releasecontent');
var async = require('async');
var router = express.Router();

/* GET content  listing. */
router.get('/', function (req, res, next) {
  let { releaseList } = req.query;
  if(releaseList)
    releaseList =  releaseList.split(',');

  ReleaseContent.aggregate([
    { $unwind: "$releases" },
    { $match: { "releases.name": { $in: releaseList } } },
    { $group: { _id: "$_id", name: { $first:'$name'}, label:{ $first: '$label'}, releases: { $push: "$releases" } } }
  ],function(err,contents){
    res.json(contents);
  })
});

router.post('/', (req, res, next) => {
  let { label, name, releases } = req.body;

  let releaseContent = new ReleaseContent({
    label: label,
    name: name,
    releases: releases
  });

  releaseContent.save(function (err, data) {
    if (err) {
      res.status(422).json(err)
      return;
    }
    res.json(data);
  });
});

router.put('/', (req, res, next) => {
  let { label, name, releases, id } = req.body;

  async.series([
    (callback) => {
      let updatedReleaseContent = {};
      if (label)
        updatedReleaseContent.label = label;

      if (name)
        updatedReleaseContent.name = name;

      if (updatedReleaseContent && Object.keys(updatedReleaseContent).length) {
        ReleaseContent.findOneAndUpdate({ _id: id }, updatedReleaseContent, function (err, release) {
          if (err) {
            callback(err, null);
            return;
          }
          callback(null, true);
        });
      }
      else {
        callback(null, true);
      }
    },
    (callback) => {
      if (releases && releases.length) {
        async.everySeries(releases, function (release, everyCallback) {
          async.series([
            function (callback) {
              ReleaseContent.findOneAndUpdate(
                { _id: id, releases: { $elemMatch: { name: release.name } } },
                { $set: { "releases.$.needToBeDeliver": release.needToBeDeliver, "releases.$.delivered": release.delivered } },
                function (err, data) {
                  if (data) {
                    everyCallback(null, !err)
                    return;
                  }
                  else {
                    callback(null, !err);
                  }
                }
              )
            },
            function (callback) {
              ReleaseContent.findOneAndUpdate(
                { _id: id },
                { $push: { releases: release } }
                , function (err, data) {
                  callback(null, !err);
                }
              )
            }
          ], function (err, result) {
            everyCallback(null, !err);
          })
        }, function (err, result) {
          callback(null, true);
        });
      }
      else {
        callback(null, true);
      }
    }
  ], (err, result) => {
    if (err)
      res.json({ message: err })
    res.json({ message: "SuccessFully updated" })
  })

});

router.post('/delete', function (req, res, next) {
  // get the user starlord55
  var { _id } = req.body;
  ReleaseContent.findOne({ _id: _id }, function (err, release) {
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
