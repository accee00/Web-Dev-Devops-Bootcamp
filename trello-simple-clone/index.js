const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware.js");

const app = express();
let USER_ID = 1;
let ORG_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;

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
    const userId = req.userId;
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({
            msg: "Both feilds are required."
        });
    }
    organizations.push({
        id: ORG_ID++,
        name: name,
        description: description,
        admin: userId,
        members: []
    });
    return res.json({
        msg: "Org created.",
        id: ORG_ID--
    })
});

app.post("/add-member-to-organization", authMiddleware, (req, res) => {
    const { orgId, username } = req.body;
    const userId = req.userId;

    const doesOrgExist = organizations.find(org => org.id === orgId);
    if (!doesOrgExist || doesOrgExist.admin !== userId) {
        return res.status(404).json({
            msg: "This org don't exist or u are not admin of this org."
        })
    }
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({
            msg: "No user with this user name present."
        })
    }
    doesOrgExist.members.push(user.id);
    return res.json({
        msg: "new member added."
    })
});

app.post("/boards", authMiddleware, (req, res) => {
    const userId = req.userId
    const { title, orgId } = req.body;

    if (!title || !orgId) {
        return res.status(400).json({
            msg: "title or org id is missing."
        });
    }
    const organization = organizations.find(org => org.id === orgId);

    if (!organization || organization.admin !== userId) {
        return res.status(404).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        });
    }

    boards.push({
        id: BOARD_ID++,
        title,
        organization: orgId
    });
    return res.status(201).json({
        msg: "board cereated.",
        id: BOARD_ID--,
    })
});

app.post("/issue", authMiddleware, (req, res) => {
    const userId = req.userId;
    const { title, issueState } = req.body;
    const { boardId } = req.query;
    if (!title || !issueState) {
        res.status(400).json({
            msg: "Both title and issueState is required."
        });
        return;
    }
    const board = boards.find(board => board.id === parseInt(boardId));
    if (!board) {
        res.status(404).json({
            msg: "Board not found."
        });
        return;
    }

    /// Check if user in present in that org. 
    const organization = organizations.find(org => org.id === board.organization);
    if (!organization) {
        res.status(404).json({
            msg: "org not found."
        });
        return;
    }

    const isMemeberOrAdmin = organization.members.includes(userId) || organization.admin === userId;
    if (!isMemeberOrAdmin) {
        res.status(403).json({
            msg: "You are not part of this org."
        });
        return;
    }

    issues.push({
        id: ISSUE_ID++,
        title: title,
        issueState: issueState,
        board: board.id
    });

    return res.status(201).json({
        msg: "issue created ",
        id: ISSUE_ID--
    });
});

app.get("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const { orgId } = req.query

    if (!orgId) {
        return res.json({
            msg: "Org id is missing."
        })
    }
    console.log(userId);
    console.log(orgId);
    console.log(typeof (orgId));
    const org = organizations.find(org => org.id === parseInt(orgId));
    if (!org || org.admin !== userId) {
        return res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
    }

    res.status(200).json({
        ...org,
        members: org.members.map(memberId => {
            const user = users.find(user => user.id === memberId);
            return {
                id: user.id,
                username: user.username,
            }
        })
    });
});



app.get("/boards", authMiddleware, (req, res) => {
    const userId = req.userId;
    const { orgId } = req.query;

    const organization = organizations.find(org => org.id === parseInt(parseInt));
    if (!organization || organization.admin !== userId) {
        return res.status(404).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
    }
    const orgBoard = boards.find(board => board.organization === orgId);

    return res.status(200).json({
        orgBoard
    });
});


app.get("/issues", authMiddleware, (req, res) => {
    const userId = req.userId;
    const { boardId } = req.query;

    if (!boardId) {
        return res.status(400).json({
            msg: "board id is missing."
        });
    }

    const board = boards.find(b => b.id === parseInt(boardId));
    if (!board) {
        return res.status(404).json({
            msg: "board not found"
        });
    }

    const organization = organizations.find(org => org.id === board.organization);
    if (!organization) {
        return res.status(404).json({
            msg: "org not found"
        });
    }

    const isMemberOrAdmin =
        organization.members.includes(userId)
        || organization.admin === userId;

    if (!isMemberOrAdmin) {
        return res.status(403).json({
            msg: "You are not part of this org."
        });
    }

    const boardIssues = issues.filter(iss => iss.boardId === board.id);

    return res.status(200).json({
        issues: boardIssues
    });
});

app.get("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const { orgId } = req.query;
    if (!orgId) {
        return res.status(400).json({
            msg: "Org id is required."
        });
    }
    const organization = organizations.find(org => org.id === parseInt(orgId));
    if (!organization) {
        return res.status(404).json({
            msg: "org not found"
        });
    }
    const isMemeberOrAdmin = organization.members.includes(userId) ||
        organization.admin === userId;

    if (!isMemeberOrAdmin) {
        return res.status(403).json({
            msg: "You are not part of this org."
        });
    }
    const members = organization.members.map(memberId => {
        const user = users.find(u => u.id === memberId);
        return {
            id: user.id,
            username: user.username
        };
    });

    return res.status(200).json({
        members
    });
});

app.put("/issue", authMiddleware, (req, res) => {
    const userId = req.userId;
    const { issueId } = req.query;
    const { issueState } = req.body;

    if (!issueId || !issueState) {
        return res.status(400).json({
            msg: "issueId and issueState are required"
        });
    }

    const issue = issues.find(i => i.id === parseInt(issueId));
    if (!issue) {
        return res.status(404).json({
            msg: "issue not found"
        });
    }

    const board = boards.find(b => b.id === issue.boardId);
    if (!board) {
        return res.status(404).json({
            msg: "board not found"
        });
    }

    const organization = organizations.find(org => org.id === board.organization);
    if (!organization) {
        return res.status(404).json({
            msg: "org not found"
        });
    }

    const isMemberOrAdmin =
        organization.members.includes(userId) ||
        organization.admin === userId;

    if (!isMemberOrAdmin) {
        return res.status(403).json({
            msg: "You are not part of this org."
        });
    }

    issue.issueState = issueState;

    return res.status(200).json({
        msg: "issue updated",
        issue
    });
});


app.delete("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const { orgId, memberUserName } = req.body;

    if (!orgId || !memberUserName) {
        return res.status(400).json({
            msg: "orgId and memberUserName are required"
        });
    }

    const organization = organizations.find(org => org.id === orgId);

    if (!organization) {
        return res.status(404).json({
            msg: "org not found"
        });
    }

    if (organization.admin !== userId) {
        return res.status(403).json({
            msg: "only admin can remove members"
        });
    }
    const user = users.find(u => u.username === memberUserName);

    if (!user) {
        return res.status(404).json({
            msg: "user not found"
        });
    }

    organization.members = organization.members.filter(
        memberId => memberId !== user.id
    );

    return res.status(200).json({
        msg: "memeber deleted ",
    });
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