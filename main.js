const express = require('express');
const fs = require("fs").promises;
const multer = require('multer');
let info  = require("./sub");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const opts = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API для управління нотатками',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
    tags: [
      {
        name: 'notes',
        description: 'Операції для нотаток',
      },
      
    ],
    paths:{
                  

    },
  },
  apis: ['./main.js',"./routes/users.js"], 
};

const swaggerSpec = swaggerJSDoc(opts);





const app = express();
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(express.static("static"))


const upload = multer();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Отримати список нотаток
 *     tags: 
 *       - notes
 *     responses:
 *       200:
 *         description: Список нотаток
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name_in:
 *                     type: string
 *                     description: Назва нотатки
 *                   description:
 *                     type: string
 *                     description: Опис нотатки
 * @swagger
 * /notes/{note_name}:
 *   get:
 *     summary: Отримати нотатку за назвою
 *     tags: 
 *       - notes
 *     parameters:
 *       - in: path
 *         name: note_name
 *         required: true
 *         description: Назва нотатки
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Нотатка знайдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name_in:
 *                   type: string
 *                   description: Назва нотатки
 *                 description:
 *                   type: string
 *                   description: Опис нотатки
 *       404:
 *         description: Нотатку не знайдено
 * @swagger
 * /write:
 *   post:
 *     summary: Додати нову нотатку
 *     tags: 
 *       - notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note_name:
 *                 type: string
 *                 description: Назва нотатки
 *               note:
 *                 type: string
 *                 description: Опис нотатки
 *     responses:
 *       201:
 *         description: Нотатку успішно створено
 *       400:
 *         description: Нотатка з такою назвою вже існує
 *       500:
 *         description: Внутрішня помилка сервера
 *  @swagger
 * /notes/{note_name}:
 *   put:
 *     summary: Оновити нотатку
 *     tags: 
 *       - notes
 *     parameters:
 *       - in: path
 *         name: note_name
 *         required: true
 *         description: Назва нотатки для оновлення
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Новий опис нотатки
 *     responses:
 *       200:
 *         description: Нотатку успішно оновлено
 *       404:
 *         description: Нотатку не знайдено
 * @swagger
 * /notes/{note_name}:
 *   delete:
 *     summary: Видалити нотатку
 *     tags: 
 *       - notes
 *     parameters:
 *       - in: path
 *         name: note_name
 *         required: true
 *         description: Назва нотатки для видалення
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Нотатку успішно видалено
 *       404:
 *         description: Нотатку не знайдено
 * @swagger
 * /UploadForm.html:
 *   get:
 *     summary: Отримати форму
 *     tags: 
 *       - form
 *     responses:
 *       200:
 *         description: HTML-код форми
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */



app.set('view engine', 'ejs');



fs.access(info.path_to_cache)
  .then(() => {

  })
  .catch(() => {
    fs.mkdir(info.path_to_cache, { recursive: true });
    fs.appendFile(info.full_path, '[]');
  })

fs.access(info.path_to_cache + '/collection.json')
  .catch(() => {
    fs.appendFile(info.full_path, '[]');
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

