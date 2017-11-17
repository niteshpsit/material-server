var express = require('express');
var constant = require('../config/constant');
var router = express.Router();

router.get('/drop', function (req, res, next) {
    res.json(constant.dropList);
});

router.get('/releaseType', function (req, res, next) {
    res.json(constant.releaseType);
});

module.exports = router;
