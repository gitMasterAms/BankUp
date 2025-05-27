require('dotenv').config();
const express = require('express');
const bctypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

//Config JSON Response
app.use(express.json());

//Models


//Open Route - Public Route
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem vindo a nossa API!  ' });
});

// Register User
app.post('/auth/register', async (req, res) => {
  const { name, email, password, confirmpassword } =
    req.body;

  // validations

  if (!email) {
    return res.status(422).json({ msg: 'o email é obrigatório!' });
  }
});

app.listen(3003);
