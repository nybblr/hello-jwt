const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
  findUserByEmail
} = require('./database');

const signature = '1mm@_s3cur3_s3rv3r';

// Create JWT for user
let createToken = user =>
  jwt.sign(
    { userId: user.id },
    signature,
    { expiresIn: '7d' }
  );

// POST /tokens
let postTokens = async (req, res) => {
  let { email, password } = req.body;
  let user = findUserByEmail(email);

  let isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    let token = createToken(user);
    res.send(token);
  } else {
    res.send('No token for you!');
  }
};

// GET /api/private
let privatePage = (req, res) => {
  res.send(`Muahaha welcome to the club, user #${req.jwt.userId}`);
};

let checkToken = async (req, res, next) => {
  let { authorization: token } = req.headers;
  let payload;
  try {
    payload = jwt.verify(token, signature);
  } catch(err) {
    // catch the error
  }

  if (payload) {
    req.jwt = payload;
    next();
  } else {
    res.send('YOU SHALL NOT PASS');
  }
};

const express = require('express');
const Router = express.Router;
const bodyParser = require('body-parser');

let app = express();
let router = new Router();

let tokensAPI = new Router();
tokensAPI.post('/', postTokens);

let api = new Router();
api.get('/private', privatePage);

router.use('/tokens', tokensAPI);
router.use('/api', checkToken, api);

app.use(bodyParser.json());
app.use(router);
app.listen(3000);
