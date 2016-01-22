/*routes as controller*/
var express = require('express');
var userMsgHandler = require("../business/userMsgHandler.js");
var sysMsgHandler = require("../business/sysMsgHandler.js");
var commonHandler = require("../business/commonHandler.js");
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

/**
 * GET login page
 */
router.get('/', function (req, res, next) {
    res.render("login",{"title":"登录"});
});

/**
 * GET index page
 */
router.get('/index', function (req, res, next) {
    res.render("index",{"title":"首页",menu:""});
});

/**
 * GET userList page
 */
router.get('/userMsg/userList', function (req, res, next) {
    res.render("userMsg/userList",{"title":"用户列表",menu:"1"});
});

/**
 * GET userList page
 */
router.get('/productMsg/productList', function (req, res, next) {
    res.render("productMsg/productList",{"title":"商品列表",menu:"1"});
});

/**
 * GET userList page
 */
router.get('/sysMsg/roleMsg', function (req, res, next) {
    res.render("sysMsg/roleMsg",{"title":"角色列表",menu:"0"});
});

/**
 * login
 */
router.post('/login', function (req, res, next) {
  var doc = {
    "phone": req.body.phone,
    "password": req.body.password
  };
    userMsgHandler.userLogin(doc,function(result){
    res.json(result);
  });
});

/**
 * getUser
 */
router.get('/getUser', function (req, res, next) {
    var doc={},query={};
    if(req.query.phone !== undefined && req.query.phone !== ""){
        query.phone=req.query.phone;
    }
    if(req.query.name !== undefined && req.query.name!==""){
        query.name=req.query.name;
    }
    if(req.query.role !== undefined && req.query.role !== ""){
        query.role=req.query.role;
    }
    query.addtime={$gte:req.query.startaddtime+" 00:00:00",$lte:req.query.endaddtime+" 23:59:59"};
    doc.query=query;
    doc.limit=req.query.limit*1;
    doc.skip=req.query.skip*1;
    userMsgHandler.getUser(doc,function (result) {
        res.json(result);
    });
});
//router.get('/getUser', function (req, res, next) {
//    var doc={},info={},query={};
//    if(req.query.phone !== undefined && req.query.phone !== ""){
//        query.phone=req.query.phone;
//    }
//    if(req.query.username !== undefined && req.query.username!==""){
//        query.username=req.query.username;
//    }
//    if(req.query.roleid !== undefined && req.query.roleid !== ""){
//        query.roleinfo='ObjectID("'+req.query.roleid+'")';
//    }
//    query.addtime={$gte:req.query.startaddtime+" 00:00:00",$lte:req.query.endaddtime+" 23:59:59"};
//    info.query=query;
//    info.limit=req.query.limit*1;
//    info.skip=req.query.skip*1;
//    console.log(info);
//    doc.procedure = "getUser('" + JSON.stringify(info) + "')";
//    userMsgHandler.getUser(doc,function (result) {
//    res.json(result);
//  });
//});

/**
 * deleteUser
 */
router.post('/deleteUser',function(req,res,next){
   var doc={};
    if(req.body.phone !== undefined && req.query.phone !== ""){
        doc.phone=req.body.phone;
    }
    userMsgHandler.deleteUser(doc,function (result) {
        res.json(result);
    });
});

/**
 * editUser
 */
router.post('/editUser',function(req,res,next){
    var doc={},query={},set={};
    if(req.body.phone !== undefined && req.query.phone !== ""){
        query.phone=req.body.phone;
    }
    else{
        res.json({ok:1,n:0});
    }
    set.name=req.body.name;
    set.updatetime=commonHandler.getTime();
    set.password=req.body.password===""?"111111":req.body.password;
    set.role=req.body.role;
    doc={
        query:query,
        set:{$set: set}
    };
    userMsgHandler.editUser(doc,function (result) {
        res.json(result);
    });
});

/**
 * getProduct
 */
router.get('/getProduct', function (req, res, next) {
    var doc={},query={};
    if(req.query.phone !== undefined && req.query.phone !== ""){
        query.phone=req.query.phone;
    }
    if(req.query.name !== undefined && req.query.name!==""){
        query.name=req.query.name;
    }
    if(req.query.role !== undefined && req.query.role !== ""){
        query.role='ObjectID("'+req.query.role+'")';
    }
    query.addtime={$gte:req.query.startaddtime+" 00:00:00",$lte:req.query.endaddtime+" 23:59:59"};
    doc.query=query;
    doc.limit=req.query.limit*1;
    doc.skip=req.query.skip*1;
    userMsgHandler.getUser(doc,function (result) {
        res.json(result);
    });
});

/**
 * getRole
 */
router.get('/getRole', function (req, res, next) {
    var doc={};
    if(req.query.role !== undefined && req.query.role!==""){
        doc.query.role=req.query.role*1;
    }
    doc.sort=req.query.sort;
    doc.field=req.query.field;
    console.log(doc);
    sysMsgHandler.getRole(doc,function (result) {
        res.json(result);
    });
});

/**
 * addUser
 */
router.post('/addUser', function (req, res, next) {
    var doc={};
    doc.name=req.body.name;
    doc.phone=req.body.phone;
    doc.addtime= commonHandler.getTime();
    doc.updatetime=doc.addtime;
    doc.password=req.body.password===""?"111111":req.body.password;
    doc.role=req.body.role;
    switch (req.body.role){
        case "0":
            doc.rolename="系统管理员";
            break;
        case "1":
            doc.rolename="采购员";
            break;
        case "2":
            doc.rolename="销售员";
            break;
        case "3":
            doc.rolename="普通用户";
            break;
        default :
            doc.rolename="普通用户";
            break;
    }
    userMsgHandler.addUser(doc,function (result) {
        res.json(result);
    });
});


module.exports = router;

