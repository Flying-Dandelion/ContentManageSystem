define(function (require, exports, module) {
    'use strict';

    var app = {
        pageCount: 10,
        init:  function () {
            app.initDate();
            app.query();
            app.addLayer();
            app.addUser();
            app.clear();
            $("#btnQuery").click();
        },
        initDate:function(){
            var date=new Date();
            $("#txtAddTimeStart").val(moment(date).format("YYYY-MM-DD"));
            $("#txtAddTimeEnd").val(moment(date).format("YYYY-MM-DD"));
        },
        query:function(){
            $("#btnQuery").click(function(){
                var page=$('#pageIndex').val();
                $.ajax({
                    type: "GET",
                    url: "/getUser",
                    data:{
                        name:  $("#txtUserName").val(),
                        phone:  $("#txtPhone").val(),
                        startaddtime:  $("#txtAddTimeStart").val(),
                        endaddtime: $("#txtAddTimeEnd").val(),
                        role:$("#txtRole").val(),
                        limit:app.pageCount,
                        skip:(page-1)*app.pageCount
                    },
                    success:function(res){
                        var count=0;
                        if (res.ok !== 1) {
                            layer.alert("查询失败!");
                            return;
                        }
                        for(var item in res.result){
                            res.result[item].addtime = moment(res.result[item].addtime).format("YYYY-MM-DD HH:mm:ss");
                            if(item == 0){
                               count = res.result[0].count;
                            }
                        }
                        //$("#userList").html($("#template").render(res.result));
                        changeUserList(res.result);
                        changeNavBar(Math.ceil(count/app.pageCount));
                    },
                    error:function(err){
                        layer.alert("查询出错!");
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
        },
        addLayer:function(){
            $("#btnAddLayer").click(function(){
                $("#inUsername").val("");
                $("#inPhone").val("");
                $("#selRole").val(0);
                $("#inPWD").val("111111");
                $("#type").val(0);
                $("#inPhone").removeAttr("disabled");
                layer.open({
                    type: 1,
                    closeBtn: 1, //不显示关闭按钮
                    shift: 2,
                    area: ['500px', 'auto'],
                    //shadeClose: true, //开启遮罩关闭
                    content: $("#layer-addUser")
                });
            });
        },
        addUser:function(){
            $("#btnAddUser").click(function(){
                if($("#inPhone").val() === ""){
                    layer.alert("手机号码不能为空!");
                    return;
                }
                if($("#type").val()==="0") {
                    $.ajax({
                        type: "POST",
                        url: "/addUser",
                        data: {
                            name: $("#inUsername").val(),
                            phone: $("#inPhone").val(),
                            role: $("#selRole").val(),
                            password: $("#inPWD").val()
                        },
                        success: function (data) {
                            var res=JSON.parse(data);
                            if (res.ok !== 1) {
                                layer.alert("添加失败!");
                                return;
                            }
                            layer.alert("添加成功", function () {
                                $("#btnQuery").click();
                                layer.closeAll();
                            });

                        },
                        error: function (err) {
                            layer.alert("添加出错!");
                            console.log(err);
                        }
                    });
                }
                else{
                    $.ajax({
                        type: "POST",
                        url: "/editUser",
                        data: { name: $("#inUsername").val(),
                            phone: $("#inPhone").val(),
                            role: $("#selRole").val(),
                            password: $("#inPWD").val()
                        },
                        success: function (res) {
                            if(res.ok !== 1){
                                layer.alert("修改失败!");
                                return;
                            }
                            if(res.n===0){
                                layer.alert("未找到指定数据!");
                                return;
                            }
                            layer.alert("修改成功!",function(){
                                $("#btnQuery").click();
                                layer.closeAll();
                            });
                        },
                        error: function (err) {
                            layer.alert("修改出错!");
                            console.log(err);
                        }
                    });
                }
            });
        }
    };
    module.exports = app;
});
function deleteUser(phone){
    if(phone=== undefined || phone === ""){
        layer.alert("数据有误!");
        return;
    }
    layer.confirm("删除该条数据？",function(){
        $.ajax({
            type: "POST",
            url: "/deleteUser",
            data: {phone: phone},
            success: function (res) {
                if(res.ok !== 1){
                    layer.alert("删除失败!");
                    return;
                }
                if(res.n===0){
                    layer.alert("未找到指定数据!");
                    return;
                }
                layer.alert("删除成功!",function(index){
                    $("#btnQuery").click();
                    layer.close(index);
                });
            },
            error: function (err) {
                layer.alert("删除出错!");
                console.log(err);
            }
        });
    });
}
function editUser(name,phone,role,password){
     $("#inUsername").val(name);
     $("#inPhone").val(phone);
    $("#inPhone").attr("disabled","disabled");
     $("#selRole").val(role);
     $("#inPWD").val(password);
    $("#type").val(1);
    layer.open({
        type: 1,
        closeBtn: 1, //不显示关闭按钮
        shift: 2,
        area: ['500px', 'auto'],
        shadeClose: true, //开启遮罩关闭
        content: $("#layer-addUser")
    });
}
