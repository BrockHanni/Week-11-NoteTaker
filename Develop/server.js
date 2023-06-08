const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const database = require('./db/db.json');

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(database.slice(1));
});

app.post('/api/notes', (req, res) => {
  const newNote = newNoteDb(req.body, database);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  removeNote(req.params.id, database);
  res.json(true);
});

function newNoteDb(body, notesArray) {
  const newNote = body;
  if (!Array.isArray(notesArray))
    notesArray = [];

  if (notesArray.length === 0)
    notesArray.push(0);

  body.id = notesArray[0];
  notesArray[0]++;

  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(notesArray, null, 2)
  );
  return newNote;
}

function removeNote(id, notesArray) {
  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];

    if (note.id == id) {
      notesArray.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
      );

      break;
    }
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
