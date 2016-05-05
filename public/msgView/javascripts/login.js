define(function (require, exports, module) {
	'use strict';

	//var utils = require("utils");
	//var ajax = utils.ajax,
	//	getOne = utils.getOne;
	var main=require("main");

	var app = {
		init: function () {
			//var btnSave = $("#btnLogin");

			$("#btnLogin").click(function (e) {
				app.save();
			});
		},
		save: function () {
			var phone = $("#txtPhone").val();
			var password = $("#txtPwd").val();
			if(phone=="" || password == ""){
				layer.alert("用户名或密码不能为空");
				return;
			}
			$.ajax({
				type: "POST",
				url: "/login",
				data: {phone: phone,
					password: password
				},
				success: function (res) {
					if (res.ok == 2) {
						layer.alert("您没有权限登录!");
						return;
					}
					if (res.result.phone !=undefined) {
						main.setCookie("phone",res.result.phone,1);
						main.setCookie("password",res.result.password,1);
						location.href = "/index";
					}
					else {
						layer.alert("用户名或密码错误！");
						return;
					}
				},
				error: function (err) {
					console.log(err);
				}
			});
		}
	};

	module.exports = app;
});