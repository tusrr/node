const auth = require('../middleware/auth')
const admin= require('../middleware/admin')
const config = require('config')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const _ = require('lodash') //by convention , we can also call it lodash
const mongoose=require('mongoose')
const Joi = require('joi');
const express = require('express');
const { unique } = require('joi/lib/types/array');
const router = express.Router();


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true,
    minlength:5,
    maxlength:50
  },
  email:{
    type: String,
    required:true,
    unique:true,
    minlength:5,
    maxlength:255,

  },
  password:{
    type:String,
    required:true,
    minlength:5,
    maxlength:1024, //higher since we'll hash it   
  },
  isAdmin:Boolean
})





// for encapsulating logic jwt generation, adding a method to model

userSchema.methods.generateAuthToken = function(){
  const token=jwt.sign({_id:this._id, isAdmin:this.isAdmin},config.get('jwtPrivateKey'))
  return token;

}




const User = mongoose.model('User',userSchema)




function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
    password:Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}


router.get('/me',auth,async(req,res)=>{

  const user = await User.findById(req.user._id).select('-password')
  res.send(user)

})





router.get('/', async (req,res) => {
    const user = await User.find().sort('name');
    res.send(user)
}); 


router.post('/', async (req, res) => {
    try{
  const { error } = validateUser(req.body); 
  if (error)return res.status(400).send(error.details[0].message);


  let user = await User.findOne({email:req.body.email}) //finding property by one of the properties that we've already defined
  if(user) return res.status(400).send('User already registered')


//    user = new User({ 
//     name: req.body.name,
//     email: req.body.email,
//     password:req.body.password
//   })

// rewriting it with lodash
   user = new User(_.pick(req.body,['name','email','password']))
   
    const salt=await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password,salt)

    await user.save()
//   res.send(user);
  // when registered, we shouldn't send their password to the client

//conventional method -- multiple lines ,baar baar user.property) what if ,50 prop,so with lodash one line
  //   res.send({
    //     name:user.name,
    //     email:user.email
    //   })


    // Information expert principle
  const token= user.generateAuthToken();
  res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']))
    // res.send(_.pick(user,['_id','name','email']))
}
catch(ex){
    res.send(ex.message)
}
});

module.exports = {router,User}