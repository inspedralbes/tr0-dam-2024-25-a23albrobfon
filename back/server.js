const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importar el paquet cors
const app = express();


app.use(cors());
// Middleware per processar peticions JSON i URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Ruta GET per obtenir les preguntes des del fitxer JSON
app.get('/preguntes', (req, res) => {
  const filePath = path.join(__dirname, 'preguntes.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error llegint el fitxer preguntes.json', err);
      res.status(500).json({ error: 'Error llegint el fitxer de preguntes' });
      return;
    }


    let preguntes;
    try {
      preguntes = JSON.parse(data);


      if (!Array.isArray(preguntes)) {
        if (typeof preguntes === 'object' && Object.keys(preguntes).length > 0) {
          // Si és un objecte i té dades, transforma'l en un array
          preguntes = [preguntes];
        } else {
          // Si no és un array o objecte vàlid, inicialitzem com array buit
          preguntes = [];
        }
      }
    } catch (parseError) {
      console.error('Error processant el fitxer JSON', parseError);
      res.status(500).json({ error: 'Error processant les dades de preguntes' });
      return;
    }


    res.json(preguntes);
  });
});


// Ruta POST per afegir una nova pregunta
app.post('/preguntes', (req, res) => {
  const novaPregunta = req.body;
  const filePath = path.join(__dirname, 'preguntes.json');
 
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error llegint el fitxer preguntes.json', err);
      res.status(500).json({ error: 'Error llegint el fitxer de preguntes' });
      return;
    }


    let preguntes;
    try {
      preguntes = JSON.parse(data);


      if (!Array.isArray(preguntes)) {
        if (typeof preguntes === 'object' && Object.keys(preguntes).length > 0) {
          // Si és un objecte i té dades, transforma'l en un array
          preguntes = [preguntes];
        } else {
          // Si no és un array o objecte vàlid, inicialitzem com array buit
          preguntes = [];
        }
      }
    } catch (parseError) {
      console.error('Error processant el fitxer JSON', parseError);
      res.status(500).json({ error: 'Error processant les dades de preguntes' });
      return;
    }


    novaPregunta.id = preguntes.length ? preguntes[preguntes.length - 1].id + 1 : 1;
    preguntes.push(novaPregunta);


    fs.writeFile(filePath, JSON.stringify(preguntes, null, 2), (err) => {
      if (err) {
        console.error('Error escrivint el fitxer preguntes.json', err);
        res.status(500).json({ error: 'Error guardant la nova pregunta' });
        return;
      }
      res.status(201).json(novaPregunta);
    });
  });
});




// Ruta DELETE per eliminar una pregunta
app.delete('/preguntes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const filePath = path.join(__dirname, 'preguntes.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error llegint el fitxer preguntes.json', err);
      res.status(500).json({ error: 'Error llegint el fitxer de preguntes' });
      return;
    }


    let preguntes;
    try {
      preguntes = JSON.parse(data);
      if (!Array.isArray(preguntes)) {
        throw new Error('Preguntes no és un array');
      }
    } catch (parseError) {
      console.error('Error processant el fitxer JSON', parseError);
      res.status(500).json({ error: 'Error processant les dades de preguntes' });
      return;
    }


    const novesPreguntes = preguntes.filter(pregunta => pregunta.id !== id);


    // Escriure les noves preguntes al fitxer
    fs.writeFile(filePath, JSON.stringify(novesPreguntes, null, 2), (err) => {
      if (err) {
        console.error('Error escrivint el fitxer preguntes.json', err);
        res.status(500).json({ error: 'Error eliminant la pregunta' });
        return;
      }
      res.status(204).send(); // Resposta sense contingut
    });
  });
});




// Ruta PUT per actualitzar una pregunta
app.put('/preguntes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const preguntaActualitzada = req.body;


  const filePath = path.join(__dirname, 'preguntes.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error llegint el fitxer preguntes.json', err);
      res.status(500).json({ error: 'Error llegint el fitxer de preguntes' });
      return;
    }


    let preguntes;
    try {
      preguntes = JSON.parse(data);
      if (!Array.isArray(preguntes)) {
        throw new Error('Preguntes no és un array');
      }
    } catch (parseError) {
      console.error('Error processant el fitxer JSON', parseError);
      res.status(500).json({ error: 'Error processant les dades de preguntes' });
      return;
    }


    console.log('Preguntes:', preguntes); // Afegir aquest log abans del findIndex
    const index = preguntes.findIndex(pregunta => pregunta.id === id);


    if (index === -1) {
      res.status(404).json({ error: 'Pregunta no trobada' });
      return;
    }


    // Actualitzar la pregunta
    preguntes[index] = { ...preguntes[index], ...preguntaActualitzada };


    // Escriure les preguntes actualitzades al fitxer
    fs.writeFile(filePath, JSON.stringify(preguntes, null, 2), (err) => {
      if (err) {
        console.error('Error escrivint el fitxer preguntes.json', err);
        res.status(500).json({ error: 'Error actualitzant la pregunta' });
        return;
      }
      res.json(preguntes[index]); // Retornar la pregunta actualitzada
    });
  });
});


// Servidor escoltant al port 3000
app.listen(23453, () => {
  console.log('Servidor escoltant al port 23453');
});