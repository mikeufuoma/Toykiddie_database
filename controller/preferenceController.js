const express = require('express');
const { Preference } = require('../model/preferenceModel');
const { User } = require('../model/userModel');


const addPreference = async (req, res) => {
    const id = req.user._id;

    const user = await User.findById(id);
    if(!user) return res.status(400).send({
        status: 'error',
        message: 'user does not exist'
    });

    const getPref = await Preference.find({userId: id})
    if(getPref) {
        return res.send({
            status: 'success',
            message: 'added successfully',
            data:user
        })
    }

    const preference = new Preference({
        userId: id,
        gender: req.body.gender,
        ageRange: req.body.ageRange,
        interest: req.body.interest
    });
    preference.save();
    
    user.regStatus = 4;
    await user.save();



    res.send({
        status: 'success',
        message: 'added successfully',
        data:user
     });
}

const getPreference = async (req, res) => {
    const preference = await Preference.find()
    res.send({
        status: 'success',
        preference:preference
    })
}

const updatePreference = async (req, res) => {
    const  id = req.user._id;

    const preference = await Preference.findById(id);
    if(!preference) return res.status(400).send({
        status:'error',
        message:'user does not exist'
    });


    preference.gender= req.body.gender,
    preference.agerange= req.body.agerange,
    preference.interest= req.body.interest

    await preference.send();

    res.send({
        status: 'success',
        message: 'preference updated successfully',
        preference:preference
    })
}


module.exports = {
    addPreference,
    getPreference,
    updatePreference
}