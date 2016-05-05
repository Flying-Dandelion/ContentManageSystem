/*routes ������controller*/
var express = require('express');
var nameBusiness = require("../business/userMsgHandler.js");
var commonHandler = require("../business/commonHandler.js");

var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
  req.session.lastPage = '/users/';
  res.render("viewUsers/login",{title:"登录"});
});
/**
 * GET register page
 */
router.get('/register', function (req, res, next) {
  req.session.lastPage = '/register';
  res.render("viewUsers/register", {"title": "注册"});
});
/**
 * GET register page
 */
router.get('/setInfo', function (req, res, next) {
  req.session.lastPage = '/setInfo';
  res.render("viewUsers/setInfo", {"title": "账户信息设置",phone:req.query.phone,role:req.query.role});
});

/* GET home page. */
router.get('/index', commonHandler.requiredAuthentication,function (req, res, next) {
  req.session.lastPage = '/users/index';
  res.render("viewUsers/index",{title:"首页",userInfo:req.session.user});
});

/* GET cartList page. */
router.get('/cartList',commonHandler.requiredAuthentication, function (req, res, next) {
  req.session.lastPage = '/users/cartList';
  res.render("viewUsers/cartList",{title:"购物车",userInfo:req.session.user});
});

/**
 * GET productList page
 */
router.get('/productMsg/productList',commonHandler.requiredAuthentication, function (req, res, next) {
  req.session.lastPage = '/users/productMsg/productList';
  res.render("viewUsers/productMsg/productList", {"title": "商品列表",userInfo:req.session.user});
});
/**
 * GET productDetail page
 */
router.get('/productMsg/productDetail',commonHandler.requiredAuthentication, function (req, res, next) {
  req.session.lastPage = '/users/productMsg/productDetail';
  res.render("viewUsers/productMsg/productDetail", {"title": "商品详情",userInfo:req.session.user});
});
/**
 * GET createOrder page
 */
router.get('/orderMsg/createOrder',commonHandler.requiredAuthentication, function (req, res, next) {
  req.session.lastPage = '/users/orderMsg/createOrder';
  res.render("viewUsers/orderMsg/createOrder", {"title": "生成订单",userInfo:req.session.user});
});

/* GET orderList page. */
router.get('/orderList',commonHandler.requiredAuthentication, function (req, res, next) {
  req.session.lastPage = '/users/orderList';
  res.render("viewUsers/orderMsg/orderList",{title:"我的订单",userInfo:req.session.user});
});

/* GET orderList page. */
router.get('/userDetail',commonHandler.requiredAuthentication, function (req, res, next) {
  req.session.lastPage = '/users/userDetail';
  res.render("viewUsers/userMsg/userDetail",{title:"账户设置",userInfo:req.session.user});
});

module.exports = router;
