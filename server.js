// Modules
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

const path = require('path');

// Routes
const knex = require('./db/knex.js')
const galleryRoutes = require('./routes/gallery');

// Port
const PORT = process.env.PORT || 3000;

const app = express();

// Static public
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static('public')); why not this??
app.engine('.hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));


app.use('/gallery', galleryRoutes);


// app.get(`/`, (req, res) => {
//   console.log('smoke test');
//   res.send(`smoke test`)
// })

app.listen(PORT, (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log(`Server is now connected to ${PORT}`);
})


