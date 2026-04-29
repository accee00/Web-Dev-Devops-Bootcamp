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

    if (!doesUserExist) {
        res.status(401).json({
            msg: "Invalid credentials"
        })
        return;
    }
    const isPassCorrect = await bcrypt.compare(password, doesUserExist.password);


    if (!isPassCorrect) {
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
        res.status(400).json({
            msg: "orgId is required"
        });
        return
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


app.get("/boards", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { orgId } = req.query;
    if (!orgId) {
        res.status(400).json({
            msg: "orgId is required"
        });
        return;
    }
    const org = await Organization.findById(orgId);
    if (!org) {
        res.status(404).json({
            msg: "Organization not found"
        });
        return;
    }
    const isAdmin = org.admin.toString() === userId;
    const isMember = org.members.includes(user._id);

    if (!isAdmin && !isMember) {
        res.status(403).json({
            msg: "You are neither admin nor member."
        });
        return;
    }

    const boards = await Board.find({
        organization: orgId
    });
    if (!boards) {
        res.status(404).json({
            msg: "Boards not found."
        });
        return;
    }

    return res.status(200).json({
        msg: "Board fetched.",
        boards
    });
});


app.get("/issues/:boardId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { boardId } = req.params;
    if (!boardId) {
        res.status(400).json({ msg: "boardId is required" });
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
    if (!org) {
        res.status(404).json({
            msg: "Organization not found"
        });
        return;
    }
    const isAdmin = org.admin.toString() === userId;
    const isMember = org.members.includes(user._id);
    if (!isAdmin || !isMember) {
        res.status(403).json({
            msg: "You are not member or admin of this org board."
        });
        return;
    }
    const issues = await Issue.find({
        board: boardId,
    });

    if (!issues) {
        res.status(404).json({
            msg: "No issue found"
        });
        return;
    }

    return res.status(200).json({
        msg: "Issues fetch success.",
        issues
    });
});

app.get("/members", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { orgId } = req.query;
    if (!orgId) {
        res.status(400).json({
            msg: "orgId is required"
        });
        return;
    }

    const org = await Organization.findById(orgId)
        .populate("members", "username _id");

    if (!org) {
        res.status(404).json({
            msg: "Organiztion not found."
        });
        return;
    }
    const isAdmin = org.admin.toString() === userId;
    const isMember = org.members.includes(user._id);
    if (!isAdmin || !isMember) {
        res.status(403).json({
            msg: "You are not member or admin of this org board."
        });
        return;
    }
    return res.status(200).json({
        msg: "Member fetch success.",
        memebers: org.members
    });
});
app.put("/issue", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { issueId, issueState } = req.body;

    const ISSUE_ENUM = ["IN_PROGRESS", "DONE", "PENDING"];

    if (!issueId || !issueState?.trim()) {
        return res.status(400).json({
            msg: "issueId and issueState are required"
        });
    }


    if (!ISSUE_ENUM.includes(issueState)) {
        return res.status(400).json({
            msg: "Invalid issue state"
        });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
        return res.status(404).json({
            msg: "Issue not found"
        });
    }

    const board = await Board.findById(issue.board);
    if (!board) {
        return res.status(404).json({
            msg: "Board not found"
        });
    }

    const org = await Organization.findById(board.organization);
    if (!org) {
        return res.status(404).json({
            msg: "Organization not found"
        });
    }

    const isAdmin = org.admin.toString() == userId;
    const isMember = org.members.includes(userId);

    if (!isAdmin && !isMember) {
        return res.status(403).json({
            msg: "You are not member or admin of this org board/issue."
        });
    }

    issue.issueState = normalizedState;
    await issue.save();

    return res.status(200).json({
        msg: "Issue updated successfully",
        issue
    });
});


app.delete("/members", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { orgId, memberUserName } = req.body;

    if (!orgId || !memberUserName?.trim()) {
        res.status(400).json({
            msg: "orgId and memberUserName are required"
        });
        return;
    }


    const org = await Organization.findById(orgId);
    if (!org) {
        res.status(404).json({
            msg: "Organization not found"
        });
        return;
    }


    if (!org.admin.toString() === userId) {
        res.status(403).json({
            msg: "Only admin can remove members"
        });
        return;
    }

    const user = await User.findOne({ username: memberUserName });
    if (!user) {
        res.status(404).json({
            msg: "User not found"
        });
        return;
    }



    const isMember = org.members.includes(userId);
    if (!isMember) {
        res.status(400).json({
            msg: "User is not a member of this organization"
        });
        return;
    }

    org.members = org.members.filter(member =>
        !member.equals(user._id)
    );

    await org.save();

    return res.status(200).json({
        msg: "Member removed successfully"
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