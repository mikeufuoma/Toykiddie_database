const { User, validate} = require('../model/userModel')
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const postmark = require("postmark");
const nodemailer = require('nodemailer');


const client = new postmark.ServerClient("259a48da-4b17-43b8-8cfb-0942fccee947");


function validateLogin(req) {
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required(),
    };

    return Joi.validate(req, schema);
}


const login = async(req, res) => {
    try {

        const {error} = validateLogin(req.body);
        if (error) {
            return res.status(400).send({
                status: "error",
                message: error.details[0].message
            });
         }

        const user = await User.findOne({email: req.body.email});
        
        if (!user) {
            return res.status(400).send({
                status: "error",
                message: 'Invalid Email address or password'
            });
        }
        
        const validPass = await bcrypt.compare(req.body.password, user.password);

        console.log(validPass);

        if (validPass === false) {
            return res.status(400).send({
                status: "error",
                message: "Invalid email or password"
            })
        }

        const token = user.generateAuthToken();

        if (user.regStatus <= 3) {
            return res.status(400).send({
                status: "incomplete",
                data: user,
                token: token
            });
        }

        return res.send({
            status: "success",
            token: token,
            data: user
        });
    } catch (e) {
        console.log(e)
        return res.send({
            status: "error",
            message: e
        });
    }

}

const registration = async (req, res) => {

    const phoneNumber = await User.findOne({phoneNumber: req.body.phoneNumber});
    if(phoneNumber) return res.status(400).send({
        status: 'error',
        message: 'user already exist'
    });

    const email = await User.findOne({email: req.body.email}) 
    if(email) return res.status(400).send({
        status: 'error',
        message: 'user already registered'
    });

    const saltRounds = 10;
    const password = req.body.password;
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log(code);
     
    const emailReq = req.body.email;
    const newEmail = emailReq.toLowerCase();

    await bcrypt.hash(password, saltRounds, function (err, hash){
        // store hash your db password
       const user = new User({
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: hash,
            confirmPin: code
        });
        user.save();

        client.sendEmail({
            "From": "no-reply@toykiddies.com",
            "To": newEmail,
            "Subject": "OTP Pin",
            "TextBody": `Hello, your OTP is ${code}`
        });
        
        const token = user.generateAuthToken();

        //send pin to email here

        res.send({
            token:token,
            user:user,
            status: 'success'
        })
    })
}

const pinConfirmation = async (req, res) => {
     const userId = req.user._id;
     const pin = req.body.pin;

     const user = await User.findById(userId)
     if(Number(pin) === Number(user.confirmPin)){
        user.regStatus = 2
        await user.save();
        console.log("correct pin")
        return res.send({
            status: 'success',
            message: 'Pin Correct'
        })
      }else{
        console.log("no pin")
        return res.send({
            status: 'error',
            message: 'Invalid Pin'
        })
      }
}

const forgottenPassword = async(req, res) => {
    const emailReq = req.body.email;
     const email = emailReq.toLowerCase();

     const user = await User.findOne({ email: email });
     if(!user){
        return res.send({
            status: 'error',
            message: 'User does not exist'
        })
       }
        const code = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'toykiddieaustralia@gmail.com',
                pass: 'rvaimevhgvbzbpvq'
             }
          });
        
        const mailOptions = {
            from: 'no-reply@toykiddie.com',
            to: email,
            subject: "OTP Pin",
            text: `Hello, your OTP is ${code}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
    
     user.confirmPin = code;
     await user.save();

     return res.send({
        status: 'success',
        message: 'OTP sent. Please check your email'
     })

}


const pinRest = async (req, res) => {
    const pin = req.body.pin;
    const email = req.body.email;

    const user = await User.findOne({email:email});
    if(!user) return res.send({
        status: 'error',
        message: 'Invalid email'
    })

    if(Number(pin) === Number(user.confirmPin)){

       return res.send({
           status: 'success',
           message: 'Pin is Correct'
       })
     }else{
       return res.send({
           status: 'error',
           message: 'Invalid Pin'
       })
     }
}

const regUserDetails = async (req, res) => {
    const id = req.user._id;

    // console.log(req.body.state);
    //  console.log(parseFloat(req.body.long));
    // return console.log(parseFloat(req.body.lat));

    const user = await User.findById(id);

    if(!user) return res.status(400).send({
        status: 'error',
        message: 'user does not exist'
    });

    
    
   
    user.profImage = req.files.profImage[0].filename;
    user.firstName = req.body.firstname;
    user.lastName = req.body.lastname;
    user.gender = req.body.gender;
    user.address = req.body.state;
    user.location = {
        type: 'Point',
        coordinates: [req.body.long, req.body.lat]
    },
    user.regStatus = 3
    await user.save();

    res.send({
        status: 'success',
        message: 'user details updated',
        user: user
    })
}

const getUser = async (req, res) => {
    const users = await User.find()
    res.send({
        status: 'success',
        users:users
    })
}

const putUserDetails = async (req, res) => {
    const id = req.user._id

    const user = await User.findById(id)

    if(!user) return res.status(400).send({
        status: 'error',
        message: 'user does not exist'
    });

    user.firstName = req.body.firstName;
    user.firstName = req.body.firstName;
    user.firstName = req.body.firstName;
    user.firstName = req.body.firstName;
    user.firstName = req.body.firstName;
    user.firstName = req.body.firstName;
    await user.save();

    res.send({
        status: 'success',
        message: 'user details updated',
        user: user
    })
}

const me = async(req, res) => {
    const id = req.user._id

    const user = await User.findById(id);

    if(!user) return res.status(400).send({
        status: 'error',
        message: 'user does not exist'
    });

    res.send({
        status: 'success',
        message: 'success',
        data: user
    })

}


const updateDetails = async (req, res) => {
    const id = req.user._id

    const user = await User.findById(id);

    if(!user) return res.status(400).send({
        status: 'error',
        message: 'user does not exist'
    });
    // return console.log(req.files.profImage[0].filename)
    
   
    user.firstName = req.body.firstname;
    user.lastName = req.body.lastname;
    user.gender = req.body.gender;
    await user.save();

    res.send({
        status: 'success',
        message: 'Profile updated',
        data: user
    })
}

const changePassword = async (req, res) => {
    
    const email = (req.body.email).toLowerCase();

    const user = await User.findOne({email:email});
    if(!user) return res.send({
        status: 'error',
        message: 'Invalid email'
    })
    

    
    const saltRounds = 10;
    const newPassword = req.body.password;
    console.log(newPassword + " " + email)
    await bcrypt.hash(newPassword, saltRounds, function (err, hash) {

        user.password = hash;
        user.save();

        res.send({
            status: "success",
            message: 'Password updated'
        })
  }); 

}


module.exports = {
    login,
    registration,
    pinConfirmation,
    pinRest,
    regUserDetails,
    getUser,
    forgottenPassword,
    putUserDetails,
    me,
    updateDetails,
    changePassword
}