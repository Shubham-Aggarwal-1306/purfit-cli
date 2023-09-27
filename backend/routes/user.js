const express = require("express");
const router = express.Router();

const { getOverview, getRank, getPreferences, addGoals, addFrequency, getActivityTrack } = require("../controllers/user");
const authToken = require("../middleware/authToken");

router.route("/overview").get(authToken, getOverview);
router.route("/rank").get(authToken, getRank);
router.route("/preferences").get(authToken, getPreferences);
router.route("/preferences/goals").post(authToken, addGoals);
router.route("/preferences/frequency").post(authToken, addFrequency);
router.route("/activiyTrack").get(authToken, getActivityTrack);

module.exports = router;