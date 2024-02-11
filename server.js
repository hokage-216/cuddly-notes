const express = require('express');
const fs = require('fs').promises;
const app = express();
const path = require('path');

//Set Port
const PORT = process.env.PORT || 5001;

// Path Variables
const publicPATH = path.join(__dirname, 'public');
const homePATH = path.join(__dirname, 'public/index.html');
const notesPATH = path.join(__dirname, 'public/notes.html');
const dbPATH = path.join(__dirname, 'db/db.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(publicPATH));

// Home route
app.get('/', (req, res) => res.render(homePATH));

// Notes page route
app.get('/notes', (req, res) => res.sendFile(notesPATH));

// API route to get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(dbPATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ message: 'Error reading from db.json', error: err });
  }
});

// API route to create a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, text } = req.body;
    const newNote = { title, text, id: Date.now().toString() };

    const data = await fs.readFile(dbPATH, 'utf8');
    const notes = JSON.parse(data);
    notes.push(newNote);

    await fs.writeFile(dbPATH, JSON.stringify(notes), 'utf8');
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Error writing to db.json', error: err });
  }
});

// API route to delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;

    const data = await fs.readFile(dbPATH, 'utf8');
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    await fs.writeFile(dbPATH, JSON.stringify(notes), 'utf8');
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note', error: err });
  }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
