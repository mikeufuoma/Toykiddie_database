const Joi = require('joi');
const mongoose = require('mongoose');

const Message = mongoose.model('Message', new mongoose.
Schema({
    reference:{type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    msgType: {type:String},
    message: { type: String},
    status:{type:Boolean, default:true},
}));

function validateTransaction(transactions) {
    const Schema = {
        message: Joi.String().required(),
    };
    return joi.valdate(transactions, Schema)
}

exports.Message = Message
exports.valdate = validateTransaction
