const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "/public")))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));


//API routes
//get all notes
app.get("/api/notes", function (req, res) {
    //read notes file, create objects, return JSON
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        let allNotes = JSON.parse(data);
        res.json(allNotes);
    });
});


//post a new note
app.post("/api/notes", function (req, res) {
    //create an object for the new note
    let newNote = {
        id: uniqid.time(),
        title: req.body.title,
        text: req.body.text
    }
    //read notes file, create objects, update array, write new file, return JSON
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        let allNotes = JSON.parse(data);
        allNotes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(allNotes), function (err) {
            if (err) throw err;
            res.json(allNotes);
        });
    });
});



//delete a note by ID
app.delete("/api/notes/:id", function (req, res) {
    //read notes file, create objects
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        allNotes = JSON.parse(data);
        res.json(allNotes);

        //loop through notes array, put all those that don't match the one that we're deleting into a new array
        let newAllNotes = [];
        for (let i = 0; i < allNotes.length; i++) {
            if (allNotes[i].id !== req.params.id) {
                newAllNotes.push(allNotes[i]);
            }
        };
        //set the original notes array equal to the new array (with the deleted note)
        allNotes = newAllNotes;

        //write new file, return JSON
        fs.writeFileSync("./db/db.json", JSON.stringify(allNotes), function (err) {
            if (err) throw err;
            res.json(allNotes);
        });
    });
});

//html routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});


app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});


//start the server
app.listen(port, function () {
    console.log("App listening on port localhost:" + port)
});