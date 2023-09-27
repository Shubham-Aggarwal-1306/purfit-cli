const { Schema, model, default: mongoose } = require('mongoose');

const activitySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        enum: ['posture', 'hydration', 'eyeBreaks', 'stretching', 'movement', 'mindfulBreathing'],
        required: true,
    },
    activity: {
        type: String,
        required: true,
    },
    benefits: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

module.exports = model('Activity', activitySchema);


