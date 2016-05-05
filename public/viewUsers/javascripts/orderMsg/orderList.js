var app = {
    productType: "",
    list :new Vue({
        el: "#list",
        data: {
            items: []
        }
    }),
    init: function () {
        app.getOrder();
    },
    getOrder: function (status) {
        var data={
            limit:1000,
            skip:0,
            sort:{name:"addtime",
                type:-1}
        };
        if(status){
            data.status=status;
        }
        $.fn.commAjax("GET", "/getOrder", data, function (data) {
            var result=data.result;
                app.list.items= result;
            if(result.length==0) {
                $("#noResult").show();
            }
        });
    }
};
function typeChange(obj,status){
    app.getOrder(status);
    $(".proType-list .active").removeClass("active");
    $(obj).addClass("active");
}
function  setOrderStatus(oderNum,status){
    $.ajax({
        type: "POST",
        url: "/setOrderStatus",
        data: {
            status: parseInt(status)+1,
            orderNum: oderNum
        },
        success: function (res) {
            $.fn.alert("操作成功",function(){});
                app.init();
        }
    });
}
app.init();
