const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = '123abc!';

//suppose password is abc123 then salted password would be like abc1234f6s8df456sd5f
// bcrypt.genSalt(10, (err, salt) => {          // callback function is passed here in genSalt
//   bcrypt.hash(password, salt, (err, hash) => {        // another callback function
//     console.log(hash);                                // first created salt then hash the password then printed the hash
//   });
// });

var hashedPassword = '$2a$10$K9oj6lJ7xCrZw77D/vx7R.a5CCCCmMr93d48N8.ZUi/QywLBFDSMy';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
