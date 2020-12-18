const fs = require("fs");
const notesDB = require("../db/db.json");

module.exports = function(app){

    function writeToDB(notes){
        notes = JSON.stringify(notes);
        console.log (notes);
        fs.writeFileSync("./db/db.json", notes, function(err){
            if (err) {
                return console.log(err);
            }
        });
    }

    app.get("/api/notes", function(req, res){
        res.json(notesDB);
    });

    app.post("/api/notes", function(req, res){
        if (notesDB.length == 0){
            req.body.id = "0";
        } else{
            req.body.id = JSON.stringify(JSON.parse(notesDB[notesDB.length - 1].id) + 1);
        }
        console.log("req.body.id: " + req.body.id);

        notesDB.push(req.body);

        writeToDB(notesDB);
        console.log(notesDB);

        res.json(req.body);
    });

    app.delete("/api/notes/:id", function(req, res){ 
        let id = req.params.id.toString();
        console.log(id);

        for (i=0; i < notesDB.length; i++){
            if (notesDB[i].id == id){
                console.log("match!");

                res.send(notesDB[i]);

                notesDB.splice(i,1);
                break;
            }
        }
        writeToDB(notesDB);
    });
};