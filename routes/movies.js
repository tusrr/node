const mongoose=require('mongoose')
const {genreSchema,Genre} = require('./genres')
const Joi = require('joi');
const express = require('express');
const router = express.Router();


const moviesSchema = new mongoose.Schema({
  title:{
    type:String,
    trim:true,
    required:true,
    minlength:3,
    maxlength:10
  },
  genre:{
    type: genreSchema,
    required:true
  },
  numberInStock:{
    type:Number,
    required:true,
    min:0,
    max:255
  },
  dailyRentalRate:{
    type:Number,
    required:true,
    min:0,
    max:255
  }
})

const Movie = mongoose.model('Movie',moviesSchema)


function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock:Joi.number().min(0).required(),
    dailyRentalRate:Joi.number().min(0).required()
  };

  return Joi.validate(movie, schema);
}

router.get('/', async (req,res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies)
    }); 

router.post('/', async (req, res) => {
    try{
  const { error } = validateMovie(req.body); 
  if (error)return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('Invalid genre')
  


  let  movie = new Movie({ 
    title: req.body.title,
    genre: {                //genre:genre(nt done because we dont want to populate all properties of genre object here when embedding -- selectively set)
        _id:genre._id,
        name:genre.name
    },
    numberInStock:req.body.numberInStock,
    dailyRentalRate:req.body.dailyRentalRate

  })
   
  movie = await movie.save()
  res.send(movie);
}
catch(ex){
    console.log(ex.message)
}
});

module.exports = {router,Movie}