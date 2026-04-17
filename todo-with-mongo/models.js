const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    }
},
    {
        timestamps: true
    });


const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"

    }
},
    {
        timestamps: true
    });


const userModel = mongoose.model("users", UserSchema);
const todoModel = mongoose.model("todos", TodoSchema);

module.exports = { userModel, todoModel };