define(function (require, exports, module) {
    'use strict';

    var app = {
        pageCount: 10,
        init:  function () {
            app.initDate();
            app.getProductType();
            app.typeChange();
            app.query();
            app.clear();
            $("#btnQuery").click();
        },
        initDate:function(){
            var date=new Date();
            $("#txtAddTimeEnd").val(moment(date).format("YYYY-MM-DD"));
        },
        getProductType: function () {
            $.ajax({
                type: "GET",
                cache:false,
                url: "/getProductType",
                success: function (data) {
                    if (data.ok == 1 && data.result.length > 0) {
                        $("#txtProductType").html("");
                        app.productType=data.result;
                        $.each(data.result, function () {
                            $("#txtProductType").append("<option value='" + this.type + "'>" + this.name + "</option>")
                        });
                        if(data.result.length>0){
                            app.bindProductSort(data.result[0].typeInfo);
                        }
                    }
                }
            });
        },
        bindProductSort:function(ary){
            $("#txtProductSort").html("");
            if(ary == undefined || ary.length==0){
                layer.alert("����������!");
                return;
            }
            $.each(ary,function(){
                $("#txtProductSort").append("<option value='" + this.sort + "'>" + this.name + "</option>");
            });
        },
        typeChange:function(){
            $("#txtProductType").change(function(){
                var index = $(this).val();
                $.each(app.productType,function(){
                    if(this.type==index){
                        app.bindProductSort(this.typeInfo);
                    }
                });
            });
        },
        query:function(){
            $("#btnQuery").click(function(){
                var page=$('#pageIndex').val();
                $.ajax({
                    type: "GET",
                    url: "/getProduct",
                    data:{
                        name:  $("#txtProductName").val(),
                        type:  $("#txtProductType").val(),
                        startaddtime:  $("#txtAddTimeStart").val(),
                        endaddtime: $("#txtAddTimeEnd").val(),
                        status:$("#txtProductStatus").val(),
                        proSort:$("#txtProductSort").val(),
                        limit:app.pageCount,
                        skip:(page-1)*app.pageCount,
                        sort:{name:"addtime",
                            type:-1}
                    },
                    success:function(res){
                        var count=0;
                        if (res.ok !== 1) return;
                        for(var item in res.result){
                            res.result[item].addtime = moment(res.result[item].addtime).format("YYYY-MM-DD HH:mm:ss");
                            if(item == 0){
                                count = res.result[0].count;
                            }
                        }
                        changeUserList(res.result);
                        changeNavBar(Math.ceil(count/app.pageCount));
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            });
        },
        clear:function(){
            $("#btnClear").click(function(){
                $("input[type='text']").val("");
                $("select option:first").attr("selected","selected");

                app.initDate();
            });
        }
    };

    module.exports = app;
});

function addOrder(photo,proName,price,productNum){
    var data={
        photo:photo,
        name:proName,
        price:price,
        proInfo :[productNum],
        buyNum: 1
    };
    $.ajax({
        type: "POST",
        cache:false,
        url: "/addOrder",
        data:{data:JSON.stringify(data)},
        success: function (result) {
            var data=JSON.parse(result);
            if (data.ok == 1 && data.n > 0) {
                layer.alert("生成订单成功");
            }
        }
    });
}