const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware.js");

const app = express();
let USER_ID = 1;
let ORG_ID = 1;

const users = [];
const organizations = [];
const issues = []
const boards = []
app.listen(8000, () => {
    console.log(`Server running at http://localhost:8000`);
});
app.use(express.json());

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            msg: "Both feilds are required."
        });
    }
    const userExist = users.find(user => user.username === username);

    if (userExist) {
        return res.status(403).json({
            msg: "This user name already exist. Please try something else."
        });
    }

    users.push({
        id: USER_ID++,
        username: username,
        password: password
    });
    return res.status(201).json({
        msg: "Sign up success."
    });
});

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            msg: "Both feilds are required."
        });
    }
    const userExist = users.find(user => user.username === username && user.password === password);

    if (!userExist) {
        return res.status(403).json({
            msg: "incorrect credentials."
        });
    }
    const token = await jwt.sign({
        userId: userExist.id,
    }, "23890239kdjsj");

    return res.status(200).json({
        token
    });
});

app.post("/organization", authMiddleware, (req, res) => {
    if (req.userId) {
        let id = req.userId
        return res.json({
            id
        });
    } else {
        return res.json({
            msg: "no user id",
        });
    }
});








app.get("/boards", (req, res) => {

});


app.get("/issues", (req, res) => {

});

app.get("/members", (req, res) => {

});

app.put("/issue", (req, res) => {

});


app.delete("/members", (req, res) => {

});









































// /*
//     username, password --->> USER TABLE
//     organization ---->> ORGANIZATION TABLE
//     board ----->> BOARDS TABLE
//     issue ------>>> ISSUE TABLE
// */

// const user = [
//     {
//         id: 1,
//         username: "Harshvardhan",
//         password: "harsh123"
//     }
// ]
// const organization = [
//     {
//         id: "org-id-01",
//         name: "APEX ORG",
//         description: "Gaming platform for all.",
//         admin: "",
//         members: [] //ids of user
//     }
// ]
// const board = [
//     {
//         id: 1,
//         title: "App changes",
//         organization: "org-id-01"
//     }
// ]
// const issue = [
//     {
//         id: 1,
//         title: "Add dark mode",
//         board: 1,
//         state:"IN_PROGRESS / DONE / PENDING"
//     }
// ]