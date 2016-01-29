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