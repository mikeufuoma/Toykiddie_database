const express = require('express');
const { Toys  } = require('../model/toysModel');
const { User, validate } = require('../model/userModel');
const { Wishlist  } = require('../model/wishListModel');

const addToy = async (req, res) => {
    const id = req.user._id

    const user = req.user;

    const longitude = user.location.coordinates[0];
    const latitude = user.location.coordinates[1];


    // return console.log(req.files.imageOne[0].filename);
    const toys = new Toys({
        imageOne: req.files.imageOne[0].filename,
        imageTwo: req.files.imageTwo[0].filename,
        title: req.body.title,
        ageRange: req.body.ageRange,
        description: req.body.description,
        location:{
            type: 'Point',
            coordinates: [longitude, latitude]
        },
        owner: user._id,
        gender: req.body.gender,
        toyState: req.body.toyState,
        requestType: req.body.requestType
    });
    toys.save();
    res.send({
        status:'success',
        message:"Toy uploaded",
        toys: toys
    })

}

const getToys = async (req, res) => {
    const userId = req.user._id;

   
    const user = req.user;

    const longitude = user.location.coordinates[0];
    const latitude = user.location.coordinates[1];
    // const toys = await Toys.find({owner: {"$ne": userId },status:true}).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();

      try {

            const toys = await Toys.find(
                {
                    owner: {"$ne": userId },
                    status:true,
                    location:
                    {
                        $near:
                        {
                            $geometry: { 
                                type: "Point", 
                                coordinates: [longitude, latitude] 
                            },
                            $maxDistance: 500, // distance is in meters

                        }
                    },
                    
                }
            ).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();
            
            return  res.send({
                status: 'success',
                data:toys
            })
        } catch (error) {

            return res.status(400).json({ 
                mstatussg: "success", 
                message: "error"
              });   

        }

}


const getGiftToys = async (req, res) => {
    const userId = req.user._id;
    const user = req.user;

    const longitude = user.location.coordinates[0];
    const latitude = user.location.coordinates[1];


    try {

        const toys = await Toys.find(
            {
                owner: {"$ne": userId },
                status:true, requestType:'gift',
                location:
                {
                    $near:
                    {
                        $geometry: { 
                            type: "Point", 
                            coordinates: [longitude, latitude] 
                        },
                        $maxDistance: 500, // distance is in meters
                    }
                },
                
            }
        ).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();
        
        return  res.send({
            status: 'success',
            data:toys
        })
    } catch (error) {

        return res.status(400).json({ 
            mstatussg: "success", 
            message: "error"
          });   

    }



}

const getSwapToys = async (req, res) => {   
     const userId = req.user._id;

     
    const user = req.user;

    const longitude = user.location.coordinates[0];
    const latitude = user.location.coordinates[1];


    try {

    const toys = await Toys.find(
            {
                owner: {"$ne": userId },
                status:true, requestType:'swap',
                location:
                {
                    $near:
                    {
                        $geometry: { 
                            type: "Point", 
                            coordinates: [longitude, latitude] 
                        },
                        $maxDistance: 500, // distance is in meters

                    }
                },
                
            }
        ).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();
        
        return  res.send({
            status: 'success',
            data:toys
        })
    } catch (error) {

        return res.status(400).json({ 
            mstatussg: "success", 
            message: "error"
          });   

    }




    // const toys = await Toys.find({owner: {"$ne": userId },status:true, requestType:'swap'}).sort({createdAt:-1});
    // res.send({
    //     status: 'success',
    //     data:toys
    // })
}

const searchToy = async (req, res) => {
    const userId = req.user._id;
    
   const user = req.user;

   const longitude = user.location.coordinates[0];
   const latitude = user.location.coordinates[1];

    
    const toys = await Toys.find(
        {
            owner: {"$ne": userId },
            status:true, 
            title:req.body.inputText,
            location:
            {
                $near:
                {
                    $geometry: { 
                        type: "Point", 
                        coordinates: [longitude, latitude] 
                    },
                    $maxDistance: 500, // distance is in meters

                }
            },
            
        }
    ).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();

    return  res.send({
        status: 'success',
        data:toys
    })

    toys

    

}

const updateToy = async (req, res) => {
     const id = req.user._id;

     const toys = await Toys.findById(id)
     if(!toys) return res.status(400).send({
        status: 'error',
        message: 'user does not exist'
     })


     toys. image= req.path.file;
     toys. title= req.body.title;
     toys. ageRange= req.boy.ageRange;
     toys. description= req.body.description;
     toys. location=req.body.location;
     toys. originalOwner= req.body.originalOwner;
     toys. newOwner= req.body.newOwner;
     toys. gender= req.body.gender;
     toys. toyState= req.body.toyState;
     toys. methods= req.body.methods

     await toys.send();

     res.send({
        status:'success',
        message:'toys updated successfully',
        toys:toys
     })
}

const myToys = async (req, res) => {
    const userId = req.user._id;
    const toys = await Toys.find({owner: userId, status:true}).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();
    res.send({
        status: 'success',
        data:toys
    })
}

const myGiftToys = async (req, res) => {
    const userId = req.user._id;
    const toys = await Toys.find({owner: userId, requestType:"gift", status:true}).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();
    res.send({
        status: 'success',
        data:toys
    })
}

const mySwapToys = async (req, res) => {
    const userId = req.user._id;
    const toys = await Toys.find({owner: userId, requestType:"swap", status:true}).sort({createdAt:-1}).populate(['owner', 'previousOwner']).exec();
    res.send({
        status: 'success',
        data:toys
    })
}


const addWishList = async (req, res) => {
    const id = req.user._id;
    const toyId = req.params.toyId;
    // return console.log(toyId)

    const toy = await Toys.findById(toyId);
    if(!toy){
        return res.status(400).send({
        status: 'error',
        message: 'toy does not exist'
      })
    }
    

    const user = await User.findById(id);
    if(!user)return res.status(400).send({
        status: 'error',
        message: 'user does not exist'
    });

    const toyExist = await Wishlist.find({toyId:toy._id});
    console.log(toyExist)
    if(toyExist.length > 0){ 
        return res.status(400).send({
            status: 'error',
            message: 'Toy already exist in your wishlist'
        })
    }

    // return console.log(req.files.imageOne[0].filename);
    const wishlist = new Wishlist({
        toyId:toy._id,
        userId: user._id
    });
    wishlist.save();

    res.send({
        status:'success',
        message:"Toy successfully added to your Wishlist",
        data: wishlist
    })
    
}

const getWishList = async (req, res) => {
    const userId = req.user._id
    const toys = await Wishlist.find({userId:userId}).
    populate(['userId', 'toyId']).
    exec();

    res.send({
        status: 'success',
        data:toys
    })
}

const wishlistDetails = async (req, res) => {

}

const given = async(req, res) => {
    const userId = req.user._id;
    const toys = await Toys.find({previousOwner:userId, status:false, requestType:'gift'}).populate(['owner', 'previousOwner']).exec();
    res.send({
        status: 'success',
        data:toys
    })

}
const swaped = async(req, res) => {
    const userId = req.user._id;
    const toys = await Toys.find({previousOwner:userId, status:false, requestType:'swap'}).populate(['owner', 'previousOwner']).exec();
    res.send({
        status: 'success',
        data:toys
    })
}

module.exports = {
    addToy,
    getToys,
    getSwapToys,
    getGiftToys,
    updateToy,
    addWishList,
    getWishList,
    wishlistDetails,
    given,
    swaped,
    myToys,
    myGiftToys,
    mySwapToys,
    searchToy
}