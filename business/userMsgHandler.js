/*business 业务层*/
var dbHelper = require("../dbHelper/db.js");
var result = null;

/**
 * 用户登录
 * @param doc
 * @param callback
 */
exports.userLogin = function(doc,callback){
	var opts = {
		"collection": "users",
		"doc": doc,
		callback: callback
	};
	//insert方法： 插入一条或多条数据。
	dbHelper.select(opts);
};

/**
 *  获取用户列表
 * @param doc
 * @param callback
 */
exports.getUser=function(doc,callback){
    var opts = {
        "collection": "users",
        "doc": doc,
        callback: callback
    };
    dbHelper.select(opts);
};

//exports.getUser=function(doc,callback){
//	var opts = {
//		"procedure": doc.procedure,
//		"callback": callback
//	};
//	dbHelper.procedure(opts);
//};

/**
 * 添加用户
 * @param doc
 * @param callback
 */
exports.addUser = function (doc, callback) {
	var opts = {
     "collection": "users",
     "doc": doc,
     callback: callback
 };
    console.log(doc);
 //insert方法： 插入一条或多条数据。
 dbHelper.insert(opts);
 };

/**
 * 删除用户
 * @param doc
 * @param callback
 */
exports.deleteUser = function (doc, callback) {
    var opts = {
        "collection": "users",
        "doc": doc,
        callback: callback
    };
    console.log(doc);
    //insert方法： 插入一条或多条数据。
    dbHelper.delete(opts);
};

/**
 * 修改用户
 * @param doc
 * @param callback
 */
exports.editUser = function (doc, callback) {
    var opts = {
        "collection": "users",
        "doc": doc,
        callback: callback
    };
    console.log(doc);
    //insert方法： 插入一条或多条数据。
    dbHelper.update(opts);
};