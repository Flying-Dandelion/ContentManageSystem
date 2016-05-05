var app = {
    product: {},
    proNum:"",
    init: function () {
        app.initData();
        app.addCart();
        //app.save();
    },
    initData: function () {
        app.getUrlData();
        if (app.proNum != "") {
            app.getProduct();
        }
    },
    swiper:function() {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplay: 3000,//��ѡѡ��Զ�����
            loop: true,
            autoplayDisableOnInteraction: false
        });
    },
    getUrlData: function () {
        var search = window.location.search.substring(1),
            keyAry = search.split('&'), type = '';
        if (keyAry.length > 0) {
            $.each(keyAry, function (key, item) {
                var itemValue = item.split('=');
                if (itemValue.length > 1 && itemValue[0] == "proNum") {
                    app.proNum = itemValue[1];
                }
            });
        }
    },
    getProduct: function () {
        var page=1;
        var data={
            productNum: app.proNum,
            limit:1,
            skip:0,
            sort:{name:"addtime",
                type:1}
        };
        $.fn.commAjax("GET", "/getProduct", data, function (data) {
            var result=data.result;
            app.product=result[0];
            result[0].photo=result[0].photo.split("|");
            result[0].photo.length--;
            result[0].photoDetail=result[0].photoDetail.split("|");
            result[0].photoDetail.length--;
            var proList=new Vue({
                el: '#productInfo',
                data:{
                    items: result[0]
                },
                methods:{
                    plus: function () {
                        var value = parseInt($("#num").val()) + 1;
                        $("#num").val(value);
                        if (value == 2) {
                            $("#reduce").removeAttr("disabled");
                        }
                    },
                    reduce: function () {
                        var value = parseInt($("#num").val()) - 1;
                        $("#num").val(value);
                        if (value == 1) {
                            $("#reduce").attr("disabled", "disabled");
                        }
                    },
                    buy:function(){
                        var href=$(".buy").attr("url");
                        location.href=href+$("#num").val();
                    }
                }
            });
        });
    },
    addCart:function(){
        $("#addCart").click(function(){
            var data={
                photo : app.product.photoOne,
                name : app.product.name,
                price : app.product.price,
                productNum:app.proNum,
                buyNum:$("#num").val()
            };
            $.fn.commAjax("POST", "/addCart", data, function (data) {
                if(data.n==1){
                    $.fn.alert("添加成功",function(){
                    });
                }else{
                    $.fn.alert("添加失败",function(){
                    });
                }
            });
        })
    }
};
app.init();
function plus(){
}
