var app = {
	init: function () {
		$("#btnLogin").click(function (e) {
			app.login();
		});
	},
	login: function () {
		var phone = $("#txtPhone").val();
		var password = $("#txtPwd").val();
		if(phone=="" || password == ""){
			$.fn.alert("用户名或密码不能为空",function(){
				return;
			});
		}
		$.ajax({
			type: "POST",
			url: "/login",
			data: {phone: phone,
				password: password,
				type: 0
			},
			dataType:"json",
				success: function (res) {
				if (res.ok == 2 || res.ok==1) {
					if (res.result.phone != undefined) {
						$.fn.setCookie("phone", res.result.phone, 1);
						$.fn.setCookie("password", res.result.password, 1);
						location.href = "/users/index";
					}
					else {
						$.fn.alert("用户名或密码错误！",function(){
							return;
						});

					}
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	}
};
app.init();