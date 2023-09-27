const express = require("express");
const { loginUser, getGuilds, changeGuild } = require("../controllers/auth");
const router = express.Router();
const authToken = require("../middleware/authToken");



router.route("/login").post(loginUser);
router.route("/guilds").get(authToken, getGuilds);
router.route("/guilds").post(authToken, changeGuild);

module.exports = router;
