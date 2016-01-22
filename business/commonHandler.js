exports.getTime=function(){
    var date=new Date(),
        year=date.getFullYear(), //getYear() 是从1900年至今的年数
        month=exports.getTwo(date.getMonth()+1), //js的月份是从0开始的
        day=exports.getTwo(date.getDate()), //getDay()取星期几
        hour=exports.getTwo(date.getHours()),
        minute=exports.getTwo(date.getMinutes()),
        second=exports.getTwo(date.getSeconds());
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
};
exports.getTwo=function(num){
    var strNum=num<10?"0"+num:num;
    return strNum;
};