// Fake database of users
let users = {
  'joe@smith.com': {
    id: 3,
    email: 'joe@smith.com',
    password: 'mylittlepassword'
  },
  'joe@bloggs.com': {
    id: 5,
    email: 'joe@bloggs.com',
    password: 'test1234'
  },
};

let findUserByEmail = email => users[email];

module.exports = {
  findUserByEmail
};
