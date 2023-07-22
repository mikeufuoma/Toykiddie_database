const express = require('express');
const { Toys } = require('../model/toysModel');
const { Transaction } = require('../model/transaction');
const { User } = require('../model/userModel'); 
const { TransactionsItem } = require('../model/transactionsItem');


const GetToy = async (req, res) => {

    const id = req.params.id;

    const initiatedUser = req.user._id;

    const toy = await Toys.findById(id);

    if(!toy) return res.status(400).send({
        status: 'error',
        message: 'Toy does not exist'
    })

    if(!toy.status) return res.status(400).send({
        status: 'error',
        message: 'Toy has been taken'
    })

    if(toy.owner == initiatedUser){ 
        return res.status(400).send({
            status: 'error',
            message: 'Toy Belongs to you'
        })
   }
    const accepttingUser = toy.owner
    const originalOwner = await User.findById(accepttingUser);


    const randomNumber = Math.floor(Math.random() *
        (9999999 - 100000) + 100000).toString();
    
    const transaction = await Transaction.create({
        reference:'kiddiesToy' + randomNumber,
        acceptingUserId: originalOwner._id,
        initiatedUserId: initiatedUser,
        transactionMethod: req.body.transactionMethod
    })

    if(!transaction) return res.status(400).send({
        status: 'error',
        message: 'transaction not successful'
    })

     await TransactionsItem.create({
        reference:'kiddiesToy' + randomNumber,
        toyId: toy._id,
        owner:originalOwner._id
    })

    return res.send({
        status: 'success',
        message: 'transaction successful',
        data:transaction
    })
    
}


const SwapToys = async (req, res) => {

    const initiatedUser = req.user._id;

    const firstId = req.params.idOne;
    const SecondId = req.params.idTwo;
    
    const toyOne = await Toys.find({_id:firstId, status:true});

    if (!toyOne) return res.status(400).send({
        status: 'error',
        message: 'Toy does not exist'
    })

     
    const toyTwo = await Toys.find({_id:SecondId, status:true});

    if (!toyTwo) return res.status(400).send({
        status: 'error',
        message: 'Toy does not exist'
    })


    const randomNumber = Math.floor(Math.random() *
        (9999999 - 100000) + 100000).toString();


    const transaction = await Transaction.create({
        reference:'kiddiesToy' + randomNumber,
        acceptingUserId: toyTwo.originalOwner,
        initiatedUserId: initiatedUser,
        transactionMethod: req.body.transactionMethod,
        status: 'success'
    })

    if(!transaction) return res.status(400).send({
        status: 'error',
        message: 'transaction not successful'
    })

    const transactionsItemForToyOne = await TransactionsItem.create({
        reference:'kiddiesToy' + randomNumber,
        owner:toyOne.owner,
        toyId: toyOne._id,

    });

    const transactionsItemForToyTwo = await TransactionsItem.create({
        reference:'kiddiesToy' + randomNumber,
        owner:toyTwo.owner,
        toyId: toyTwo._id,

    })

    return res.send({
        status:'success',
        message: 'transaction successful',
        data:transaction
    })



}


const RejectTransaction = async (req, res) => {

    const userId = req.user._id;

    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId)

    if(!transaction) return res.status(404).send({
        status: 'error',
        message: 'transaction does not exist'
    });

    if(transaction.acceptingUserId !== userId) return res.status(404).send({
        status: 'error',
        message: 'Permission denieled'
    });

    transaction.status = 'rejected';
    await transaction.save();

    res.send({
        status: 'success',
        message: 'your have rejected this request',
        data:transaction
    });
}

const AcceptingGiftTransaction = async(req, res) => {
    
    const userId = req.user._id;


    const transactionId = req.params.id;
    const transaction = await Transaction.findById(transactionId);

    if(!transaction) return res.status(404).send({
        status: 'error',
        message: 'transaction does not exist'
    });
    
    const transactionReference = transaction.reference;

    const giftingToy = await TransactionsItem.find({reference:transactionReference, owner:userId});

    if(!giftingToy){
        return res.send({
            status:'error',
            message: 'permission denied'
        })
      }
    
    const updateToy = await Toys.findById(giftingToy[0].toyId);
   
    // return console.log(giftingToy[0].toyId)
    if(!updateToy){
        return res.send({
            status: 'error',
            message: 'toy is not available'
        });
     }

    // return console.log(giftingToy.owner + ' is available' + transaction.initiatedUserId);

    updateToy.previousOwner = userId;
    updateToy.owner = transaction.initiatedUserId;
    updateToy.status = false;   
    await updateToy.save();

    transaction.status  = 'success';
    await transaction.save();

    res.send({
        status: 'success',
        message: 'You have accepted this offer'
    })
}

const AcceptingTransaction = async (req, res) => {

    const userId = req.user._id;


    const transactionId = req.params.id;
    const transaction = await Transaction.findById(transactionId);

    if(!transaction) return res.status(404).send({
        status: 'error',
        message: 'transaction does not exist'
    });

    const transactionReference = transaction.reference;

    const comfirmReference = await TransactionsItem.find({reference:transactionReference});

    const giftingToy = await TransactionsItem.find({reference:transactionReference, owner:userId});

    if(!giftingToy){
        return res.send({
            status:'error',
            message: 'permission denied'
        })
    }
    
    const initiatorsToy = await TransactionsItem.find({reference:transactionReference, owner:transaction.initiatedUserId});

    if(!initiatorsToy){
          return res.send({
            status: 'error',
            message: 'toy does not available'
          })
        }

    // Updating the AcceptingUser Toy

    const updateToy = await Toys.findById(giftingToy.toyId);
    if(!updateToy.status){

        return res.send({
            status: 'error',
            message: 'toy does not available'
        });

    }

    updateToy.owner = initiatorsToy.owner;
    updateToy.previousOwner = giftingToy.owner;
    updateToy.status = false;

    // Updating Initiators Toy

    const updateInitiatorsToy = await Toys.findById(initiatorsToy.toyId);
    if(!updateInitiatorsToy.status){
        return res.send({
            status: 'error',
            message: 'toy does not available'
        });
    } 
    
    updateInitiatorsToy.owner = giftingToy.owner;
    updateInitiatorsToy.previousOwner = initiatorsToy.owner;
    updateInitiatorsToy.status = false;

    await updateToy.save();
    await updateInitiatorsToy.save();
   
    transaction.status  = 'success'
    await transaction.save();

    res.send({
        status: 'success',
        message: 'You have accepted the this offer'
    })
}

const getRequest = async (req, res) => {
    const userId = req.user._id;
    const request = await Transaction.find({acceptingUserId:userId}).populate(['acceptingUserId', 'initiatedUserId']).exec();
    if(!request) {
        return res.send({
            status: 'error',
            message:"no request found"
        })
    }
    res.send({
        status: 'success',
        message:"request found",
        data:request
    })
}

const getChat = async (req, res) => {
    const userId = req.user._id;
    const request = await Transaction.find({initiatedUserId:userId}).populate(['acceptingUserId', 'initiatedUserId']).exec();
    if(!request) {
        return res.send({
            status: 'error',
            message:"no request found"
        })
    }
    res.send({
        status: 'success',
        message:"request found",
        data:request
    })

}



module.exports = {
    GetToy,
    SwapToys,
    RejectTransaction,
    AcceptingTransaction,
    AcceptingGiftTransaction,
    getChat,
    getRequest
}