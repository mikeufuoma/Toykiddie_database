const Joi = require('joi');
const mongoose = require('mongoose');
 

const Preference = mongoose.model('Preference', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",unique: true },
    gender: { type: String },
    ageRange: { type: String },
    interest: [{
        type: String
    }]
    
}));


function validatePreference (preference) {
    const Schema = {
        gender: Joi.string().required(),
        ageRange: Joi.string().required(),
        interest: Joi.string().required(),
    }

    return Joi.validate(preference, Schema);
}

exports.Preference = Preference;
exports.validate = validatePreference