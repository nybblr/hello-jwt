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
let postTokens = async ctx => {
  let { email, password } = ctx.request.body;
  let user = findUserByEmail(email);

  let isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    let token = createToken(user);
    ctx.body = token;
  } else {
    ctx.body = 'No token for you!';
  }
};

// GET /api/private
let privatePage = ctx => {
  ctx.body = `Muahaha welcome to the club, user #${ctx.jwt.userId}`;
};

let checkToken = async (ctx, next) => {
  let { authorization: token } = ctx.headers;
  let payload;
  try {
    payload = jwt.verify(token, signature);
  } catch(err) {
    // catch the error
  }

  if (payload) {
    ctx.jwt = payload;
    await next();
  } else {
    ctx.body = 'YOU SHALL NOT PASS';
  }
};

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

let app = new Koa();
let router = new Router();

let tokensAPI = new Router();
tokensAPI.post('/', postTokens);

let api = new Router();
api.get('/private', privatePage);

router.use('/tokens', tokensAPI.routes());
router.use('/api', checkToken, api.routes());

app.use(bodyParser());
app.use(router.routes());
app.listen(3000);
