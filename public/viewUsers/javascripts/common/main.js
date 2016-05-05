$.fn ={
    setCookie:function (name, value,exdays) {
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
        $.fn.setCookie(name, "", -1);
    },
    userCheck: function () {
        $.ajax({
            type: "POST",
            url: "/userCheck",
            data: {
                phone: $.fn.getCookie("phone") == null ? "" : $.fn.getCookie("phone"),
                password: $.fn.getCookie("password") == null ? "" : $.fn.getCookie("password")
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
    menu:function(){
        var $body = $('body');
        function disableScroll(e) {
            e.preventDefault();
        }
        $('#panelSwitch').tap(function(){
            if($body.hasClass('panel-active')){
                $body.removeClass('panel-active');
                $body.off('touchmove', disableScroll);
            }else{
                $body.addClass('panel-active');
                $body.on('touchmove', disableScroll);
            }
        });
    },
    commAjax: function (type,url,data,callback,cache) {
        $.ajax({
            type: type,
            url: url,
            cache:cache?false:true,
            data: data,
            dataType:"json",
            success: function (res) {
                if (res.ok != 1) {
                    $.fn.alert("获取数据出错！",function(){
                        return;
                    });
                }
                else{
                    callback(res)
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    goBack:function(){
        $(".btn-black").click(function(){
            location.href=history.go(-1);
        });
    },
    exit: function () {
        $(".exit").click(function () {
            $.fn.delCookie("phone");
            $.fn.delCookie("password");
            location.href = "/users";
        });
    },
    alert:function(text,callback){
        var html="<div class='row mark'><span>"+text+"</span></div>";
        $("body").append(html);
        var time = setTimeout(function(){
            $(".row.mark").remove();
            callback();
        },2000);
    }
};
$.fn.exit();
$.fn.menu();
$.fn.goBack();