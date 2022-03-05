//利用正则表达式判断是否是0-9的阿拉伯数字
export function regIsDigit(fData) {
    var reg = new RegExp("^[0-9]$");
    return (reg.test(fData));
}

//应用扩展判断是否是数值
export function regIsNumber(fData) {
    var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$");
    return reg.test(fData)
}

//判断手机号是否正确
export function regIsPhone(fData) {
    var reg = /^(\+86)?(1[0-9]{10})$/;
    return reg.test(fData);
}

//校验密码：只能输入6-20个字母、数字、下划线  
export function checkPassword(s) {
    var patrn = /^(\w){6,20}$/;
    if (!patrn.exec(s)) return false
    return true
}

//校验搜索关键字  
export function isSearch(s) {
    var patrn = /^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\]  [\]\{ \ }:; '\,.<>?]{0,19}$/;  
    if (!patrn.exec(s)) return false
    return true
}  

// 验证用户名是否合法，必须是以字母开头，只能包含字母数字下划线和减号，4到16位
export function checkUserName(username)
{
    if (/^[A-Za-z]{1}[A-Za-z0-9_-]{3,15}$/.test(username)) {
        return 1;
    } else {
        return 0;
    }
}


// 验证邮箱是否合法，必须有@，前边最少2个字符，字母或数字开头，域名部分最少1位，后缀可以是一级也可以是二级，最少两位
export function checkEmail(email)
{
    email = email.toLowerCase();// 全部转小写（邮箱不区分大小写）
    if (/^[a-z0-9]{1}[a-z0-9_-]{1,}@[a-z0-9]{1,}(\.[a-z]{2,})*\.[a-z]{2,}$/.test(email)) {
        return 1;
    } else {
        return 0;
    }
}


export function checkPhone(phone){ 
    
    if (/^1[34578]\d{9}$/.test(phone)) { 
        return 1; 
    } else {
        return 0;
    }
}


// 验证身份证号是否合法
// 身份证号：前两位表示地区，所以第一位不可能是0，而第7、8两位是年份的前两位，也不可能是0，最后一位除了10个数字以外还可能是X|x
export function checkIdCard(idcard)
{
    if (/^[1-9]{1}\d{5}[1-9]{2}\d{9}[Xx0-9]{1}$/.test(idcard)) {
        return 1;
    } else {
        return 0;
    }
}
