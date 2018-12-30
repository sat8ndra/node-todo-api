//const {ObjectID} = require('mongodb'); //my code
require('./config/config.js');


const _ = require('lodash');
var {ObjectID} = require('mongodb'); // andrew code
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  //console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
    //completed: req.body.completed
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get /todos/1234324
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // valid id using isValid
    // 404-send back empty send
    //console.log(id);
  if (!ObjectID.isValid(id)) {
    // console.log('Id is not valid'); //my code
    // return res.status(404).send(""); //my code
    return res.status(404).send(); //andrew code
  }

  // findById
    //success
      // if todo -send it back
      // if no todo -send back 404 with empy body
    // error
      // 400 -and send empty body back
  Todo.findById(id).then((todo) => {
    if (!todo) {
      // console.log('Id not found'); //my code
      // return res.status(404).send({}); //my code
      return res.status(404).send();
    }
    // return res.status(200).send(todo); //my code
    res.send({todo}); //andrew code
  }).catch((e) => {
    // console.log(e); //my code
    // return res.status(400).send({}) //my code
    res.status(400).send(); //andrew code
  })
  // console.log(req.params);
  // res.send(req.params);
});

app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;
  // validate the id -> not valid? return 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // remove todo by id
    // success
      // if no doc, send 404
      // if doc, send doc back with 200
    // error
      // 400 with empty body
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
  });

  app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    })

  });

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  //User.findByToken           //model method
  //user.generateAuthToken      // instance method

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//POST /users/login {email, password}
//find the user with matching email in mongodb database and compare password with hashed and bcrypt
//res.send body data
// my code
// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);
//   var query = User.where({email: user.email});
//   query.findOne(function (err, dbuser) {
//   if (err) return handleError(err);
//   if (dbuser) {
//     // doc may be null if no document matched
//     //console.log(user);
//     bcrypt.compare(user.password, dbuser.password, (err, success) => {
//       if(success) {
//         res.send(body);
//       }
//     });
//   }
// });
// });

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
