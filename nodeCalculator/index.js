const express = require("express");
const app = express();
let requestCount = 0;

function middleware(req, res, next) {
    requestCount++;
    next()
}
app.use(middleware);
app.use(express.json());

app.listen(3000, () => {
    console.log("App is connected to http://localhost:3000");
});

app.route("/req-count").get((req, res) => {
    res.json({
        count: requestCount,
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/sum", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        ans: a + b,
    });
});


app.get("/sub", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        ans: a - b,
    });
});


app.get("/multiply", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        ans: a * b,
    });
});

app.get("/divide", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        ans: a / b,
    });
});

