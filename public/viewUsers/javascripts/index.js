var app = {
    init:  function () {
        app.getProductType();
        app.swiper();
    },
    getProductType: function () {
        $.fn.commAjax("GET","/getProductType","",function (data) {
            var list = new Vue({
                el: "#list",
                data: {
                    items: data.result
                }
            });
        });
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
    query:function(){
        $("#query").click(function(){
            var data= {
                username: $("#txtUserName").val(),
                phone: $("#txtPhone").val()

            };
            $.ajax({
                type: "GET",
                url: "/getUser",
                data:data,
                success:function(res){
                    if (res.ok !== 1) return;
                    $("#userList").html($("#template").render(res.result));
                },
                error:function(err){
                    console.log(err);
                }
            });
        });
    }
};
app.init();