


export function pageSlice(tableData, currentPage, pageSize) {
    return tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
}

export function attributeNameModify(obj, preAttribute, newAttribute) {
    obj[newAttribute] = obj[preAttribute];
    delete obj[preAttribute];
    return obj;
}

export function arrSubtraction(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.filter(i => !b.includes(i));
    }
}

/* 
过滤函数返回
arr:[] 原始数据
rules:[]
    {
        rule:"xxx",
        value:"xxx"
    }
*/
export function searchTool(arr, rules) {
    return arr.filter(item => {
        let flag = true
        rules.forEach(r => {
            if (!item[r.rule].includes(r.value)) {
                flag = false
            }
        });
        return flag
    })
}


// 年龄计算
//对于非时间格式的数据，放进去后返回 暂无

export function jsGetAge(birthday) {
    var strBirthday = ""
    if (!birthday) {
        return "暂无";
    } else {
        strBirthday = this.$timeFormat(new Date(birthday)).format("yyyy-MM-DD");
    }

    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];
    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    if (nowYear == birthYear) {
        returnAge = 0; //同年 则为0岁
    } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay; //日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            } else {
                var monthDiff = nowMonth - birthMonth; //月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                } else {
                    returnAge = ageDiff;
                }
            }
        } else {
            returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge + ""; //返回周岁年龄
}


