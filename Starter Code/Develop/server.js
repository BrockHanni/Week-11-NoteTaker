const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const PORT = process.env.PORT || 3001;
const app = express();
const database = require('./db/db.json');
const readFileAsync = util.promisify(fs.readFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    readFileAsync('./db/db.json').then((data) => 
        res.json(JSON.parse(data)));
    
});

app.post('/api/notes', (req, res) => {
    const newNote = newNoteDb(req.body, database);
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    removeNoteDb(req.params.id, database);
    res.json(true);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
// the get with the * needs to be the last get or it will override the other gets


const uuid = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

function newNoteDb(body, notesArray) {
    const newNotes = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
    
    body.id = notesArray[0];
    body.id = uuid()
// change with uuid from unit 11 random id generator
    notesArray.push(newNotes);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNotes;
}

function removeNoteDb(id, notesArray) {
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


// starting server
app.listen(PORT, () => {
    console.log(`NoteTaker server http://localhost:${PORT} is now on!`);
});