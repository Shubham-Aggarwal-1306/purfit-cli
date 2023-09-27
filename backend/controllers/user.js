const badges = require("../data/badges");
const { getActivityCount, getPreferences, getHistory, addGoals, addFrequency, getActivityCountByGoal } = require("../services/user");

exports.getOverview = async (req, res) => {
    try {
        const { userId, guildId } = req;
        const activities = await getActivityCount({ userId, guildId });
        const preferences = await getPreferences({ userId, guildId });

        const history = await getHistory({ userId, guildId });

        let badge = badges[0];
        let index = 0;
        for (const element of badges) {
            if (element.activites <= activities) {
                badge = element;
                index++;
            }
        }
        const nextBadge = badges[index];

        res.status(200).json({
            success: true,
            data: {
                preferences,
                ranks: {
                    activities: activities,
                    badge,
                    nextBadge,
                },
                history,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

exports.getRank = async (req, res) => {
    try {
        const { userId, guildId } = req;

        const history = await getActivityCount({ userId, guildId });

        let badge = badges[0];
        let index = 0;
        for (const element of badges) {
            if (element.activites <= history) {
                badge = element;
                index++;
            }
        }

        res.status(200).json({
            success: true,
            data: {
                badge
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}

exports.getPreferences = async (req, res) => {
    try {
        const { userId, guildId } = req;

        const preferences = await getPreferences({ userId, guildId });

        res.status(200).json({
            success: true,
            data: {
                preferences,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}

exports.addGoals = async (req, res) => {
    try {
        const { userId, guildId } = req;
        const { goals } = req.body;

        await addGoals({ userId, guildId, goals });

        res.status(200).json({
            success: true,
            message: "Goals added successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}

exports.addFrequency = async (req, res) => {
    try {
        const { userId, guildId } = req;
        const { frequency } = req.body;

        if (!frequency) return res.status(400).json({
            success: false,
            error: "Frequency not provided",
        });

        await addFrequency({ userId, guildId, frequency });

        res.status(200).json({
            success: true,
            message: "Frequency added successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}


exports.getActivityTrack = async (req, res) => {
    try {
        const { userId, guildId } = req;

        const history = await getHistory({ userId, guildId });
        const activityCount = await getActivityCountByGoal({ userId, guildId });

        res.status(200).json({
            success: true,
            data: {
                history,
                activityCount,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}