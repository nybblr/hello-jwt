// Fake database of users
let users = {
  'joe@smith.com': {
    id: 3,
    email: 'joe@smith.com',
    password: '$2a$10$bGFGwRz.qQybLuFJPptWR.RyDZCIiVRtA2EYvhsNq9vMMrdVUVXLe',
  },
  'joe@bloggs.com': {
    id: 5,
    email: 'joe@bloggs.com',
    password: '$2a$10$Un40mZ9Qs34LAPL56QMv2.NK09yhb3Coq76/jlC6nNGQdLsZW5Zy2',
  },
};

let findUserByEmail = email => users[email];

module.exports = {
  findUserByEmail
};
