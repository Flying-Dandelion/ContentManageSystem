define(function (require, exports, module) {
    'use strict';
    var app = {
            photoCount: 0,
            productNum: [],
            productType:[],
            init: function () {
                app.initData();
                app.typeChange();
                app.proTypeLayer();
                app.saveSort();
                app.fileChange();
                app.save();
            },
            initData: function () {
                $.ajax({
                    type: "GET",
                    url: "/getProductNum",
                    success: function (data) {
                        if (data.length > 0) {
                            app.productNum = data;
                            return;
                        }
                    },
                    error: function (data) {
                        layer.alert("获取商品编号出错！");
                    }
                });
                app.getProductType();
                app.editInit();
            },
            editInit:function(){
                var search = window.location.search.substring(1),
                    keyAry = search.split('&'), type = '', proNum = "", addtime = "";
                if (keyAry.length > 0) {
                    $.each(keyAry, function (key, item) {
                        var itemValue = item.split('=');
                        if (itemValue.length > 1 && itemValue[0] == "type") {
                            type = itemValue[1];
                        }
                        if (itemValue.length > 1 && itemValue[0] == "proNum") {
                            proNum = itemValue[1];
                        }
                        if (itemValue.length > 1 && itemValue[0] == "addtime") {
                            addtime = itemValue[1].substring(0, 10);
                        }
                    });
                    $.ajax({
                        type: "GET",
                        data: {
                            type: type,
                            productNum: proNum,
                            startaddtime: addtime,
                            endaddtime: addtime,
                            limit: 1,
                            skip: 0
                        },
                        url: "/getProduct",
                        success: function (data) {
                            if (data.ok == 1 && data.result.length > 0) {
                                var res = data.result[0];
                                $("#txtProductName").val(res.name);
                                $("#txtProductType").val(res.type);
                                $("#txtProductType").val(res.type);
                                $("#txtPrice").val(res.price);
                                $("#txtInventory").val(res.inventory);
                                $("#txtProductStatus").val(res.status);
                                $("#txtIntroduce").val(res.introduce);
                                $("#txtDescribe").val(res.describe);
                                var photos = res.photo.split('|');
                                app.photoCount = photos.length;
                                for (var i = 0; i < photos.length - 1; i++) {
                                    var html = "<div class='photo-item'><img title='双击删除图片' src='/files/" + photos[i] + "' id='img" + i + "'/></div>";
                                    $("#photoShow").append(html);
                                    $("#img" + i).dblclick(function () {
                                        $(this).parent().remove();
                                        app.photoCount--;
                                    });
                                }
                            }
                        },
                        error: function (data) {

                        }
                    });
                }
            },
            getProductType: function () {
                $.ajax({
                    type: "GET",
                    cache:false,
                    url: "/getProductType",
                    success: function (data) {
                        if (data.ok == 1 && data.result.length > 0) {
                            $("#txtProductType").html("");
                            app.productType=data.result;
                            $.each(data.result, function () {
                                $("#txtProductType").append("<option value='" + this.type + "'>" + this.name + "</option>")
                            });
                            if(data.result.length>0){
                                app.bindProductSort(data.result[0].typeInfo);
                                $("#typeCount").val(data.result[0].num);
                            }
                        }
                    },
                    error: function (data) {
                        layer.alert("获取商品类型出错！");
                    }
                });
            },
            bindProductSort:function(ary){
                $("#txtProductSort").html("");
                if(ary == undefined || ary.length==0){
                    layer.alert("请添加子类别!");
                    return;
                }
                $.each(ary,function(){
                    $("#txtProductSort").append("<option value='" + this.sort + "'>" + this.name + "</option>");
                });
            },
            proTypeLayer:function(){
                $("#btnAddLayer").click(function(){
                    layer.open({
                        type: 1,
                        closeBtn: 1, //不显示关闭按钮
                        shift: 2,
                        area: ['500px', 'auto'],
                        content: $("#layer-addSort")
                    });
                });
            },
            typeChange:function(){
                $("#txtProductType").change(function(){
                    var index = $(this).val();
                    $.each(app.productType,function(){
                        if(this.type==index){
                           app.bindProductSort(this.typeInfo);
                            $("#typeCount").val(this.num);
                        }
                    });
                });
            },
            saveSort:function(){
                $("#btnAddSort").click(function(){
                    if($("#txtSort").val()==""){
                        layer.alert("子类别名称不能为空!");
                        return;
                    }
                    $.ajax({
                        type: "POST",
                        url: "/addSort",
                        data: {
                            type:$("#txtProductType").val(),
                            sortName: $("#txtSort").val(),
                            sort:getString(3, parseInt($("#typeCount").val())+1),
                            count:parseInt($("#typeCount").val())+1
                        },
                        success: function (data) {
                            var res=JSON.parse(data);
                            if (res.ok !== 1) {
                                layer.alert("添加失败!");
                                return;
                            }
                            layer.alert("添加成功", function () {
                                app.getProductType();
                                layer.closeAll();
                            });

                        },
                        error: function (err) {
                            layer.alert("添加出错!");
                            console.log(err);
                        }
                    });
                });
            },
            photoShow: function (obj) {
                var item = app.photoCount;
                var html = "<div class='photo-item'><img title='双击删除图片' name='" + obj.id + "' id='img" + item + "'/></div>";
                $("#photoShow").append(html);
                if (!photoShow("inPhoto" + app.photoCount, "photoShow", "img" + item, 0)) {
                    $("#img" + item).parent().remove();
                } else {
                    app.photoCount++;
                    $("#img" + item).dblclick(function () {
                        $(this).parent().remove();
                        $("#" + this.name).remove();
                        app.photoCount--;
                    });
                }
                $(obj).css("display", "none");
                $(obj).parent().append('<input type="file" id="inPhoto' + app.photoCount + '" name="uploadFile" class="btn btn-sm w100 inPhoto" style="position:absolute;margin-top: -30px;opacity: 0;" />');
                $("#inPhoto" + app.photoCount).change(function () {
                    app.photoShow(this);
                });
            },
            fileChange: function () {
                $("#inPhoto0").change(function () {
                    app.photoShow(this);
                });
            },
            save: function () {
                $("#btnAddProduct").click(function () {
                    if ($("#txtProductSort option").length == 0) {
                        layer.alert("请选择商品子类别，若无，请添加商品子类别!")
                        return;
                    }
                    if (!app.valuable($.serializeJson($("#addProduct input")))) {
                        return;
                    }
                    var file = [],
                        photo = "", fileObj = $(".uploadFile input[type='file']"), proNum = "";
                    for (var item in app.productNum) {
                        if (app.productNum[item]._id.type === $("#txtProductType").val() && app.productNum[item]._id.sort === $("#txtProductSort").val()) {
                            proNum = getString(9, parseInt(app.productNum[item].productNum) + 1);
                        }
                    }
                    if (proNum == "") {
                        proNum = $("#txtProductType").val() + $("#txtProductSort").val()+getString(3, 1);
                    }
                    for (var i = 0; i < fileObj.length - 1; i++) {
                        file[file.length] = fileObj[i].id;
                        photo += proNum +(app.photoCount -i-1) + fileObj[i].files[0].name + "|";
                    }
                    $.ajaxFileUpload({
                        url: '/addProduct',
                        secureuri: false,
                        fileElementId: file,
                        dataType: 'json',
                        data: {
                            name: $("#txtProductName").val(),
                            type: $("#txtProductType").val(),
                            typeName: $("#txtProductType option:selected").text(),
                            sort: $("#txtProductSort").val(),
                            sortName:$("#txtProductSort option:selected").text(),
                            price: $("#txtPrice").val(),
                            inventory: $("#txtInventory").val(),
                            status: $("#txtProductStatus").val(),
                            photo: photo,
                            proNum: proNum,
                            introduce: $("#txtIntroduce").val(),
                            describe: $("#txtDescribe").val()
                        },
                        success: function (data, result) {
                            if (result === "success" && data.ok == 1 && data.n == 1) {
                                layer.alert("保存成功", function () {
                                    window.location.href = "/productMsg/productList";
                                });
                            }
                            else {
                                layer.alert("保存失败");
                            }
                        },
                        error: function (data) {
                            layer.alert("图片保存异常");
                        }
                    });
                });
            },
            valuable: function (data) {
                var flag = true;
                $.each(data, function (key, value) {
                    if (value == "") {
                        layer.alert("表单的输入框不允许为空！");
                        flag = false;
                        return false;
                    }
                });
                return flag;
            }
        }
        ;
    module.exports = app;
})
;