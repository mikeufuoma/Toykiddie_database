const express = require('express');
const { Chat } = require('../model/chatModel');
const { User } = require('../model/userModel'); 
const { Message } = require('../model/messageModel');



const initialChat = async (req, res) => {
    const userOne = req.user._id;
    const userId = req.params.id;


    const user = await User.findById(userId);
    if(!user) return res.status({
        status:"error",
        message: "User not found"
    });
    const userTwo = user._id;
    const usersArray = [userOne, userTwo];


    const checkChatInit = await Chat.find({users : {$all: [userOne, userTwo]}})
//    return console.log(JSON.stringify(checkChatInit[0].reference, null, 2) );

    if(checkChatInit){
        const data = await Message.create({
             reference:checkChatInit[0].reference,
             user:userOne,
             msgType:req.body.type,
             message:req.body.message
         })
         return res.send({
             status: 'success',
             message: 'chat successful',
             data:data
         })

    }

    const randomNumb = Math.floor(Math.random() *
        (9999999 - 100000) + 100000).toString();
    
    const createNewChat = await Chat.create({
        reference:randomNumb,
        users:usersArray
    });

    if(!createNewChat) return res.status(400).send({
        status: 'error',
        message: 'Chat not successful'
    });

    const data = await Message.create({
         reference:randomNumb,
         user:userOne,
         msgType:req.body.type,
         message:req.body.message
     })


    return res.send({
        status: 'success',
        message: 'transaction successful',
        data:data
    })
    





}


const getInitialChat = async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if(!user) return res.status({
        status:"error",
        message: "User not found"
    });

    const checkChatInit = await Chat.find({users : {$all: [userId]}}).populate(['users']).exec();

    // const chatRef = checkChatInit[0].reference;
    // return console.log(JSON.stringify(checkChatInit, null, 2));

    if(!checkChatInit) return res.send({
        status: 'error',
        message: 'No Chat initialized'
    })


    res.send({
        status:"success",
        data:checkChatInit,
        user:user
    })

}


const getMyChat = async (req, res) => {
    const userOne = req.user._id;
    const userId = req.params.id;

    


    const user = await User.findById(userId);
    if(!user) return res.status({
        status:"error",
        message: "User not found"
    });
    const userTwo = user._id;
    

    const usersArray = [userOne, userTwo];

    // console.log(usersArray);

    const checkChatInit = await Chat.find({users : {$all: [userOne, userTwo]}});
    if(checkChatInit.length <= 0){ 
        res.status({
            status:"error",
            message: "no chat found"
        });
        return 
     }

     console.log("Chat gotten" + checkChatInit)


    const chatRef = checkChatInit[0].reference;
    // console.log(chatRef);

    const msg = await Message.find({reference:chatRef});

    // console.log(JSON.stringify(msg, null, 2));

    res.send({
        status:"success",
        data:msg
    })

}




module.exports = {
    initialChat,
    getMyChat,
    getInitialChat
}
