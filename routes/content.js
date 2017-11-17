var express = require('express');
var router = express.Router();
var ReleaseContent = require('../models/releasecontent');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',function(){
  
});

module.exports = router;
