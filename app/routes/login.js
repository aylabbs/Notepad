const ObjectID = require('mongodb').ObjectID;

module.exports = (app, db) => {

  app.get('/login', (req, res) => {
    if (err) {
      res.send({ "Error": "An error has occured" + err});
    } else{
      res.render('loginForm');
    }

  });


  app.post('/login', (req, res) => {
    if (err) {
      res.send({ "Error": "An error has occured" + err});
    } else{
      // login user
    }
  
  });




};
