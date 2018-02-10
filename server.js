// Modules
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./knex/knex.js')

// Routes
const galleryRoutes = require('./routes/gallery');

// Port
const PORT = process.env.PORT || 3000;

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/gallery', galleryRoutes);


app.get(`/`, (req, res) => {
  res.send(`smoke test`)
})

app.listen(PORT, () => {
  console.log(`Server is now connected to ${PORT}`);
})


