function photoShow(imgFile, imgDiv, imgShow,mark) {
    var imgType = ["gif", "jpeg", "jpg", "bmp", "png"];
    if (!RegExp("\.(" + imgType.join("|") + ")$", "i").test($("#" + imgFile)[0].files[mark].name.toLowerCase())) {
        layer.alert("选择文件错误,图片类型必须是(gif,jpeg,jpg,bmp,png)中的一种");
        $("#" + imgFile).val("");
        return false;
    }
    if (navigator.userAgent.indexOf("MSIE") > -1) {
        try {
            $("#" + imgShow).attr("src", getObjectURL($("#" + imgFile)[0].files[mark]));
        } catch (e) {
            var div = $("#" + divShow);
            $("#" + imgFile).select();
            top.parent.document.body.focus();
            var src = document.selection.createRange().text;
            document.selection.empty();
            $("#" + imgShow).style("display", "none");
            div.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            div.style.width = _self.Setting.Width + "px";
            div.style.height = _self.Setting.Height + "px";
            div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src;
        }
    } else {
        $("#" + imgShow).attr("src", getObjectURL($("#" + imgFile)[0].files[mark]));
    }
    return true;
}
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
function getString(digit,num){
    if(num.toString().length<digit){
        var length=digit-num.toString().length,zeroChar="";
        for(var i=0;i<length;i++){
            zeroChar+="0";
        }
        return zeroChar+num;
    }
    return num;
}
// 转义"\"特殊字符
function filterKeyWord ( strKeyWord ){
    if (strKeyWord.indexOf ("\\" ) === -1) { return strKeyWord; }

    var str = strKeyWord.split ("\\" );
    var len = str.length;
    var arr = [];
    for (var i = 0; i < len; i++) {
        var keyValue = str[i];
        arr.push (keyValue );
    }

    return arr.join ("\\\\" );
}
(function($){
    $.extend({
        serializeJson : function ( obj ){
            var self = $ (obj );
            var serializeObj = {};
            var array = self.serializeArray ();
            var str = self.serialize ();
            $ (array ).each (function ( ){
                this.value = filterKeyWord (this.value );
                if (serializeObj[this.name]) {
                    if ($.isArray (serializeObj[this.name] )) {
                        serializeObj[this.name].push (this.value );
                    }
                    else {
                        serializeObj[this.name] = [ serializeObj[this.name], this.value ];
                    }
                }
                else {
                    serializeObj[this.name] = this.value;
                }
            } );

            return serializeObj;
        }
    });
})(jQuery );