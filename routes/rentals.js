const express = require('express');
const mongoose=require('mongoose')
const router = express.Router();
const Joi = require('joi');

const {Rental, validateRental}= require('../models/rentals')
const {Movie}= require('./movies')
const {Customer}= require('./customers')

router.get('/',async (req,res)=>{
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals)
})

router.post('/',async(req,res)=>{
    const {error} = validateRental(req.body)
    if (error)return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId)
    if(!movie) return res.status(400).send('Invalid Movie')
    const customer = await Customer.findById(req.body.customerId)
    if(!customer) return res.status(400).send('Invalid Customer')

    if(movie.numberInStock===0) return res.status(400).send('Movie Not Available')
  let  rental = new Rental({ 
    dateOut: req.body.date,
    customer: {                
        _id:customer._id,
        name:customer.name,
        isGold:customer.isGold,
        phone:customer.phone
    },
    movie:{
        _id:movie._id,
        title:movie.title,
        dailyRentalRate:movie.dailyRentalRate
    },
    dateReturned:req.body.dateReturned,
    rentalFee:req.body.fee  // for experimental purpose renamed here and in joi validation-- but use consistent naming
  })

  rental = await rental.save();     // ✅ Save to DB
  movie.numberInStock--;
  movie.save()
  res.send(rental);    
})

module.exports=router