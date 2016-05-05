var app = {
    init: function () {
        $("#btnSave").click(function (e) {
            app.editUser();
        });
    },
    editUser: function () {
        $.ajax({
            type: "POST",
            url: "/editUser",
            data: {
                phone: $("#phone").text(),
                role:$("#role").val(),
                name: $("#txtName").val(),
                address:$("#txtAddress").val()
            },
            dataType:"json",
            success: function (res) {
              if(res.ok==1 && res.n>0){
                  $.fn.alert("保存信息出错",function() {
                      location.href = "/users";
                  });
              }else{
                  $.fn.alert("保存信息出错",function(){
                    return;
                  });
              }
            }
        });
    }
    //,
    //getcode:function(){
    //    $(".getcode").click(function(){
    //        $(this).hide();
    //    });
    //}
};
app.init();