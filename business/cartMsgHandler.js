/*business 业务层*/
var dbHelper = require("../dbHelper/db.js");

/**
 *  获取购物车列表
 * @param doc
 * @param callback
 */
exports.getCart=function(doc,callback){
    var opts = {
        "collection": "carts",
        "doc": doc,
        callback: callback
    };
    dbHelper.select(opts);
};

/**
 * 添加到购物车
 * @param doc
 * @param callback
 */
exports.addCart = function (doc, callback) {
    var opts = {
        "collection": "carts",
        "doc": doc,
        callback: callback
    };
    //insert方法： 插入一条或多条数据。
    dbHelper.insert(opts);
};
/**
 * 修改购物车信息
 * @param doc
 * @param callback
 */
exports.updateCart= function (doc, callback) {
    var opts = {
        "collection": "carts",
        "doc": doc,
        callback: callback
    };
    dbHelper.update(opts);
};
/**
 * 删除购物车信息
 * @param doc
 * @param callback
 */
exports.deleteCart = function (doc, callback) {
    var opts = {
        "collection": "carts",
        "doc": doc,
        callback: callback
    };
    console.log(doc);
    dbHelper.delete(opts);
};