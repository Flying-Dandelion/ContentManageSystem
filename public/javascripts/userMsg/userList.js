define(function (require, exports, module) {
    'use strict';

    var app = {
        pageCount: 10,
        init:  function () {
            app.query();
            app.addLayer();
            app.addUser();
            app.clear();
            $("#btnQuery").click();
        },
        query:function(){
            $("#btnQuery").click(function(){
                var page=$('#pageIndex').val();
                $.ajax({
                    type: "GET",
                    url: "/getUser",
                    data:{
                        username:  $("#txtUserName").val(),
                        phone:  $("#txtPhone").val(),
                        startaddtime:  $("#txtAddTimeStart").val(),
                        endaddtime: $("#txtAddTimeEnd").val(),
                        limit:app.pageCount,
                        skip:(page-1)*app.pageCount
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
                        //$("#userList").html($("#template").render(res.result));
                        initUserList(res.result);
                        initNavBar(Math.ceil(count/app.pageCount));
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
            });
        },
        addLayer:function(){
            $("#btnAddLayer").click(function(){
                layer.open({
                    type: 1,
                    closeBtn: 1, //不显示关闭按钮
                    shift: 2,
                    area: ['500px', 'auto'],
                    shadeClose: true, //开启遮罩关闭
                    content: $("#layer-addUser")
                });
            });
        },
        addUser:function(){
            $("#btnAddUser").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/addUser",
                    data:{
                        username: $("#inUsername").val(),
                        phone: $("#inPhone").val(),
                        addtime: moment().format("YYYY-MM-DD HH:mm:ss"),
                        roleinfo:$("#selRole").val(),
                        password:$("#inPWD").val()
                    },
                    success:function(res){
                        if (res.ok !== 1) return;
                       layer.alert("添加成功",function(){ layer.closeAll();});

                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            });
        }
    };

    module.exports = app;
});
