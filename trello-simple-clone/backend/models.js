const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        }
    }, {
    timestamps: true,
});

const orgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
}, { timestamps: true, });


const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organization"
    }
}, { timestamps: true });

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "board"
    },
    status: {
        type: String,
        enum: ["IN_PROGRESS", "DONE", "PENDING"],
        default: "PENDING",
    }
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
const Organization = mongoose.model("organization", orgSchema);
const Board = mongoose.model("board", boardSchema);
const Issue = mongoose.model("issue", issueSchema);