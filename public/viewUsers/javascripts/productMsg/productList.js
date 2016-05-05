var app = {
    productType:"",
    list:new Vue({
        el: "#list",
        data: {
            items: []
        }}),
    init: function () {
        app.initData();
    },
    initData: function () {
        app.getUrlData();
        if (app.productType != "") {
            app.getProduct();
            app.getProductType();
        }
    },
    getUrlData: function () {
        var search = window.location.search.substring(1),
            keyAry = search.split('&'), type = '';
        if (keyAry.length > 0) {
            $.each(keyAry, function (key, item) {
                var itemValue = item.split('=');
                if (itemValue.length > 1 && itemValue[0] == "type") {
                    app.productType=itemValue[1];
                }
            });
        }
    },
    getProduct: function (sort) {
        var page=1;
        var data={
            type:app.productType,
            limit:1000,
            skip:(page-1)*20,
            sort:{
                name:"addtime",
                type:1}
        };
        if(sort){
            data.proSort=sort;
        }
        $.fn.commAjax("GET", "/getProduct", data, function (data) {
            app.list.items=data.result;
            if (data.result.length == 0) {
                $("#noResult").show();
            }
        });
    },
    getProductType: function (type) {
        var type="";
        if(type==0){
            type=app.productType;
        }
        else{
            type=$("");
        }
        $.fn.commAjax("GET", "/getProductType", {type: type}, function (data) {
            var typeList=new Vue({
                el: "#typeList",
                data: {
                    items:data.result[0].typeInfo
                }
            });
        },false);
    }
};
function typeChange(obj,sort){
    app.getProduct(sort);
    $(".proType-list .active").removeClass("active");
    $(obj).addClass("active");
}
app.init();
