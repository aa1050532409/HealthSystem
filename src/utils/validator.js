export function validateAccount(rule, value, callback) {
    if (value == "") {
        return callback(new Error("账号不能为空"));
    }
    if (!/^[0-9_-]{6,12}$/.test(value)) {
        return callback(new Error("请输入6-12位数字"));
    } else {
        callback();
    }
};

export function validatePass(rule, value, callback) {
    if (value == "") {
        callback(new Error("请输入密码"));
    } else {
        callback()
    }
};

export function validateName(rule, value, callback) {
    if (value == "") {
        callback(new Error("请输入姓名"));
    } else {
        if (!/^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/.test(value)) {
            callback(new Error("姓名不符合规范"));
        } else {
            callback()
        }
    }
};
// 非空验证
export function spaceValidate(rule, value, callback) {
    console.log(value)
    if (!value) {
        callback(new Error("此处不可为空"));
    }
    if (value == "") {
        callback(new Error("此处不可为空"));
    } else {
        callback()
    }
};