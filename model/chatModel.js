const Joi = require('joi');
const mongoose = require('mongoose');

const Chat = mongoose.model('Chat', new mongoose.
Schema({
    reference:{type: String},
    users: [{
        type:  mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    status:{type:Boolean, default:true},
}));

// function validateTransaction(transactions) {
//     const Schema = {
//         accepttingUser: Joi.String().required(),
//         reference: Joi.String().required(),
//         initiatedUser: Joi.String().required(),
//         transactionMethod: Joi.String().required(),
//         status: Joi.String().required()
//     };
//     return joi.valdate(transactions, Schema)
// }

exports.Chat = Chat
// exports.valdate = validateTransaction
