var app = {
    productType: "",
    init: function () {
        app.getCart();
        app.check();
        app.buy();
        app.editCart();
        app.delete();
        //app.saveEdit();
    },
    getCart: function () {
        var data = {
            limit: 1000,
            skip: 0,
            sort: {
                name: "addtime",
                type: 1
            }
        };
        $.fn.commAjax("GET", "/getCart", data, function (data) {
            var result = data.result;
                var cartList = new Vue({
                    el: "#list",
                    data:{
                        items: result
                    }
                });
            if (result.length == 0) {
                $("#noResult").show();
            }
        });
    },
    check: function () {
        $("#checkAll").click(function(){
            if($(this).attr("checked")|| $(this).attr("checked")=="checked") {
                if($(".buy").hasClass("disabled")){
                    $(".buy").removeClass("disabled");
                    $(".buy").removeAttr("disabled");
                }
                $("#checkAll").addClass("checked");
                $(".cart-list input[type='checkbox']").addClass("checked");
            }else{
                $(".buy").addClass("disabled");
                $(".buy").attr("disabled","disabled");
                $("#checkAll").removeClass("checked");
                $(".cart-list input[type='checkbox']").removeClass("checked");
            }
        });
    },
    buy:function(){
        $(".buy").click(function(){
            var buylist="";
            $.each($(".cart-list input[type='checkbox'].checked"),function(){
               buylist+=$(this).attr("data-attr")+"|";
            });
            location.href='/users/orderMsg/createOrder?buy='+ buylist;
        });
    },
    editCart:function(){
        $("#editCart").click(function(){
            $(".labSummary").hide();
            $(".buy").hide();
            $(".del").show();
            $(this).hide();
            $(".editOk").show();
        });
    },
    delete:function(){
        $(".del").click(function(){
            var buylist=[];
            $.each($(".cart-list input[type='checkbox'].checked"),function(){
                buylist.push($(this).attr("data-attr"));
            });
            var buylist=buylist;
            $.fn.commAjax("POST", "/delCart", {data:JSON.stringify(buylist)}, function (data) {
                if(data.n>0){
                    $.fn.alert("删除成功",function(){
                        location.reload();
                    });
                }else{
                    $.fn.alert("删除失败",function(){
                    });
                }
            });
        });
    }
    //saveEdit:function(){
    //    $(".editOk").click(function(){
    //        var buylist=[];
    //        $.each($(".cart-list input[type='checkbox'].checked"),function(){
    //            buylist.push($(this).attr("data-attr"));
    //        });
    //    });
    //    var data={
    //        photo : app.product.photoOne,
    //        name : app.product.name,
    //        price : app.product.price,
    //        productNum:app.proNum,
    //        buyNum:$("#num").val()
    //    };
    //    $.fn.commAjax("POST", "/addCart", data, function (data) {
    //        if(data.n==1){
    //            alert("ok");
    //        }else{
    //            alert("no");
    //        }
    //    });
    //}
};
function checkitem(obj){
    if($(obj).attr("checked")|| $(obj).attr("checked")=="checked") {
        if($(".buy").hasClass("disabled")){
            $(".buy").removeClass("disabled");
            $(".buy").removeAttr("disabled");
        }
        $(obj).addClass("checked");
    }else{
        $(obj).removeClass("checked");
        if ($(".cart-list input[type='checkbox'].checked").length ==0 ) {
            $(".buy").addClass("disabled");
            $(".buy").attr("disabled","disabled");
        }
    }
    if ($(".cart-list input[type='checkbox'].checked").length == $(".cart-list input[type='checkbox']").length) {
        $("#checkAll").addClass("checked");
    }else{
        $("#checkAll").removeClass("checked");
    }
}
app.init();
