define(function (require, exports, module) {
	'use strict';

	exports.ajax = function (opts) {
		 return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();

			// When the request loads, check whether it was successful
			xhr.onload = function () {
				if (xhr.status === 200) {
					// If successful, resolve the promise by passing back the request response
					resolve(xhr.response);
				} else {
					// If it fails, reject the promise with a error message
					reject(Error(xhr.statusText));
				}
			};
			xhr.onerror = function () {
				// Also deal with the case when the entire request fails to begin with
				// This is probably a network error, so reject the promise with an appropriate message
				reject(Error(xhr.statusText));
			};

			xhr.open(opts.type || "GET", opts.url, true);
			xhr.responseType = "json";
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.send(opts.data);
		});
	};

	exports.getOne = function (id) {
		return document.querySelector(id);
	}

	exports.getAll = function (id) {
		return document.querySelectorAll(id);
	}
});