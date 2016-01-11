define(function (require, exports, module) {
	'use strict';

	var utils = require("utils");
	var ajax = utils.ajax,
		getOne = utils.getOne;

	var app = {
		init: function () {
			var btnSave = getOne("#btnLogin");

			btnSave.addEventListener("click", function (e) {
				app.save();
			}, false);
		},
		save: function () {
			var phone = getOne("#txtPhone").value;
			var password = getOne("#txtPwd").value;

			var promise = ajax({
				type: "POST",
				url: "/login",
				data: JSON.stringify({
					phone: phone,
					password:password
				})
			});
			promise
				.then(function (res) {
					if (res.ok !== 1) return;
					location.href="/index";
				})
				.catch(function (err) {
					console.log(err);
				});
		}
	}

	module.exports = app;
});