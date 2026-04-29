const env = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, Organization, Board, Issue } = require("./models.js");
const app = express();

env.config({
    path: "./.env"
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(8000, () => {
        console.log(`Server running at http://localhost:8000`);
    });
});

app.use(express.json());

/*

--- POST ENDPOINTS ---

*/
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
        res.status(400).json({
            msg: "Both feilds are required."
        });
        return
    }
    const doesUserExist = await User.exists({ username: username });

    if (doesUserExist) {
        res.status(409).json({
            msg: "User with this username exist."
        });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        username, password: hashedPassword
    });

    if (!newUser) {
        res.status(500).json({
            msg: "Error while creating user."
        });
        return;
    }
    return res.status(201).json({
        msg: "User created."
    })
});

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({
            msg: "Both feilds are required."
        });
    }

    const doesUserExist = await User.findOne({ username });

    const isPassCorrect = await bcrypt.compare(password, doesUserExist.password);


    if (!isPassCorrect || !doesUserExist) {
        res.status(401).json({
            msg: "Invalid credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId: doesUserExist._id
    }, "23890239kdjsj");

    return res.status(200).json({
        msg: "Sign in done.",
        token: token,
    });
});

app.post("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { name, description } = req.body;
    if (!name?.trim() || !description?.trim()) {
        return res.status(400).json({
            msg: "Both feilds are required."
        });
    }
    const organization = await Organization.create({
        name: name,
        description: description,
        admin: userId,
        members: [userId],
    });

    if (!organization) {
        res.status(500).json({
            msg: "Error while creating org."
        });
        return;
    }
    return res.json({
        msg: "Org created.",
        organization: organization
    });
});

app.post("/add-member-to-organization", authMiddleware, async (req, res) => {
    const { orgId, username } = req.body;
    const userId = req.userId;

    const org = await Organization.findById(orgId);
    if (!org) {
        res.status(404).json({
            msg: "Organization not found"
        });
        return;
    }

    if (org.admin.toString() !== userId) {
        res.status(403).json({
            msg: "Only admin can add members"
        });
        return;
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({
            msg: "User not found"
        });
        return;
    }


    const isalreadyPresent = org.members.includes(user._id);
    if (isalreadyPresent) {
        res.status(400).json({
            msg: "User already in organization"
        });
        return;
    }
    org.members.push(user._id);
    await org.save();

    return res.status(200).json({
        msg: "Member added successfully"
    });
});

app.post("/boards", authMiddleware, async (req, res) => {
    const userId = req.userId
    const { title, orgId } = req.body;

    if (!title?.trim() || !orgId?.trim()) {
        return res.status(400).json({
            msg: "title or org id is missing."
        });
    }

    const org = await Organization.findById(orgId);

    if (!org) {
        res.status(404).json({
            msg: "Organization not found"
        });
        return;
    }
    const board = await Board.create({
        title,
        organization: org._id
    });

    if (!board) {
        res.status(500).json({
            msg: "Error while creating a board"
        });
        return;
    }

    return res.status(201).json({
        msg: "Board created.",
        board
    });

});

app.post("/issue", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { title, issueState } = req.body;
    const { boardId } = req.query;
    const ISSUE_ENUM = ["IN_PROGRESS", "DONE", "PENDING"];

    if (!title?.trim() || !issueState?.trim()) {
        res.status(400).json({
            msg: "Both title and issueState is required."
        });
        return;
    }

    if (!ISSUE_ENUM.includes(issueState)) {
        res.status(400).json({
            msg: "Invalid issue state (IN_PROGRESS, DONE, PENDING)"
        });
        return;
    }

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404).json({
            msg: "Board not found"
        });
        return;
    }
    const org = await Organization.findById(board.organization);
    const isAdmin = org.admin.toString() === userId;
    const isMember = org.members.includes(user._id);

    if (!isAdmin && !isMember) {
        return res.status(403).json({
            msg: "You are neither admin nor member."
        });
    }
    const issue = await Issue.create({
        title, status,
        board: boardId
    });

    if (!issue) {
        res.status(500).json({
            msg: "Error while creating a issue."
        });
        return;
    }

    return res.status(201).json({
        msg: "Issue created.",
        issue,
    });
});

/*

--- GET ENDPOINTS ---

*/
app.get("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const orgs = await Organization.find({
        admin: userId
    });
    return res.status(200).json({
        msg: "org fetched.",
        organization: orgs
    })
});

app.get("/organization/:orgId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { orgId } = req.params;

    if (!orgId) {
        return res.status(400).json({ msg: "orgId is required" });
    }

    const org = await Organization.findById(orgId)
        .populate("members", "username _id");

    if (!org) {
        return res.status(404).json({
            msg: "Organization not found"
        });
    }

    return res.status(200).json({
        org
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