const express = require('express');
const fs = require('fs').promises;
const router = express.Router();
const f_path = require("../sub").full_path;

router
  .route("/:note_name")
  .get((req, res) => {
    fs.readFile(f_path)
      .then((result) => {
        result = JSON.parse(result);
        let temp = result.filter((note) => note.name_in == req.params.note_name); 
        temp = temp[0]
        temp = `${temp.name_in} : ${temp.description}`
        res.render("resp", { info: temp });
      })
      .catch(() => {
        res.sendStatus(404)
      });
  })
  .put((req,res)=>{

        fs.readFile(f_path)
          .then((result)=>{
            result = JSON.parse(result);
            let change = req.body
            let temp = result.filter((note) => note.name_in == req.params.note_name); 
            console.log(change)

            if (temp.length != 1){
              res.sendStatus(404)
              return
            }else{
                let n = result.findIndex((note) => note.name_in == req.params.note_name); 
                result[n].description = change
                result = JSON.stringify(result)
                fs.writeFile(f_path,result)
                .then(()=>{
                  res.sendStatus(200)
                })
                .catch(()=>{
                  res.sendStatus(404)
                })
                
            }
            
          })
          .catch(()=>{
            res.sendStatus(404)
          })

  })
  .delete((req, res) => {
    fs.readFile(f_path)
        .then((result)=>{
            
            result = JSON.parse(result);
            
            let index = result.findIndex((t) => t.name_in == req.params.note_name)
            
            if (index == -1){
              
              res.sendStatus(405)
              return
            }
            [result[index], result[result.length - 1]] = [result[result.length - 1], result[index]];
            
            result.pop()
            
            result = JSON.stringify(result);
            console.log(result)
            fs.writeFile(f_path,result)
            .then(()=>{
              res.sendStatus(200)
            })
            .catch(()=>{
              res.sendStatus(404)
            })
           
        })
        .catch(()=>{
            res.sendStatus(404)
        })
  });

  router.get("/", (req, res) => {
    fs.readFile(f_path, "utf8")
        .then((result) => {
            result = JSON.parse(result);
            let resp = '<table style="width: 100%; border-collapse: collapse; border: 1px solid black;"><tbody>';
            result.forEach((info) => {
                resp += `<tr> 
                        <td style="border: 1px solid black; padding: 8px; text-align: left;">${info.name_in}</td> 
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">${info.description}</td>
                </tr>`;
            });
            resp += "</tbody></table>";
            res.render("resp", { info: resp });
        })
        .catch(() => {
            res.sendStatus(404);
        });
  });

module.exports = router;
