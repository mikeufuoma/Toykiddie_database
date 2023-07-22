const Joi = require('joi');
const mongoose = require('mongoose');
  
const toySchema =  new mongoose.Schema({
    imageOne: { type: String},
    imageTwo: { type: String},
    title : {type: String},
    ageRange: { type: String},
    description: { type: String},
    location: {
        type: { 
            type: String, 
            enum: ['Point'] 
        },
        coordinates: { 
            type: [Number] 
        }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    previousOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gender: { type: String},
    category: { type: String},
    toyState: { type: String },
    status:{type:Boolean, default:true},
    requestType : { type: String} 
});

toySchema.index({ location: "2dsphere" });

const Toys = mongoose.model('Toys', toySchema)

function validateToys (toys) {
    const Schema = {
        image: Joi.String().require(),
        name: Joi.String().require(),
        ageRange: Joi.String().require(),
        description: Joi.String().require(),
        gender: Joi.String().require(),
    };
    return Joi.validate(toys, Schema)
}


exports.Toys = Toys
exports.validate = validateToys






