const express = require("express")

const app = express();
const FRONTENDTPATH = __dirname;
app.use(express.json());
let notes = [];

app.post("/notes", (req, res) => {
    const note = req.body.note;
    notes.push(note);
    return res.status(201).json({
        msg: "Note added"
    });
});

app.get("/notes", (req, res) => {
    return res.json(notes);
});

app.get("/", (req, res) => {
    res.sendFile(FRONTENDTPATH + "/frontend/index.html")
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});