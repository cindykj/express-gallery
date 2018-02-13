const express = require('express');
const Gallery = require('../db/models/Gallery');
const User = require('../db/models/User')
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt')

const knex = require('../db/knex.js');

const router = express.Router();
const saltRounds = 12;

router.route('/')
  .get((req, res) => {
    return res.render('templates/gallery/register')
  })
  .post((req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) { console.log(err); }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (err) { console.log(err); }
      new User({
        username: req.body.username,
        password: hash
      })
      .save()
      .then( (user) => {
        console.log(user);
        res.redirect('/gallery');
      })
      .catch((err) => { console.log(err); return res.send('Stupid username'); });
    });
  });
});

module.exports = router;