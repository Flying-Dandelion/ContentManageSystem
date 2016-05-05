/*business 业务层*/
var dbHelper = require("../dbHelper/db.js");

/**
 *  获取订单列表
 * @param doc
 * @param callback
 */
exports.getOrder=function(doc,callback){
    var opts = {
        "collection": "orders",
        "doc": doc,
        callback: callback
    };
    dbHelper.select(opts);
};

/**
 * 添加订单
 * @param doc
 * @param callback
 */
exports.addOrder = function (doc, callback) {
    var opts = {
        "collection": "orders",
        "doc": doc,
        callback: callback
    };
    //insert方法： 插入一条或多条数据。
    dbHelper.insert(opts);
};
/**
 * 修改订单
 * @param doc
 * @param callback
 */
exports.updateOrder = function (doc, callback) {
    var opts = {
        "collection": "orders",
        "doc": doc,
        callback: callback
    };
    console.log(doc);
    //insert方法： 插入一条或多条数据。
    dbHelper.update(opts);
};
/**
 * 删除订单
 * @param doc
 * @param callback
 */
exports.deleteOrder = function (doc, callback) {
    var opts = {
        "collection": "orders",
        "doc": doc,
        callback: callback
    };
    console.log(doc);
    dbHelper.delete(opts);
};