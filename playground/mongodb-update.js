const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5c1002734a0730ec4a4c8db2")
  // }, {
  //   $set: {
  //     completed: false
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5c0d6c958a74972a94949b22")
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: "sammy"
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  //client.close();
});
