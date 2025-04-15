//can also be called logins.js

const { User } = require("./register");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid Email or Password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid Email or Password");

    const token= user.generateAuthToken(); 
    res.send(token)

    // res.send(true);
  } catch (ex) {
    res.send(ex.message);
  }
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;


// To set jwt private key in environment var
//in powershell : $env:vidly_jwtPrivateKey = "newSecureKey123" <last for passworddd>
//in powershell : $env:vidly_jwtPrivateKey = "mySecureKey"
// can be verified --  use whatever security key to use on the jwt.io along with the generated token