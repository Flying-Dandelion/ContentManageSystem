/*routes as controller*/
var express = require('express');
var nameBusiness = require("../business/nameHandler.js");

var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
  res.render("login",{"title":"登录"});
});

/* GET index page. */
router.get('/index', function (req, res, next) {
    res.render("index",{"title":"首页"});
});

/* GET userList page. */
router.get('/userMsg/userList', function (req, res, next) {
    res.render("userMsg/userList",{"title":"用户列表"});
});

/* GET addUserPage page. */
router.get('/userMsg/addUserPage', function (req, res, next) {
    res.render("userMsg/addUserPage",{"title":"添加用户"});
});

/* login. */
router.post('/login', function (req, res, next) {
  var doc = {
    "phone": req.body.phone,
    "password": req.body.password
  };
  nameBusiness.userLogin(doc, function(result){
    res.json(result);
  });
});

/* getUser. */
router.get('/getUser', function (req, res, next) {
    var doc={};
    if(req.query.phone !== undefined && req.query.phone !== ""){
        doc.phone=req.query.phone;
    }
    if(req.query.username !== undefined && req.query.username!==""){
        doc.username=req.query.username;
    }
  nameBusiness.getUser(doc,function (result) {
    res.json(result);
  });
});

/* addUserRole. */
router.get('/userMsg/addUserRole', function (req, res, next) {
    var doc={};
    if(req.body.phone !== undefined && req.body.phone !== ""){
        doc.phone=req.body.phone;
    }
    if(req.body.username !== undefined && req.body.username!==""){
        doc.username=req.body.username;
    }
    nameBusiness.getUser(doc,function (result) {
        res.json(result);
    });
});
module.exports = router;
