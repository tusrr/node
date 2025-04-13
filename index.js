const Joi = require('joi');
const mongoose = require('mongoose')
const genres = require('./routes/genres');
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost:27017/vidly')
.then(()=>console.log('connected to mongodb...'))
.catch(err=>console.log('couldnt connect to  DB'))


app.use(express.json());
app.use('/api/genres', genres.router);
app.use('/api/customers', customers);
app.use('/api/movies', movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));