const jwt = require("jsonwebtoken");
const { User } = require("./models.js");

async function authMiddleware(req, res, next) {
    const token = req.header("Authorization");
    console.log(token);
    if (!token) {
        return res.status(401).json({
            msg: "Token missing"
        });
    }

    const decoded = jwt.verify(token, "23890239kdjsj");
    const userId = decoded.userId;

    const doesUserExist = await User.findById(userId);

    if (doesUserExist) {
        req.userId = userId;
        next();
    } else {
        res.status(403).json({
            msg: "Incorrect token"
        });
    }

}

module.exports = authMiddleware;