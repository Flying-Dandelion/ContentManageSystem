define(function (require, exports, module) {
    'use strict';
    var app = {
        init: function () {
            app.changeMenu();
            app.userCheck();
            app.exit();
        },
        changeMenu: function () {
            var menuIndex = $("#menu").attr("name");
            $("#menu li.active").removeClass("active");
            $($("#menu li")[menuIndex]).addClass("active");
        },
        setCookie: function (name, value,exdays) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + exdays * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

            if (arr = document.cookie.match(reg))

                return unescape(arr[2]);
            else
                return null;
        },
        delCookie: function (name) {
            app.setCookie(name, "", -1);
        },
        userCheck: function () {
            $.ajax({
                type: "POST",
                url: "/userCheck",
                data: {
                    phone: app.getCookie("phone") == null ? "" : app.getCookie("phone"),
                    password: app.getCookie("password") == null ? "" : app.getCookie("password")
                },
                success: function (res) {
                    if (res.ok !== 1) {
                        return;
                    }
                    if (res.result.phone != undefined) {
                        return;
                    }
                    else {
                        layer.alert("不好意思，你没有权限",function(){
                            location.href = "/";
                        });
                    }

                },
                error: function (err) {
                    console.log(err);
                }
            });
        },
        exit: function () {
            $(".exit").click(function () {
                layer.alert("确定退出?",function() {
                    app.delCookie("phone");
                    app.delCookie("password");
                    location.href = "/";
                });
            });
        }
    };

    module.exports = app;
});