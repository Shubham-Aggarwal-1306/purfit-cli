const Auth = require('../models/Auth');

exports.createUser = async (data) => {
    const user = await Auth.create(data);
    return user;
}

exports.getUser = async (data) => {
    const user = await Auth.findOne(data);
    return user;
}