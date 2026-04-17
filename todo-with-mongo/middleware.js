const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        res.status(400).json({
            msg: "Token is missing."
        });
        return;
    }
    try {
        const decodedToken = jwt.verify(token, "90239023");
        req.userId = decodedToken.id;
        req.username = decodedToken.username;
        next();
    } catch (e) {
        res.json(403).json({
            msg: "Invalid token"
        });
    }
}

module.exports = { authMiddleware };