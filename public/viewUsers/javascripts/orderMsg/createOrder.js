var app = {
    proNum:"",
    num:"",
    product:{},
    proNumList:[],
    prosList:new Vue({
        el: '#productsInfo',
        data:{
            items: []
        }
    }),
    proList:new Vue({
        el: '#productInfo',
        data:{
            items: []
        }
    }),
    init: function () {
        app.getUrlData();
        if(app.proNum!=""){
            app.getProduct();
            app.buy();
        }else if(app.proNumList.length>0){
            app.getProducts();
            app.buy();
        }
    },
    getUrlData: function () {
        var search = window.location.search.substring(1),
            keyAry = search.split('&'), type = '';
        if (keyAry.length > 0) {
            $.each(keyAry, function (key, item) {
                var itemValue = item.split('=');
                if (itemValue.length > 1 && itemValue[0] == "key") {
                    var value =itemValue[1].split('|');
                    if(value.length>1) {
                        app.proNum=value[0];
                        app.num=value[1];
                    }else{
                        $.fn.alert("error",function(){});
                    }
                }
                if (itemValue.length > 1 && itemValue[0] == "buy") {
                    app.proNumList =itemValue[1].split('|');
                    if(app.proNumList.length>1){
                        app.proNumList.length--;
                    }else{
                        $.fn.alert("error",function(){});
                    }
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
            app.product=result;
            app.product[0].buyNum=app.num;
            result[0].buyNum=app.num;
            $("#summary").text(parseInt(app.num)*parseInt(result[0].price));
            $("#count").text(app.num);
            app.proList.items=result;
        });
    },
    getProducts: function () {
        var page=1;
        var data={
            proNumList: app.proNumList,
            limit:1000,
            skip:0,
            sort:{name:"addtime",
                type:1}
        };
        $.fn.commAjax("GET", "/getCart", data, function (data) {
            var result=data.result,count= 0,summary=0;
            app.product=result;
            app.prosList.items=result;
            $.each(result,function(){
                count+=parseInt(this.proInfo.buyNum);
                summary+=parseFloat(this.proInfo.price)*parseInt(this.proInfo.buyNum);
            });
            $("#summary").text(summary);
            $("#count").text(count);
        });
    },
    buy:function(){
        $(".buy").click(function(){
            var data={
                address:$("#address").text(),
                telephone:$("#phone").text(),
                proInfo:[],
                uName:$("#uName").text(),
                summary:$("#summary").text()
            };
            if(app.proNum!=""){
                var product={
                    photo: app.product[0].photoOne,
                    name: app.product[0].name,
                    price: app.product[0].price,
                    productNum: app.product[0].productNum,
                    buyNum: app.product[0].buyNum
                };
                data.proInfo.push(product);
                data.type="0";
            }else if(app.proNumList.length>0){
                $.each(app.product,function(){
                    var product={
                        photo: this.proInfo.photo,
                        name: this.proInfo.name,
                        price: this.proInfo.price,
                        productNum:this.proInfo.productNum,
                        buyNum: this.proInfo.buyNum
                    };
                    data.proInfo.push(product);
                });
                data.type="1";
            }
            $.fn.commAjax("POST","/addOrder",{data:JSON.stringify(data)},function(data){
                $.fn.alert("购买成功", function () {
                    location.href="/users/orderList";
                });
            });
        });
    }
};
app.init();
