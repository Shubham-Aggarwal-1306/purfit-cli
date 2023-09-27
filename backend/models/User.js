const { Schema, model, default: mongoose } = require('mongoose');

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },
    tag: {
        type: String,
    },
    discriminator: {
        type: String,
    },
    avatar: {
        type: String,
    },
    guildId: {
        type: String,
        required: true,
    },
    guildName: {
        type: String,
        required: true,
    },
    guildIcon: {
        type: String,
    },
    preferences: {
        goals: [
            {
                type: String,
            }
        ],
        start : {
            type: Boolean,
            default: false,
        },
        startedAt: {
            type: Date,
        },
        frequency: {
            type: Number,
            default: 0,
        },
    },
    timeStamps: [
        {
            startTime: {
                type: Date,
                default: Date.now,
            },
            endTime: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    activityHistory: [  
        {
            activity: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Activity',
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    totalPoints: {
        type: Number,
        default: 0,
    },        
});

module.exports = model('User', userSchema);