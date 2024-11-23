const express = require('express');
const fs = require("fs").promises;
const multer = require('multer');
let info  = require("./sub")



const app = express();
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(express.static("static"))


const upload = multer();


app.set('view engine', 'ejs');



fs.access(info.path_to_cache)
  .then(() => {

  })
  .catch(() => {
    fs.mkdir(info.path_to_cache, { recursive: true });
    fs.appendFile(info.full_path, '');
  })

fs.access(info.path_to_cache + '/collection.json')
  .catch(() => {
    fs.mkdir(info.path_to_cache);
  });

const notes = require("./routes/users");
app.use("/notes", notes);

app.post('/write', (req, res) => {
    const { note_name, note } = req.body;
    fs.access(info.full_path)
      .then(() => {
        return fs.readFile(info.full_path);
      })
      .then((data) => {
        let result = JSON.parse(data);
        
        let existingNote = result.find((note) => note.name_in === note_name);
        if (existingNote) {
          return res.sendStatus(400); 
        } else {
          
          result.push({ name_in: note_name, description: note });
          return fs.writeFile(info.full_path, JSON.stringify(result));
        }
      })
      .then(() => {
        res.sendStatus(201); 
      })
      .catch(() => {
          res.sendStatus(500); 
        })
      });


app.use((req, res, next) => {
  res.sendStatus(405);
});




app.listen(info.port, info.host);