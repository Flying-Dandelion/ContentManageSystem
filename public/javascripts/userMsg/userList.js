define(function (require, exports, module) {
    'use strict';

    var app = {
        init:  function () {
            app.query();
            app.addRole();
            $("#query").click();
        },
        query:function(){
            $("#query").click(function(){
                $.ajax({
                    type: "GET",
                    url: "/getUser",
                    data:{
                        username: $("#txtUserName").val(),
                        phone: $("#txtPhone").val()
                    },
                    success:function(res){
                        if (res.ok !== 1) return;
                        $("#userList").html($("#template").render(res.result));
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            });
        },
        addRole:function(){
            $("#addRole").click(function(){
                layer.open({
                    type: 1,
                    closeBtn: 1, //不显示关闭按钮
                    shift: 2,
                    shadeClose: true, //开启遮罩关闭
                    content: $("layer-addRole")
                });
            });
        }
    };

    module.exports = app;
});