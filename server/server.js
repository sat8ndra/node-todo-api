//const {ObjectID} = require('mongodb'); //my code
var {ObjectID} = require('mongodb'); // andrew code
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  //console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
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

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
