const ObjectID = require('mongodb').ObjectID;

module.exports = (app, db) => {



  app.get('/', (req, res) => {
    db.collection('notes').find().toArray(function(err, notes) {
      if (err) {
        res.send({ "Error": "An error has occured" + err});
      } else{
        //console.log(notes);
        res.render('form', { notes: notes });
      }

    });
  //  res.render('form')
});





app.get('/notesxhr', (req, res) => {

  db.collection('notes').find().toArray(function(err, notes) {
    if (err) {
      res.send({ "Error": "An error has occured" + err});
    } else{
      //console.log(notes);
      res.send( { notes: notes } );
    }
  });
});

  app.get('/notes/:id', (req, res) => {
    var details = { '_id': new ObjectID(req.params.id) };
    db.collection('notes').findOne(details, (err, item) => {
        if (err) {
          res.send({ "Error": "An error has occured" + err});
        } else {
          res.send(item);
        }
    });
  });


  app.delete('/notes/:id', (req, res) => {
    var details = { '_id': new ObjectID(req.params.id) };
    db.collection('notes').deleteOne(details, (err, item) => {
        if (err) {
          res.send({ "Error": "An error has occured" + err});
        } else {
          res.send('Note deleted');
        }
    });
  });

  app.post('/notesxhr', (req, res) => {
    const note = { title: req.body.title, value: req.body.value };
    db.collection('notes').insertOne(note, (err, result) => {
      if (err) {
        res.send( { error: "an error has occured" + err});
      } else {
        //console.log(req);
        res.send('Submitted');
      }
    });
  });

  app.put('/notes/:id', (req, res) => {
    var details = { '_id': new ObjectID(req.params.id) };
    const note = { title: req.body.title, value: req.body.value };
    if ((note.title !== '') || (note.value !== '') ) {
      db.collection('notes').replaceOne(details, note, (err, result) => {
        if (err) {
          res.send( { error: "an error has occured" + err} );
        } else {
          //console.log(req);
          res.send('Editted Successfully');
        }
      });
    } else {
      res.redirect(`/notes/delete/${req.params.id}`);
    }
  });
};
