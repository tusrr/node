const express = require('express');
const mongoose=require('mongoose')
const router = express.Router();
const Joi = require('joi')
const genreSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:3,
    maxlength:30
  }
})



const Genre = mongoose.model('Genre',genreSchema)




// const genres = [
//   { id: 1, name: 'Action' },  
//   { id: 2, name: 'Horror' },  
//   { id: 3, name: 'Romance' },  
// ];









router.get('/', async (req,res) => {
const genres = await Genre.find().sort('name');
res.send(genres)
});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //id set by db automatically
  let  genre = new Genre({ name: req.body.name})
   
  genre = await genre.save()
  res.send(genre);
});

router.put('/:id', async (req, res) => {
//first  validate before update
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);


   const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true})

  // const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

 
  
 
  res.send(genre);
});

router.delete('/:id',async (req, res) => {
  // const genre = await Genre.findByIdAndDelete(req.params.id)

  // if (!genre) return res.status(404).send('The genre with the given ID was not found.');


    const genre = await Genre.findByIdAndDelete(req.params.id);
    
    if (!genre) return res.status(404).send('Genre not found.');
    
    res.send(`The genre with id ${req.params.id} and name ${genre.name} was deleted`);
   
 
});

router.get('/:id',async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;