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

exports.getHistory = async (data) => {
    try {
        const { userId, guildId } = data;

        // Daily Count of Activities
        const activityHistory = await User.findOne({ userId, guildId }).select('activityHistory -_id');
        if (!activityHistory) return;
        
        // Date Wise Count of Activities

        let history = [];

        activityHistory.activityHistory.forEach((activity) => {
            let date = new Date(activity.timestamp);
            let dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            let index = history.findIndex((item) => item.date === dateString);
            if (index === -1) {
                history.push({
                    date: dateString,
                    count: 1,
                });
            } else {
                history[index].count++;
            }
        });
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