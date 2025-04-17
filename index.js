const error = require('./middleware/error')
const config = require('config')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose')
const genres = require('./routes/genres');
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const register = require('./routes/register')
const auth = require('./routes/auth')
const express = require('express');
const func = require('joi/lib/types/func');
const app = express();


console.log('ENV:', process.env.vidly_jwtPrivateKey);
if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}


mongoose.connect('mongodb://localhost:27017/vidly')
.then(()=>console.log('connected to mongodb...'))
.catch(err=>console.log('couldnt connect to  DB'))


app.use(express.json());
app.use('/api/genres', genres.router);
app.use('/api/customers', customers.router);
app.use('/api/movies', movies.router  );
app.use('/api/rentals', rentals);
app.use('/api/users', register.router);
app.use('/api/auth', auth);
app.use(error)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));