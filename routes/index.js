/*routes as controller*/
var express = require('express');
var userMsgHandler = require("../business/userMsgHandler.js");
var sysMsgHandler = require("../business/sysMsgHandler.js");
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render("login",{"title":"登录"});
});

/* GET index page. */
router.get('/index', function (req, res, next) {
    res.render("index",{"title":"首页",menu:""});
});

/* GET userList page. */
router.get('/userMsg/userList', function (req, res, next) {
    res.render("userMsg/userList",{"title":"用户列表",menu:"1"});
});

/* GET userList page. */
router.get('/sysMsg/roleMsg', function (req, res, next) {
    res.render("sysMsg/roleMsg",{"title":"角色列表",menu:"0"});
});

/* GET addUserPage page. */
router.get('/userMsg/addUserPage', function (req, res, next) {
    res.render("userMsg/addUserPage",{"title":"添加用户",menu:"1"});
});
/* login. */
router.post('/login', function (req, res, next) {
  var doc = {
    "phone": req.body.phone,
    "password": req.body.password
  };
    userMsgHandler.userLogin(doc,function(result){
    res.json(result);
  });
});

/* getUser. */
router.get('/getUser', function (req, res, next) {
    var doc={},info={},query={};
    if(req.query.phone !== undefined && req.query.phone !== ""){
        query.phone=req.query.phone;
    }
    if(req.query.username !== undefined && req.query.username!==""){
        query.username=req.query.username;
    }
    query.addtime={$gte:req.query.startaddtime+" 00:00:00",$lte:req.query.endaddtime+" 23:59:59"};
    info.query=query;
    info.limit=req.query.limit*1;
    info.skip=req.query.skip*1;
    console.log(info);
    doc.procedure = "getUser('" + JSON.stringify(info) + "')";
    userMsgHandler.getUser(doc,function (result) {
    res.json(result);
  });
});

/* getRole. */
router.get('/getRole', function (req, res, next) {
    var doc={},sort={},field={};
    if(req.query.roleid !== undefined && req.query.roleid!==""){
        doc.roleid=req.query.roleid*1;
    }
    sort=req.query.sort;
    field=req.query.field;
    sysMsgHandler.getRole(doc,sort,field,function (result) {
        res.json(result);
    });
});

/* addUser. */
router.post('/addUser', function (req, res, next) {
    var doc={};
    doc.username=req.body.username;
    doc.phone=req.body.phone;
    doc.addtime=req.body.addtime;
    doc.password=req.body.password;
    doc.roleinfo=new ObjectID(req.body.roleinfo);
    userMsgHandler.addUser(doc,function (result) {
        res.json(result);
    });
});
module.exports = router;
