// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Handles Asynchronous Functions
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Sets up the server
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Static files
app.use(express.static("public"));

//API Routes
app.get("/api/notes", (req, res) => {
  readFileAsync("./db/db.json", "utf8").then((data) => {
    res.json(JSON.parse(data));
  });
});

//API POST Requests
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  readFileAsync("./db/db.json", "utf8").then((data) => {
    const notes = JSON.parse(data);
    notes.push(newNote);
    writeFileAsync("./db/db.json", JSON.stringify(notes)).then(() => {
      res.json(newNote);
    });
  });
});

//API DELETE Requests
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  readFileAsync("./db/db.json", "utf8").then((data) => {
    const notes = JSON.parse(data);
    const newNotes = notes.filter((note) => note.id !== id);
    writeFileAsync("./db/db.json", JSON.stringify(newNotes)).then(() => {
      res.json(newNotes);
    });
  });
});

//HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
})

// Starts the server to begin listening
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
