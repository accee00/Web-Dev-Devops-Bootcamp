function isLegal(usersArray) {
    let canVoteArray = []
    for (let i = 0; i < userArray.length; i++) {
        if (userArray[i].age > 18 && userArray[i].gender === "Male") {
            canVoteArray.push(userArray[i])
        }
    }
    return canVoteArray
}


const userArray = [
    {
        age: 30,
        gender: "Female"
    },
    {
        age: 18,
        gender: "Female"
    },
    {
        age: 21,
        gender: "Male"
    },
    {
        age: 20,
        gender: "Male"
    },
]

const result = isLegal(userArray)

console.log(result)