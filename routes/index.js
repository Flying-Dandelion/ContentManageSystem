/*routes as controller*/
var express = require('express');
var userMsgHandler = require("../business/userMsgHandler.js");
var sysMsgHandler = require("../business/sysMsgHandler.js");
var commonHandler = require("../business/commonHandler.js");
var productMsgHandler = require("../business/productMsgHandler.js");
var multiparty = require('multiparty');
var fs = require('fs');
var router = express.Router();

/**
 * GET login page
 */
router.get('/', function (req, res, next) {
    res.render("login", {"title": "登录"});
});

/**
 * GET index page
 */
router.get('/index', function (req, res, next) {
    res.render("index", {"title": "首页", menu: ""});
});

/**
 * GET roleMsg page
 */
router.get('/sysMsg/roleMsg', function (req, res, next) {
    res.render("sysMsg/roleMsg", {"title": "角色列表", menu: "0"});
});

/**
 * GET userList page
 */
router.get('/userMsg/userList', function (req, res, next) {
    res.render("userMsg/userList", {"title": "用户列表", menu: "1"});
});

/**
 * GET productList page
 */
router.get('/productMsg/productList', function (req, res, next) {
    res.render("productMsg/productList", {"title": "商品列表", menu: "2"});
});

/**
 * GET addProduct page
 */
router.get('/productMsg/addProduct', function (req, res, next) {
    res.render("productMsg/addProduct", {"title": "添加商品", menu: "2"});
});

/**
 * login
 */
router.post('/login', function (req, res, next) {
    var doc = {}, query = {};
    query.phone = req.body.phone;
    query.password = req.body.password;
    doc.query = query;
    userMsgHandler.userLogin(doc, function (result) {
        res.json(result);
    });
});

/**
 * getUser
 */
router.get('/getUser', function (req, res, next) {
    var doc = {}, query = {};
    if (req.query.phone !== undefined && req.query.phone !== "") {
        query.phone = req.query.phone;
    }
    if (req.query.name !== undefined && req.query.name !== "") {
        query.name = req.query.name;
    }
    if (req.query.role !== undefined && req.query.role !== "") {
        query.role = req.query.role;
    }
    query.addtime = {$gte: req.query.startaddtime + " 00:00:00", $lte: req.query.endaddtime + " 23:59:59"};
    doc.query = query;
    doc.limit = req.query.limit * 1;
    doc.skip = req.query.skip * 1;
    userMsgHandler.getUser(doc, function (result) {
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
router.post('/deleteUser', function (req, res, next) {
    var doc = {};
    if (req.body.phone !== undefined && req.query.phone !== "") {
        doc.phone = req.body.phone;
    }
    userMsgHandler.deleteUser(doc, function (result) {
        res.json(result);
    });
});

/**
 * editUser
 */
router.post('/editUser', function (req, res, next) {
    var doc = {}, query = {}, set = {};
    if (req.body.phone !== undefined && req.query.phone !== "") {
        query.phone = req.body.phone;
    }
    else {
        res.json({ok: 1, n: 0});
    }
    set.name = req.body.name;
    set.updatetime = commonHandler.getTime();
    set.password = req.body.password === "" ? "111111" : req.body.password;
    set.role = req.body.role;
    doc = {
        query: query,
        set: {$set: set}
    };
    userMsgHandler.editUser(doc, function (result) {
        res.json(result);
    });
});

/**
 * getProduct
 */
router.get('/getProduct', function (req, res, next) {
    var doc = {}, query = {};
    if (req.query.name !== undefined && req.query.name !== "") {
        query.name = req.query.name;
    }
    if (req.query.type !== undefined && req.query.type !== "") {
        query.type = req.query.type;
    }
    if (req.query.status !== undefined && req.query.status !== "") {
        query.status = req.query.status;
    }
    if (req.query.key !== undefined && req.query.key !== "") {
        query.key = req.query.key;
    }
    query.addtime = {$gte: req.query.startaddtime + " 00:00:00", $lte: req.query.endaddtime + " 23:59:59"};
    doc.query = query;
    doc.limit = req.query.limit * 1;
    doc.skip = req.query.skip * 1;
    productMsgHandler.getProduct(doc, function (result) {
        res.json(result);
    });
});

/**
 * getRole
 */
router.get('/getRole', function (req, res, next) {
    var doc = {};
    if (req.query.role !== undefined && req.query.role !== "") {
        doc.query.role = req.query.role * 1;
    }
    doc.sort = req.query.sort;
    doc.field = req.query.field;
    sysMsgHandler.getRole(doc, function (result) {
        res.json(result);
    });
});

/**
 * addUser
 */
router.post('/addUser', function (req, res, next) {
    var doc = {};
    doc.name = req.body.name;
    doc.phone = req.body.phone;
    doc.addtime = commonHandler.getTime();
    doc.updatetime = doc.addtime;
    doc.password = req.body.password === "" ? "111111" : req.body.password;
    doc.role = req.body.role;
    switch (req.body.role) {
        case "0":
            doc.rolename = "系统管理员";
            break;
        case "1":
            doc.rolename = "采购员";
            break;
        case "2":
            doc.rolename = "销售员";
            break;
        case "3":
            doc.rolename = "普通用户";
            break;
        default :
            doc.rolename = "普通用户";
            break;
    }
    userMsgHandler.addUser(doc, function (result) {
        res.json(result);
    });
});

/**
 * getProductType
 */
router.get('/getProductType', function (req, res, next) {
    var doc = {};
    productMsgHandler.getProductType(doc, function (result) {
        res.json(result);
    });
});

/**
 * getProductNum
 */
router.get('/getProductNum', function (req, res, next) {
    var doc = {};
    doc.$group={
        _id:"$type",
        productNum: {
            $max:"$productNum"
        }
    };
    productMsgHandler.getProductNum(doc, function (result) {
        res.json(result);
    });

    //var queryDoc = {}, query = {}, doc = {};
    //query.type = req.body.type;
    //queryDoc.query = query;
    //queryDoc.limit = 1;
    //queryDoc.skip = 0;
    //queryDoc.sort={ name:"productNum",type:1};
    //queryDoc.field=["productNum"];
    //doc.name = req.body.name;
    //doc.type = req.body.type;
    //doc.typeName=req.body.typeName;
    //doc.addtime = commonHandler.getTime();
    //doc.updatetime = doc.addtime;
    //doc.price = req.body.price;
    //doc.inventory = req.body.inventory;
    //doc.status=req.body.status;
    //doc.introduce=req.body.introduce;
    //doc.describe=req.body.describe;
    //productMsgHandler.getProduct(queryDoc, function (result) {
    //    doc.productNum= result.result.length==0?"000001":exports.getString(6,result.result.productNum+1);
    //    if(result.ok == 1){
    //        var photoAry=req.body.photo.split('|');
    //        for(var item in photoAry){
    //            photoAry[item]=doc.type+doc.productNum+photoAry[item];
    //        }
    //        doc.photo=photoAry.toString();
    //        productMsgHandler.addProduct(doc, function (result) {
    //            res.json(result);
    //        });
    //    }
    //    res.json({ok:0,result:"添加出错"});
    //});

});
/**
 * addProduct
 */
router.post('/addProduct', function (req, res, next) {
    var  doc = {};
    doc.name = req.body.name;
    doc.type = req.body.type;
    doc.typeName=req.body.typeName;
    doc.addtime = commonHandler.getTime();
    doc.updatetime = doc.addtime;
    doc.price = req.body.price;
    doc.inventory = req.body.inventory;
    doc.status=req.body.status;
    doc.introduce=req.body.introduce;
    doc.describe=req.body.describe;
    doc.productNum=req.body.proNum;
    productMsgHandler.addProduct(doc, function (result) {
        res.json(result);
    });
});

/* 上传图片 */
router.post('/file/uploading', function (req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/files/'});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            if(files.uploadFile!==undefined) {
                for (var i = 0; i < files.uploadFile.length; i++) {
                    var inputFile = files.uploadFile[i];
                    var uploadedPath = inputFile.path;
                    var dstPath = './public/files/' + fields.proNum + i + inputFile.originalFilename;
                    //重命名为真实文件名
                    console.log(uploadedPath, dstPath);

                    fs.rename(uploadedPath, dstPath, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('rename ok');
                        }
                    });
                }
            }
        }
    });
    return;
});

module.exports = router;

