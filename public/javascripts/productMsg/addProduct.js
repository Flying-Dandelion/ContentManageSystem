define(function (require, exports, module) {
    'use strict';
    var app = {
        photoCount: 0,
        infileCount:0,
        init: function () {
            app.initData();
            app.fileChange();
            app.save();
        },
        initData: function () {
            var search = window.location.search.substring(1),
                keyAry = search.split('&'), key = '';
            $.each(keyAry, function (key, item) {
                var itemValue = item.split('=');
                if (itemValue.length > 1 && itemValue[0] == "key") {
                    key = itemValue[1];
                }
            });
            //$.ajax({
            //    type: "GET",
            //    data: {
            //        key: key,
            //        limit: 1,
            //        skip: 0
            //    },
            //    url: "/getProduct",
            //    success: function (data) {
            //
            //    },
            //    error: function (data) {
            //
            //    }
            //})
        },
        photoShow: function (obj) {
            for (var i = 0; i < $(obj)[0].files.length; i++) {
                var item =app.photoCount;
                var html = "<div class='photo-item'><img title='双击删除图片' id='img" + item + "'/></div>";
                $("#photoShow").append(html);
                if (!photoShow("inPhoto" + app.infileCount, "photoShow", "img" + item, i)) {
                    $("#img" + item).parent().remove();
                } else {
                    app.photoCount++;
                    $("#img" + item).dblclick(function () {
                        $(obj).parent().remove();
                    });
                }
            }
            app.infileCount++;
            $(obj).css("display", "none");
            $(obj).parent().append('<input type="file" id="inPhoto' + app.infileCount + '" class="btn btn-sm w100 inPhoto" style="position:absolute;margin-top: -30px;opacity: 0;" multiple />');
            $("#inPhoto"+ app.infileCount).change(function () {
                app.photoShow(this);
            });
        },
        fileChange:function(){
            $("#inPhoto0").change(function () {
                app.photoShow(this);
            });
        },
        save: function () {
            $("#btnAddProduct").click(function () {
                $("#infiles").submit();
                $.ajax({
                    url: "",
                    type: "post",
                    data: {},
                    success: function (res) {

                    },
                    error: function (err) {

                    }
                })
            });
        }
    };
    module.exports = app;
});