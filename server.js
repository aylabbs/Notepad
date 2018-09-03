const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const db = require('./config/db');
const ejs = require('ejs');
const path = require('path');


app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'Public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// todo wrap in async function
MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err);

  let db1 = database.db('notepad');
  require('./app/routes')(app, db1);

  const port = 8010;

  app.listen(port, ()=> {
    console.log("Now listening for req's on port " + port);
  });

});
