const http = require('http');
const jwt = require('jsonwebtoken');

const {
  findUserByEmail
} = require('./database.js');

const secret = '1mm@_s3rv3r_p@ssw0rd';

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
  jwt.sign({
    userId: user.id,
  }, secret, { expiresIn: '7d' });

// POST /tokens
let postTokens = async (req, res) => {
  let body = JSON.parse(await readBody(req));
  let { email, password } = body;
  let user = findUserByEmail(body.email);

  if (user && password === user.password) {
    let token = createToken(user);
    res.end(JSON.stringify({ token }));
  } else {
    res.end(JSON.stringify({ error: 'No token for you!' }));
  }
};

// GET /private
let privatePage = (req, res) => {
  let { authorization: token } = req.headers;
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch(err) {
    // so what
  }

  if (payload) {
    res.end(`Muahaha private, welcome user #${payload.userId}`);
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
