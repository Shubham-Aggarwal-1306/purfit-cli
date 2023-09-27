const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.userId;
    req.guildId = decodedToken.guildId;
    next();
}