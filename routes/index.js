/*routes as controller*/
var express = require('express');
var userMsgHandler = require("../business/userMsgHandler.js");
var sysMsgHandler = require("../business/sysMsgHandler.js");
var commonHandler = require("../business/commonHandler.js");
var productMsgHandler = require("../business/productMsgHandler.js");
var orderMsgHandler = require("../business/orderMsgHandler.js");
var cartMsgHandler = require("../business/cartMsgHandler.js");
var multiparty = require('multiparty');
var fs = require('fs');
var crypto = require('crypto');
var router = express.Router();

/**
 * GET login page
 */
router.get('/', function (req, res, next) {
    req.session.lastPage = '/';
    res.render("msgView/login", {"title": "登录"});
});

/**
 * GET index page
 */
router.get('/index', commonHandler.requiredAuthentication, function (req, res, next) {
    req.session.lastPage = '/index';
    res.render("msgView/index", {
        "title": "首页",
        menu: "",
        "user": req.session.user.name,
        "role": req.session.user.role
    });
});

/**
 * GET roleMsg page
 */
router.get('/sysMsg/roleMsg', commonHandler.requiredAuthentication, function (req, res, next) {
    req.session.lastPage = '/sysMsg/roleMsg';
    res.render("msgView/sysMsg/roleMsg", {"title": "角色列表", menu: "0", role: req.session.user.role});
});

/**
 * GET userList page
 */
router.get('/userMsg/userList', commonHandler.requiredAuthentication, function (req, res, next) {
    req.session.lastPage = '/userMsg/userList';
    res.render("msgView/userMsg/userList", {"title": "用户列表", menu: "0", role: req.session.user.role});
});

/**
 * GET productList page
 */
router.get('/productMsg/productList', commonHandler.requiredAuthentication, function (req, res, next) {
    req.session.lastPage = '/productMsg/productList';
    res.render("msgView/productMsg/productList", {"title": "商品列表", menu: "1", role: req.session.user.role});
});

/**
 * GET orderList page
 */
router.get('/orderMsg/orderList', commonHandler.requiredAuthentication, function (req, res, next) {
    req.session.lastPage = '/orderMsg/orderList';
    res.render("msgView/orderMsg/orderList", {"title": "订单列表", menu: "2", role: req.session.user.role});
});

/**
 * GET addProduct page
 */
router.get('/productMsg/addProduct', commonHandler.requiredAuthentication, function (req, res, next) {
    req.session.lastPage = '/productMsg/addProduct';
    res.render("msgView/productMsg/addProduct", {"title": "添加商品", menu: "1", role: req.session.user.role});
});
/**
 * GET orderDetail page
 */
router.get('/orderMsg/orderDetail', commonHandler.requiredAuthentication, function (req, res, next) {
    req.session.lastPage = '/orderMsg/orderDetail';
    res.render("msgView/orderMsg/orderDetail", {"title": "订单详情", menu: "2", role: req.session.user.role});
});
/**
 * login
 */
router.post('/login', function (req, res, next) {
    var doc = {}, query = {};
    query.phone = req.body.phone;
    query.password = req.body.password;
    if (req.body.type != undefined) {
        query.role = "3";
    }
    doc.query = query;
    userMsgHandler.userLogin(doc, function (result) {
        var user = {};
        if (result.result.length == 1) {
            req.session.user = {
                name: result.result[0].phone,
                pwd: result.result[0].password,
                role: result.result[0].role,
                userName: result.result[0].name,
                address: result.result[0].address,
                photo: "user.jpg"
            };
            if (req.session.user.role == 3) {
                result.ok = 2;
            }
            //加密
            var cipher = crypto.createCipher('aes-256-cbc', 'InmbuvP6Z8');
            var phone = cipher.update(result.result[0].phone, 'utf8', 'hex');
            phone += cipher.final('hex');
            user.phone = phone;
            var cipher1 = crypto.createCipher('aes-256-cbc', 'InmbuvP6Z8');
            var pwd = cipher1.update(result.result[0].password, 'utf8', 'hex');
            pwd += cipher1.final('hex');
            user.password = pwd;
        }
        res.json({ok: result.ok, result: user});
    });
});

/**
 * userCheck
 */
router.post("/userCheck", function (req, res, next) {
    var doc = {}, query = {}, phone = "", password = "";
    if (req.body.phone != "" && req.body.password != "") {
        var decipher = crypto.createDecipher('aes-256-cbc', 'InmbuvP6Z8');
        phone = decipher.update(req.body.phone, 'hex', 'utf8');
        phone += decipher.final('utf8');
        query.phone = phone;
        var decipher1 = crypto.createDecipher('aes-256-cbc', 'InmbuvP6Z8');
        password = decipher1.update(req.body.password, 'hex', 'utf8');
        password += decipher1.final('utf8');
        query.password = password;
        doc.query = query;
        if (req.session.user != undefined && req.session.user.name == phone && req.session.user.pwd == password) {
            res.json({
                ok: 1, result: {
                    phone: req.body.phone,
                    password: req.body.password
                }
            });
        }
        else {
            userMsgHandler.userLogin(doc, function (result) {
                var user = {};
                if (result.result.length == 1) {
                    req.session.user = {
                        name: result.result[0].phone,
                        pwd: result.result[0].password,
                        role: result.result[0].role
                    };
                    //加密
                    var cipher = crypto.createCipher('aes-256-cbc', 'InmbuvP6Z8');
                    var phone = cipher.update(result.result[0].phone, 'utf8', 'hex');
                    phone += cipher.final('hex');
                    user.phone = phone;
                    var cipher1 = crypto.createCipher('aes-256-cbc', 'InmbuvP6Z8');
                    var pwd = cipher1.update(result.result[0].password, 'utf8', 'hex');
                    pwd += cipher1.final('hex');
                    user.password = pwd;
                }
                res.json({ok: result.ok, result: user});
            });
        }
    }
    else {
        var user = {};
        res.json({ok: 1, result: user});
    }
});

/**
 * getUser
 */
router.get('/getUser', commonHandler.requiredAuthentication, function (req, res, next) {
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
    doc.sort=req.query.sort;
    userMsgHandler.getUser(doc, function (result) {
        res.json(result);
    });
});

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
    if (req.body.phone !== undefined && req.body.phone !== "" && req.body.role != undefined) {
        query.phone = req.body.phone;
        query.role = req.body.role;
        if (req.body.name !== undefined && req.body.name !== "") {
            set.name = req.body.name;
        }
        if (req.body.password !== undefined && req.body.password !== "") {
            set.password = req.body.password;
        }
        if (req.body.role !== undefined && req.body.role !== "") {
            set.role = req.body.role;
        }
        if (req.body.address !== undefined && req.body.address !== "") {
            set.address = req.body.address;
        }
        set.updatetime = commonHandler.getTime();
        switch (req.body.role) {
            case "0":
                set.rolename = "系统管理员";
                break;
            case "1":
                set.rolename = "采购员";
                break;
            case "2":
                set.rolename = "销售员";
                break;
            case "3":
                set.rolename = "普通用户";
                break;
        }
        doc = {
            query: query,
            set: {$set: set}
        };
        userMsgHandler.editUser(doc, function (result) {
            var data= JSON.parse(result);
            if(data.ok==1 && data.n>0) {
               commonHandler.updateSession(req.body.phone, req.body.role,res,req);
            }
            else{
                res.json(data);
            }
        });
    }
    else {
        res.json({ok: 1, n: 0});
    }
});

/**
 * getProduct
 */
router.get('/getProduct', commonHandler.requiredAuthentication, function (req, res, next) {
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
    if (req.query.proSort !== undefined && req.query.proSort !== "") {
        query.sort = req.query.proSort;
    }
    if (req.query.productNum !== undefined && req.query.productNum !== "") {
        query.productNum = req.query.productNum;
    }

    doc.sort = req.query.sort;
    if (req.query.startaddtime != undefined && req.query.endaddtime != undefined) {
        query.addtime = {$gte: req.query.startaddtime + " 00:00:00", $lte: req.query.endaddtime + " 23:59:59"};
    }
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
router.get('/getRole', commonHandler.requiredAuthentication, function (req, res, next) {
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
    if (req.body.role != undefined && req.body.phone != undefined && req.body.phone != "") {
        var doc = {};
        doc.name = req.body.name;
        doc.phone = req.body.phone;
        doc.addtime = commonHandler.getTime();
        doc.updatetime = doc.addtime;
        doc.password = req.body.password === "" ? "111111" : req.body.password;
        doc.role = req.body.role;
        doc.address = req.body.address;
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
        var queryDoc = {
            query: {
                phone: req.body.phone,
                role: req.body.role
            },
            limit: 100,
            skip: 0
        };
        userMsgHandler.getUser(queryDoc, function (result) {
            if (result.ok == 1 && result.result.length == 0) {
                userMsgHandler.addUser(doc, function (result) {
                    res.json(JSON.parse(result));
                });
            } else {
                res.json({ok: -1, n: 0});
            }
        });
    } else {
        res.json({ok: 0, n: 0});
    }
});
/**
 * addSort
 */
router.post('/addSort', function (req, res, next) {
    var doc = {}, query = {}, set = {}, push = {};
    if (req.body.type !== undefined && req.body.type !== "") {
        query.type = req.body.type;
    }
    else {
        res.json({ok: 1, n: 0});
    }
    push.name = req.body.sortName;
    push.sort = req.body.sort;
    set.num = req.body.count;
    doc = {
        query: query,
        set: {
            $set: set,
            $push: {
                typeInfo: push
            }
        }
    };
    productMsgHandler.addSort(doc, function (result) {
        res.json(result);
    });
});
/**
 * getProductType
 */
router.get('/getProductType', commonHandler.requiredAuthentication, function (req, res, next) {
    var doc = {}, query = {};
    if (req.query.type !== undefined && req.query.type !== "") {
        query.type = req.query.type;
    }
    doc.query = query;
    productMsgHandler.getProductType(doc, function (result) {
        res.json(result);
    });
});

/**
 * getProductNum
 */
router.get('/getProductNum', commonHandler.requiredAuthentication, function (req, res, next) {
    var doc = {};
    doc.$group = {
        _id: {
            type: "$type",
            sort: "$sort"
        },
        productNum: {
            $max: "$productNum"
        }
    };
    productMsgHandler.getProductNum(doc, function (result) {
        res.json(result);
    });
});
/**
 * addProduct
 */
router.post('/addProduct', function (req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/files/'});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        console.log(fields, files);
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            if (files.uploadFile !== undefined) {
                for (var i = 0; i < files.uploadFile.length; i++) {
                    var inputFile = files.uploadFile[i];
                    var uploadedPath = inputFile.path;
                    var dstPath = './public/files/' + fields.proNum + (parseInt(fields.edit[0]) + i) + inputFile.originalFilename;
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
        var doc = {};
        doc.name = fields.name[0];
        doc.type = fields.type[0];
        doc.typeName = fields.typeName[0];
        doc.sort = fields.sort[0];
        doc.sortName = fields.sortName[0];
        doc.updatetime = doc.addtime;
        doc.price = fields.price[0];
        doc.inventory = fields.inventory[0];
        doc.status = fields.status[0];
        doc.introduce = fields.introduce[0];
        doc.describe = fields.describe[0];
        doc.productNum = fields.proNum[0];
        doc.photo = fields.photo[0];
        doc.photoOne = fields.photoOne[0];
        doc.photoDetail = fields.photoDetail[0];
        console.log(doc);
        if (fields.edit[0] != undefined && fields.edit[0] == "0") {
            doc.addtime = commonHandler.getTime();
            doc.sales = "0";
            productMsgHandler.addProduct(doc, function (result) {
                res.send(result);
            });
        } else {
            var query = {};
            doc.updatetime = commonHandler.getTime();
            query.productNum = doc.productNum;
            var newDoc = {
                query: query,
                set: {$set: doc}
            };
            productMsgHandler.updateProduct(newDoc, function (result) {
                res.send(result);
            });
        }
    });
});

/**
 * getCart
 */
router.get('/getCart', commonHandler.requiredAuthentication, function (req, res, next) {
    var doc = {}, query = {};
    if (req.query.proNumList !== undefined && req.query.proNumList !== "") {
        query = {
            "proInfo.productNum": {
                $in: req.query.proNumList
            }
        };
    }
    query.userPhone = req.session.user.name;
    query.isDelete = "0";

    doc.query = query;
    cartMsgHandler.getCart(doc, function (result) {
        res.send(result);
    });
});

/**
 * addCart
 */

router.post('/addCart', function (req, res, next) {
    var doc = {}, query = {};
    query = {
        "proInfo.productNum": req.body.productNum,
        isDelete: "0"
    };
    query.userPhone = req.session.user.name;
    doc.query = query;
    cartMsgHandler.getCart(doc, function (result) {
        if (result.ok == 1 && result.result.length > 0) {
            var buyNum = result.result[0].proInfo.buyNum,
                editQuery = {
                    userPhone: req.session.user.name,
                    "proInfo.productNum": req.body.productNum,
                    isDelete: "0"
                };
            var newDoc = {
                query: editQuery,
                set: {
                    $set: {
                        updatetime: commonHandler.getTime(),
                        'proInfo.buyNum': parseInt(buyNum) + parseInt(req.body.buyNum)
                    }
                }
            };
            cartMsgHandler.updateCart(newDoc, function (result) {
                res.send(result);
            });
        } else {
            var newDoc = {
                userPhone: req.session.user.name,
                proInfo: {
                    photo: req.body.photo,
                    name: req.body.name,
                    price: req.body.price,
                    productNum: req.body.productNum,
                    buyNum: req.body.buyNum,
                    addtime: commonHandler.getTime()
                },
                addtime: commonHandler.getTime(),
                isDelete: "0"
            };
            cartMsgHandler.addCart(newDoc, function (result) {
                res.send(result);
            });
        }
    });
});


//router.post('/addCart', function (req, res, next) {
//    var doc = {}, query = {};
//    if (Uname !== undefined && Uname !== "") {
//        query.userPhone = Uname;
//        doc.query = query;
//        cartMsgHandler.getCart(doc, function (result) {
//            if (result.ok == 1 && result.result.length > 0) {
//                var newDoc = {}, isEqualNum = 0, buyNum = 0;
//                var data = result.result[0];
//                query.userPhone = Uname;
//                for (var i = 0; i < data.proInfo.length; i++) {
//                    if (data.proInfo[i].productNum == req.body.productNum) {
//                        isEqualNum = 1;
//                        buyNum = data.proInfo[i].buyNum;
//                    }
//                }
//                if (isEqualNum == 1) {
//                    query = {
//                        userPhone: Uname,
//                        "proInfo.productNum": req.body.productNum
//                    };
//                    newDoc = {
//                        query: query,
//                        set: {
//                            $set: {
//                                updatetime: commonHandler.getTime(),
//                                'proInfo.$.buyNum': parseInt(buyNum) + parseInt(req.body.buyNum)
//                            }
//                        }
//                    };
//                }
//                else {
//                    var push = {
//                        photo: req.body.photo,
//                        name: req.body.name,
//                        price: req.body.price,
//                        productNum: req.body.productNum,
//                        buyNum: parseInt(req.body.buyNum),
//                        addtime: commonHandler.getTime()
//                    };
//                    doc.updatetime = commonHandler.getTime();
//                    newDoc = {
//                        query: query,
//                        set: {
//                            $set: doc,
//                            $push: {
//                                proInfo: push
//                            }
//                        }
//                    };
//                }
//                cartMsgHandler.updateCart(newDoc, function (result) {
//                    res.send(result);
//                });
//            }
//            else {
//                var newDoc = {
//                    userPhone: Uname,
//                    proInfo: [{
//                        photo: req.body.photo,
//                        name: req.body.name,
//                        price: req.body.price,
//                        productNum: req.body.productNum,
//                        buyNum: req.body.buyNum,
//                        addtime: commonHandler.getTime()
//                    }],
//                    addtime: commonHandler.getTime()
//                };
//                cartMsgHandler.addCart(newDoc, function (result) {
//                    res.send(result);
//                });
//            }
//        });
//    }
//    else {
//        res.json({ok: 2, n: 0});
//    }
//});

/**
 * delCart
 */
router.post('/delCart', function (req, res, next) {
    var newDoc = {
        query: {
            userPhone: req.session.user.name,
            "proInfo.productNum": {
                $in: JSON.parse(req.body.data)
            },
            isDelete: "0"
        },
        set: {
            $set: {
                isDelete: "1",
                updatetime: commonHandler.getTime()
            }
        }
    };
    cartMsgHandler.updateCart(newDoc, function (result) {
        res.send(result);
    });
});

/**
 * getOrder
 */
router.get('/getOrder', commonHandler.requiredAuthentication, function (req, res, next) {
    var doc = {}, query = {};
    if (req.query.userPhone !== undefined && req.query.userPhone !== "") {
        query.userPhone = req.query.userPhone;
    }
    if (req.query.orderNum !== undefined && req.query.orderNum !== "") {
        query.orderNum = req.query.orderNum;
    }
    if (req.query.status !== undefined && req.query.status !== "") {
        query.status = req.query.status;
    }
    doc.sort = req.query.sort;
    if (req.query.startaddtime != undefined && req.query.endaddtime != undefined) {
        query.addtime = {$gte: req.query.startaddtime + " 00:00:00", $lte: req.query.endaddtime + " 23:59:59"};
    }
    if (req.session.user.role == "3") {
        query.userPhone = req.session.user.name;
    }
    doc.query = query;
    doc.limit = req.query.limit * 1;
    doc.skip = req.query.skip * 1;
    orderMsgHandler.getOrder(doc, function (result) {
        res.json(result);
    });
});

/**
 * addOrder
 */
router.post('/addOrder', function (req, res, next) {
    var data = JSON.parse(req.body.data), proNumList = [], query = {}, upDoc = {};
    var doc = {
        userPhone: req.session.user.name,
        orderNum: commonHandler.getTimeString() + req.session.user.name,
        proInfo: data.proInfo,
        address: req.session.user.address,
        telephone: req.session.user.name,
        status: "2",
        summary:data.summary,
        uName:data.uName,
        addtime: commonHandler.getTime()
    };
    for (var i = 0; i < data.proInfo.length; i++) {
        proNumList.push(data.proInfo[i].productNum);
    }
    var query = {
        userPhone: req.session.user.name,
        "proInfo.productNum": {
            $in: proNumList
        }
    };
    orderMsgHandler.addOrder(doc, function (result) {
        var resultJSON = JSON.parse(result);
        if (resultJSON.ok == 1 && resultJSON.n > 0 && data.type=="1") {
            upDoc.updatetime = commonHandler.getTime();
            upDoc.isDelete = "1";
            var newDoc = {
                query: query,
                set: {$set: upDoc}
            };
            cartMsgHandler.updateCart(newDoc, function (result) {
                res.send(result);
            });
        } else {
            res.send(result);
        }
    });
});

/**
 * setOrderStatus
 */
router.post('/setOrderStatus', function (req, res, next) {
    var editQuery = {
        orderNum: req.body.orderNum
    };
    var newDoc = {
        query: editQuery,
        set: {
            $set: {
                updatetime: commonHandler.getTime(),
                status: req.body.status
            }
        }
    };
    orderMsgHandler.updateOrder(newDoc, function (result) {
        res.send(result);
    });

});

module.exports = router;

