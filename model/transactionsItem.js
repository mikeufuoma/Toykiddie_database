const Joi = require('joi');
const mongoose = require('mongoose');

const TransactionsItem = mongoose.model('TransactionItem', new mongoose.
Schema({
    reference: {type: String},
    toyId: { type: mongoose.Schema.Types.ObjectId, ref: "Toys" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status:{type:String, default:'pending'},
}));


function validateTransactionsItem (transactionsIttem) {
    const Schema = {
        reference:Joi.String().require(),
        toyId:Joi.String().require(),
        status:Joi.String().require(),
        
    }
    return Joi.validate(transactionsIttem, Schema)
}

exports.TransactionsItem = TransactionsItem
exports.validate = validateTransactionsItem
