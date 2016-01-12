define(function (require, exports, module) {
    'use strict';
    var app = {
        init:  function () {
            app.changeMenu();
        },
        changeMenu:function(){
            var menuIndex=$("#menu").attr("name");
            $("#menu li.active").removeClass("active");
            $($("#menu li")[menuIndex]).addClass("active");
        }
    };

    module.exports = app;
});