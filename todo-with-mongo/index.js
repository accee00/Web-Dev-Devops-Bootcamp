const env = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("./middleware.js");
const { userModel, todoModel } = require("./models.js");
env.config({
    path: "./.env"
});
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
})


app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username?.trim() || !password?.trim()) {
        res.status(400).json({
            msg: "Both feilds are required."
        });
        return;
    }

    const isUserPresent = await userModel.exists({ username });

    if (isUserPresent) {
        res.status(409).json({
            msg: "User with this username exist."
        });
        return;
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, password: hashPassword
    });

    if (!user) {
        res.status(500).json({
            msg: "error while crreating user"
        });
        return;
    }

    return res.status(201).json({
        msg: "user created.",
        data: user._id,
    });
});

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username?.trim() || !password?.trim()) {
        res.status(400).json({
            msg: "Both feilds are required."
        });
        return;
    }

    const user = await userModel.findOne({ username });


    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect || !user) {
        res.status(401).json({
            msg: "Invalid credentials"
        })
        return;
    }
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, "90239023");

    return res.status(200).json({
        msg: "Sign in success.",
        token
    });
});

app.post("/todo", authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId;
    if (!title?.trim() || !description?.trim()) {
        res.status(400).json({
            msg: "Title for todo is required."
        });
        return;
    }
    const todo = await todoModel.create({
        title, description, user: userId
    });

    if (!todo) {
        res.status(500).json({
            msg: "error while creating a todo"
        });
        return;
    }

    return res.status(201).json({
        msg: "Todo added",
        data: todo
    });
});

app.get("/todos", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const todos = await todoModel.find({ user: userId });
    return res.status(200).json({
        todos: todos
    });
});

app.delete("/todo/:todoId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { todoId } = req.params;

    const result = await todoModel.findOneAndDelete({
        _id: todoId,
        user: userId
    });

    if (!result) {
        return res.status(404).json({
            success: false,
            msg: "todo not found or u dont have permission"
        });
    }
    return res.status(200).json({
        success: true,
        msg: "todo deleted"
    });

});