define(function (require, exports, module) {
    'use strict';

    var utils = require("utils");
    var ajax = utils.ajax,
        getOne = utils.getOne,
        getAll=utils.getAll;

    var app = {
        init:  function () {
            app.query();
            $("#query").click();
        },
        query:function(){
            $("#query").click(function(){
                var data= {
                    username: $("#txtUserName").val(),
                    phone: $("#txtPhone").val()
                };
                $.ajax({
                    type: "GET",
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