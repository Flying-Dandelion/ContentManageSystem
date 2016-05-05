define(function (require, exports, module) {
    'use strict';
    var app = {
        init:  function () {
            app.query();
            $("#btnQuery").click();
             },
        query:function(){
            $("#btnQuery").click(function(){
                var data= {roleid: $("#selRole").val(),
                            sort:{"roleid":1},
                            field:["rolename","roleid"]
                        };
                $.ajax({
                    type: "GET",
                    url: "/getRole",
                    data:data,
                    success:function(res){
                        if (res.ok !== 1) return;
                        $("#roleList").html($("#template").render(res.result));
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