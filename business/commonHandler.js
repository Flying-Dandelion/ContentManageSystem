var userMsgHandler = require("../business/userMsgHandler.js");
exports.getTime=function(){
    var date=new Date(),
        year=date.getFullYear(), //getYear() 是从1900年至今的年数
        month=exports.getString(2,date.getMonth()+1), //js的月份是从0开始的
        day=exports.getString(2,date.getDate()), //getDay()取星期几
        hour=exports.getString(2,date.getHours()),
        minute=exports.getString(2,date.getMinutes()),
        second=exports.getString(2,date.getSeconds());
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
};
exports.getString=function(digit,num){
    if(num.toString().length<digit){
        var length=digit-num.toString().length,zeroChar="";
        for(var i=0;i<length;i++){
            zeroChar+="0";
        }
        return zeroChar+num;
    }
    return num;
};
exports.getTimeString=function(){
    var date=new Date(),
        year=date.getFullYear(), //getYear() 是从1900年至今的年数
        month=exports.getString(2,date.getMonth()+1), //js的月份是从0开始的
        day=exports.getString(2,date.getDate()), //getDay()取星期几
        hour=exports.getString(2,date.getHours()),
        minute=exports.getString(2,date.getMinutes()),
        second=exports.getString(2,date.getSeconds());
    return year+month+day+hour+minute+second;
};
exports.requiredAuthentication = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        if(req.baseUrl=="/users"){
            res.redirect('/users/');
        }else {
            res.redirect('/');
        }
    }
};
exports.updateSession=function(phone,role,res,req){
    var queryDoc={
        phone:phone,
        role:role
    }
    userMsgHandler.getUser({query:queryDoc}, function (result) {
        if (result.ok == 1 && result.result.length == 1) {
            req.session.user={
                name:result.result[0].phone,
                pwd:result.result[0].password,
                role:result.result[0].role,
                userName:result.result[0].name,
                address:result.result[0].address,
                photo:"user.jpg"
            };
            result.n=1;
        }
        res.json(result);
    });
};