const express = require('express');
const mongoose=require('mongoose')
const router = express.Router();
const Joi = require('joi');
const customerSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:3,
    maxlength:10
  },
  isGold:{
    type:Boolean,
    required:true
  },
  phone:{
    type:Number,
    required:true,
    minlength:10
  }
})

const Customer = mongoose.model('Customer',customerSchema)

router.get('/',async (req,res)=>{
  const customers = await Customer.find();
  res.send(customers)
})
router.post('/',async (req,res)=>{
  // const { error } = validateGenre(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  //id set by db automatically
  try{
  let  customer = new Customer({ name: req.body.name, isGold:req.body.isGold,phone:req.body.phone})
   
  customer = await customer.save()
  res.send(customer);
  }
  catch(ex){
    console.log(ex.message);
  }
})

module.exports = router