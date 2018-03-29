const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
  findUserByEmail
} = require('./database');

const signature = '1mm@_s3cur3_s3rv3r';

let readBody = request =>
  new Promise(resolve => {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      resolve(body);
    });
  });

// Create JWT for user
let createToken = user =>
  jwt.sign(
    { userId: user.id },
    signature,
    { expiresIn: '7d' }
  );

// POST /tokens
let postTokens = async (req, res) => {
  let body = await readBody(req);
  let creds = JSON.parse(body);
  let { email, password } = creds;
  let user = findUserByEmail(email);

  let isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    let token = createToken(user);
    res.end(token);
  } else {
    res.end('No token for you!');
  }
};

// GET /private
let privatePage = (req, res) => {
  let { authorization: token } = req.headers;
  let payload;
  try {
    payload = jwt.verify(token, signature);
  } catch(err) {
    // catch the error
  }

  if (payload) {
    let { userId } = payload;
    res.end(`Muahaha welcome to the club, user #${userId}`);
  } else {
    res.end('YOU SHALL NOT PASS');
  }
};

let routes = {
  'POST /tokens': postTokens,
  'GET /private': privatePage,
};

let server = http.createServer((req, res) => {
  let { url, method } = req;
  let route = `${method} ${url}`;
  routes[route](req, res);
});

server.listen(3000);