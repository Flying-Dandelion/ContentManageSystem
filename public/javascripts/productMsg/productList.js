define(function (require, exports, module) {
    'use strict';

    var app = {
        pageCount: 10,
        init:  function () {
            app.initDate();
            app.query();
            app.clear();
            $("#btnQuery").click();
        },
        initDate:function(){
            var date=new Date();
            $("#txtAddTimeEnd").val(moment(date).format("YYYY-MM-DD"));
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
                        limit:app.pageCount,
                        skip:(page-1)*app.pageCount,
                        sort:{name:"addtime",
                            type:1}
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
