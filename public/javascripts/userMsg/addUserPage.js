define(function (require, exports, module) {
    'use strict';
    var app = {
        init:  function () {
            app.query();
        },
        query:function(){
            $("#addUser").click(function(){
                var data= {
                    username: $("#txtUserName").val(),
                    phone: $("#txtPhone").val()
                };
                $.ajax({
                    type: "POST",
                    url: "/getUser",
                    data:data,
                    success:function(res){
                        if (res.ok !== 1) return;
                        $("#userList").html($("#template").render(res.result));
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            });
        }
    };

    module.exports = app;
});