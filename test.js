let arr = [1, 2, 11, 4, 5, 6, 7, 8, 9]

let newArr = []
while (arr.length > 0) {
    let i = Math.floor(Math.random() * arr.length)
    newArr.push(...arr.splice(i, 1))
}
console.log(newArr);