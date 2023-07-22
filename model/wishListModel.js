const Joi = require('joi');
const mongoose = require('mongoose');
  
const Wishlist = mongoose.model('Wishlist', new mongoose.
Schema({
    toyId: { type: mongoose.Schema.Types.ObjectId, ref: "Toys" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}));

// function validateWishlist (wishlist) {
//     const Schema = {
//     };
//     return Joi.validate(wishlist, Schema)
// }

exports.Wishlist = Wishlist
// exports.validate = validateWishlist






