
const config = require('../config');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    profImage:{type: String},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, lowercase: true},
    phoneNumber: {type: String},
    gender: {type: String},
    address: {type: String},
    location: {
        type: { 
            type: String, 
            enum: ['Point'] 
        },
        coordinates: { 
            type: [Number] 
        }
    },
    rate: {type: Number, default: 0},
    swaped: {type: Number, default: 0},
    gived: {type: Number, default: 0},
    password: {type: String},
    activeStatus: {type: String, default: false},
    regStatus: {type: Number, default: 1},
    confirmPin:{type: Number}
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id }, config.get('jwtPrivateKey'))
    return token;
}

userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        email: Joi.string().required(),
        phoneNumber: Joi.string().required().allow(''),
        password: Joi.string().required(),
    };
    return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser