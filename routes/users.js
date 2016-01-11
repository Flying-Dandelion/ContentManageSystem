/*routes 类似于controller*/
var express = require('express');
var nameBusiness = require("../business/nameHandler.js");

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render("login");
});

/* save. */
router.post('/login', function (req, res, next) {
  var doc = {
    "name": req.body.test
  };

  //调用业务层处理数据
  nameBusiness.insert(doc, function(result){
    res.json(result.result);
  });
});

module.exports = router;
