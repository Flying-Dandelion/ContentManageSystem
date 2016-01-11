/*dbHelper 数据库操作*/
var MClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var config = require("./dbConfig.json");

//链接数据库字符串
var uri = "mongodb://" + config.server + ":" + config.port + "/" + config.database;

module.exports.insert=function(opts){
	var insertData = function(db,opts,callback) {
		var collection = opts.collection,
			doc = opts.doc;

		db.collection(collection).insert(doc,function (err,result) {
			if (err) {
				console.log('Error:' + err);
				return;
			}
			callback(result,opts.callback);
		});
	};

	MClient.connect(uri, function(err, db) {
		insertData(db,opts, function(result,callback) {
			callback(result.result);
			db.close();
		});
	});
};
module.exports.delete=function(opts){
	var selectData = function(db,opts,callback) {
		var collection = opts.collection,
			doc = opts.doc;

		db.collection(collection).remove(doc,function (err, result) {
			if (err) {
				console.log('Error:' + err);
				return;
			}
			callback(result);
		});
	};

	MClient.connect(uri, function(err, db) {
		selectData(db,opts, function(result,callback) {
			callback({"ok":1,"result":result});
			db.close();
		});
	});
};
module.exports.select=function(opts){
	var selectData = function(db,opts,callback) {
		var collection = opts.collection,
			doc = opts.doc;

		db.collection(collection).find(doc).toArray(function (err, result) {
			if (err) {
				console.log('Error:' + err);
				return;
			}
			callback(result,opts.callback);
		});
	};

	MClient.connect(uri, function(err, db) {
		selectData(db,opts, function(result,callback) {
			callback({"ok":1,"result":result});
			db.close();
		});
	});
};