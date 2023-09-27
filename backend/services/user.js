const goals = require('../data/goals');
const User = require('../models/User');
const Activity = require('../models/Activity');


exports.getGuilds = async (data) => {
    
    const guilds = await User.find({ userId: data.userId }).select('guildId -_id guildName guildIcon');
    return guilds;
}

exports.getActivityCount = async (data) => {
    try {
        const { userId, guildId } = data;

        const user = await User.findOne({ userId, guildId });
        if (!user) return;

        const history = user.activityHistory || [];
        let noOfActivities = history.length;
        return noOfActivities;
    } catch (err) {
        console.log(err);
    }
}


exports.addGoals = async (data) => {
    try {
        const { userId, guildId, goals } = data;
        const user = await User.findOne({ userId, guildId });
        if (!user) return;
        user.preferences.goals = goals;
        await user.save();
    } catch (err) {
        console.log(err);
    }
}

exports.addFrequency = async (data) => {
    try {
        const { userId, guildId, frequency } = data;

        const user = await User.findOne({ userId, guildId });
        if (!user) return;
        user.preferences.frequency = frequency;
        await user.save();
    } catch (err) {
        console.log(err);
    }
}


exports.getPreferences = async (data) => {
    try {
        const { userId, guildId } = data;

        const user = await User.findOne({ userId, guildId });
        if (!user) return;
        return user.preferences;
    } catch (err) {
        console.log(err);
    }
}
// Last 6 month history by daily count using aggregate timeStamps
exports.getHistory = async (data) => {
    try {
        const { userId, guildId } = data;

        const history = await User.aggregate([
            {
                $match: {
                    userId,
                    guildId,
                },
            },
            {
                $match: {
                    'timeStamp': {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$timeStamp',
                        },
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        console.log(history);

        return history;
    }
    catch (err) {
        console.log(err);
    }
}

// Do this using aggregate
exports.getActivityCountByGoal = async (data) => {
    try {
        const { userId, guildId } = data;

        const user = await User.findOne({ userId, guildId }).populate('activityHistory.activity');
        if (!user) return;

        const history = user.activityHistory || [];
        let noOfActivitiesByGoals = [];
        goals.forEach((goal) => {
            let count = 0;
            history.forEach((activity) => {
                if (activity.activity.goal === goal.value) {
                    count++;
                }
            });
            if (count > 0) {
                noOfActivitiesByGoals.push({
                    goal: goal.label,
                    count,
                });
            }
        });
        console.log(noOfActivitiesByGoals);

        return noOfActivitiesByGoals;
    } catch (err) {
        console.log(err);
    }
}