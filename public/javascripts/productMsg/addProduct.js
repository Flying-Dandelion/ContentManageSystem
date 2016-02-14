define(function (require, exports, module) {
    'use strict';
    var app = {
            photoCount: 0,
            infileCount: 0,
            productNum:[],
            init: function () {
                app.initData();
                app.fileChange();
                app.save();
            },
            initData: function () {
                var search = window.location.search.substring(1),
                    keyAry = search.split('&'), type = '',proNum="",addtime="";
                $.each(keyAry, function (key, item) {
                    var itemValue = item.split('=');
                    if (itemValue.length > 1 && itemValue[0] == "type") {
                        type = itemValue[1];
                    }
                    if (itemValue.length > 1 && itemValue[0] == "proNum") {
                        proNum = itemValue[1];
                    }
                    if (itemValue.length > 1 && itemValue[0] == "addtime") {
                        addtime = itemValue[1].substring(0,10);
                    }
                });
                $.ajax({
                    type: "GET",
                    url: "/getProductType",
                    success: function (data) {
                        if(data.ok==1 && data.result.length>0){
                            $.each(data.result,function(){
                                $("#txtProductType").append("<option value='"+this.type+"'>"+this.name+"</option>")
                            });
                            return;
                        }
                        layer.alert("未获取到商品类型！");
                    },
                    error: function (data) {
                        layer.alert("获取商品类型出错！");
                    }
                });
                $.ajax({
                    type: "GET",
                    url: "/getProductNum",
                    success: function (data) {
                        if(data.length>0){
                            app.productNum=data;
                            return;
                        }
                        layer.alert("未获取到商品编号！");
                    },
                    error: function (data) {
                        layer.alert("获取商品编号出错！");
                    }
                });
                $.ajax({
                    type: "GET",
                    data: {
                        type: type,
                        productNum:proNum,
                        startaddtime:addtime,
                        endaddtime:addtime,
                        limit: 1,
                        skip: 0
                    },
                    url: "/getProduct",
                    success: function (data) {
                        if(data.ok==1 && data.result.length>0){
                            var res=data.result[0];
                            $("#txtProductName").val(res.name);
                            $("#txtProductType").val(res.type);
                            $("#txtPrice").val(res.price);
                            $("#txtInventory").val(res.inventory);
                            $("#txtProductStatus").val(res.status);
                            $("#txtIntroduce").val(res.introduce);
                            $("#txtDescribe").val(res.describe);
                        }
                    },
                    error: function (data) {

                    }
                })
            },
            photoShow: function (obj) {
                for (var i = 0; i < $(obj)[0].files.length; i++) {
                    var item = app.photoCount;
                    var html = "<div class='photo-item'><img title='双击删除图片' id='img" + item + "'/></div>";
                    $("#photoShow").append(html);
                    if (!photoShow("inPhoto" + app.infileCount, "photoShow", "img" + item, i)) {
                        $("#img" + item).parent().remove();
                    } else {
                        app.photoCount++;
                        $("#img" + item).dblclick(function () {
                            $(this).parent().remove();
                        });
                    }
                }
                app.infileCount++;
                $(obj).css("display", "none");
                $(obj).parent().append('<input type="file" id="inPhoto' + app.infileCount + '" name="uploadFile" class="btn btn-sm w100 inPhoto" style="position:absolute;margin-top: -30px;opacity: 0;" multiple />');
                $("#inPhoto" + app.infileCount).change(function () {
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
                    if(!app.valuable($.serializeJson($("#addProduct input")))){
                        return;
                    }
                    var file=[],
                        photo="",photoCount= 0,fileObj=$(".uploadFile input[type='file']"),proNum="";
                    for(var item in app.productNum){
                        if(app.productNum[item]._id===$("#txtProductType").val()){
                            proNum=app.productNum[item]._id+getString(6,parseInt(app.productNum[item].productNum)+1);
                        }
                    }
                    for(var i=0; i<fileObj.length-1;i++){
                        file[file.length]=fileObj[i].id;
                        for(var j=0;j<fileObj[i].files.length;j++){
                            photo+=proNum+photoCount+fileObj[i].files[j].name+"|";
                            photoCount++;
                        }
                    }
                    $.ajaxFileUpload({
                        url: '/addProduct',
                        secureuri: false,
                        fileElementId: file,
                        dataType : 'json',
                        data:{
                        name:$("#txtProductName").val(),
                            type:$("#txtProductType").val(),
                            typeName:$("#txtProductType option:selected").text(),
                            price:$("#txtPrice").val(),
                            inventory:$("#txtInventory").val(),
                            status:$("#txtProductStatus").val(),
                            photo:photo,
                            proNum:proNum,
                            introduce:$("#txtIntroduce").val(),
                            describe:$("#txtDescribe").val()
                        },
                        success: function (data,result) {
                            if(result==="success" && data.ok==1 && data.n==1){
                                layer.alert("保存成功",function(){
                                    window.location.href="/productMsg/productList";
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
            valuable:function(data){
                var flag=true;
                $.each(data, function(key, value) {
                    if(value==""){
                        layer.alert("表单的输入框不允许为空！");
                        flag=false;
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