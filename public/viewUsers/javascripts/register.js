var app = {
    init: function () {
        $("#btn-register").click(function (e) {
            app.register();
        });
    },
    register: function () {
        var phone = $("#txtPhone").val();
        var password = $("#txtPwd").val();
        if (phone == "" || password == "") {
            $.fn.alert("用户名或密码不能为空", function () {
                return;
            });
        }
        $.ajax({
            type: "POST",
            url: "/addUser",
            data: {
                phone: phone,
                password: password,
                role: "3"
            },
            dataType: "json",
            success: function (res) {
                if (res.ok == 1 && res.n > 0) {
                    $.fn.alert("注册成功", function () {
                        location.href = "/users/setInfo?phone=" + phone + "&role=3";
                    });
                } else if (res.ok == -1) {
                    $.fn.alert("该用户已注册", function () {
                    });
                } else {
                    $.fn.alert("入参不对", function () {
                    });
                }
            }
        });
    }
    //,
    //getcode:function(){
    //    $(".getcode").click(function(){
    //        $(this).hide();
    //    });
    //}
};
app.init();