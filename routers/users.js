const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const {User}  = require('../models/user')
const jwt = require('jsonwebtoken')

//GET 

router.get('/',async (req,res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success:false})
    }
    res.send(userList)
})

//GET single user

router.get('/:id',async (req,res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        return res.status(500).json({message:"The user with the given id was not found"})
    }
    res.status(200).send(user)
})

//POST

router.post('/',async(req,res) =>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,

    })

    user = await user.save();

    if(!user){
        return res.status(404).json({'message':'User cannot be created!'})
    }

    res.send(user)
})


//login

router.post('/login',async (req,res) =>{
    const user=await User.findOne({email:req.body.email})
    const secret = process.env.secret;

    if(!user){
        return res.status(400).json({message:"The user not found"})
    }

    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin
            },
            secret,
            {expiresIn:'1d'}
        )

        res.status(200).send(token)
    }else{
        return res.status(400).json({message:"password is wrong"})
    }

})


//Register

router.post('/register',async (req,res) =>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,

    })

    user = await user.save();

    if(!user){
        return res.status(404).json({'message':'User cannot be created!'})
    }

    res.send(user)

})

//DELETE user

router.delete('/:id',(req,res) =>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user){
            return res.status(200).json({success:true,message:"The user is deleted"})
        } else{
            return res.status(404).json({success:false,message:"User not found"})
        }
    }).catch(err =>{
        return res.status(400).json({success:false,error:err})
    })
  })


//User count

router.get('/get/count' , async (req,res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount){
        res.status(500).json({success:false})
    }
    res.send({userCount:userCount})
})



module.exports =router;