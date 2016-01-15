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
        console.log(doc);
		db.collection(collection).insert(doc,function (err,result) {
			if (err) {
				console.log('Error:' + err);
				return;
			}
			callback(result,opts.callback);
		});
	};

	MClient.connect(uri, function(err, db) {
        console.log(opts);
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
			doc = opts.doc,
            field=module.exports.getField(opts.field),
            sort=module.exports.getSort(opts.sort);
        console.log(doc,field,sort);
		db.collection(collection).find(doc,field).sort(sort).toArray(function (err, result) {
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

module.exports.procedure=function(opts){
    var selectData = function(db,opts,callback) {
        var procedure = opts.procedure;
        console.log(procedure);
        db.eval(procedure,function (err, result) {
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
module.exports.getSort=function(sort){
    var newsort={},sortAry=new Array(sort);
    if(sort !== undefined) {
        for (var item in sortAry) {
            newsort[sortAry[item].name] = sortAry[item].type * 1;
        }
    }
    return newsort;
};
module.exports.getField=function(field){
    var newfield={};
    if(field !== undefined) {
        for (var item in field) {
            newfield[field[item]] = 1;
        }
    }
    return newfield;
};