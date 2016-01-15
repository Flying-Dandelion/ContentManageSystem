function initUserList(usersDate) {
    var userList = new Vue({
        el: '#userList',
        data: {
            items:usersDate
        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
        }
    });
    userList.items = userList.items.filter(function (usersDate) {
        return usersDate;
    })
    Vue.directive("userList", {
        bind: function () {
            console.log('demo bound!')
        },
        update: function (value) {
            this.data(value);
        }
    })
};