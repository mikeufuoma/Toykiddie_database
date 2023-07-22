const Joi = require('joi');
const mongoose = require('mongoose');

const Transaction = mongoose.model('Transactions', new mongoose.
Schema({
    reference: {type: String},
    acceptingUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    initiatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message:{type: String},
    transactionMethod: {type: String},
    status: {
        type: String,
        default: 'pending'
     },
}));

function validateTransaction(transactions) {
    const Schema = {
        accepttingUser: Joi.String().required(),
        reference: Joi.String().required(),
        initiatedUser: Joi.String().required(),
        transactionMethod: Joi.String().required(),
        status: Joi.String().required()
    };
    return joi.valdate(transactions, Schema)
}

exports.Transaction = Transaction
exports.valdate = validateTransaction
