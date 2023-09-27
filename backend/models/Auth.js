const { Schema, model, default: mongoose } = require('mongoose');

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },      
});

module.exports = model('Auth', userSchema);