define(function (require, exports, module) {
    'use strict';
    var app = {
        order:new Vue({
            el:"#orderInfo",
            data:{
                items:[]
            }
        }),
            init: function () {
                app.editInit();
            },
            editInit:function(){
                var search = window.location.search.substring(1),
                    keyAry = search.split('&'), orderNum="";
                if (keyAry.length > 0) {
                    $.each(keyAry, function (key, item) {
                        var itemValue = item.split('=');
                        if (itemValue.length > 1 && itemValue[0] == "key") {
                            orderNum = itemValue[1];
                        }
                    });
                    $.ajax({
                        type: "GET",
                        data: {
                            orderNum: orderNum
                        },
                        url: "/getOrder",
                        success: function (data) {
                            if(data.ok==1 && data.result.length>0) {
                                app.order.items = data.result[0];
                            }
                            else{
                                layer.alert("获取订单出错");
                            }
                        }
                    });
                }
            }
        }
        ;
    module.exports = app;
})
;