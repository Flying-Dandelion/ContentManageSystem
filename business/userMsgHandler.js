/*business 业务层*/
var dbHelper = require("../dbHelper/db.js");
var result = null;

/*exports.insert = function (doc, callback) {
	/**
8	 * @param  {"collection"} 集合名(表名)
	 * @param  {"doc"} 文档，也就是一条或多条数据
	 */
/*	var opts = {
		"collection": "users",
		"doc": doc,
		callback: callback
	};
	
	//insert方法： 插入一条或多条数据。
	dbHelper(opts, "insert");
};*/
exports.userLogin = function(doc,callback){
	/**
	 * @param  {"collection"} 集合名(表名)
	 * @param  {"doc"} 文档，也就是一条或多条数据
	 */
	var opts = {
		"collection": "users",
		"doc": doc,
		callback: callback
	};

	//insert方法： 插入一条或多条数据。
	dbHelper.select(opts);
};
exports.getUser=function(doc,callback){
	var opts = {
		"collection": "users",
        "doc": doc,
		callback: callback
	};
	dbHelper.select(opts);
};