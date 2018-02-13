const express = require('express');
const Gallery = require('../db/models/Gallery');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');

const knex = require('../db/knex.js');

const router = express.Router();

// GET / to view a list of gallery photos
router.route('/')
  .get((req, res) => {
    return Gallery // asking for instance, vs instantiating instance above at post
      .fetchAll()
      .then(allGallery => {
        return allGallery.models.map((element) => {
          let {
            author,
            link,
            description
          } = element.attributes
          return {
            author,
            link,
            description
          };
        })
      })
      .then(result => {
        return res.render('templates/gallery/index', {
          photo: result
        }); //probably change this to /index
      })
      .catch(err => {
        return res.json({
          message: err.message
        });
      })
  }) // closing for get
  .post((req, res) => {
    console.log('cheehoo')
      let {
        author,
        link,
        description
      } = req.body;
      if (!author || !link || !description) {
        // console.log(author, link, description);
        return res.status(400).json({
          message: `Must enter values in all fields`
        });
      }
      return new Gallery({
          author,
          link,
          description
        })
        .save()
        .then(post => {
          console.log('POSTING', post)
          return res.redirect('/gallery');
        })
        .catch(err => {
          return res.json({
            message: err.message,
            code: err.code
          })
        })
    }); // closing for post /gallery  

// GET /gallery/new to see a "new photo" form (fields: author, link, description)


// POST /gallery to create a new gallery photo
router.route('/new')
.get((req, res) => {
  return res.render('templates/gallery/new');
})


//  GET /gallery/:id to see a single gallery photo
router.route('/:id')
  .get((req, res) => {
    return new Gallery()
      .where({
        id: req.params.id
      })
      .fetch()
      .then(result => {
        let {
          author,
          link,
          description
        } = result.attributes
        if (!result) {
          throw new Error('No such photo!');
        }
        return res.render('templates/gallery/photo', result.attributes);
      })
      .catch(err => {
        return res.json({
          message: err.message
        })
      })
  }); //closing for get gallery/:id


// GET /gallery/id:edit to see a form to edit a gallery photo identified by the :id param (form fields)
router.route('/:id/edit')
  .get((req, res) => {
    return new Gallery()
      .where({
        id: req.params.id
      })
      .fetch()
      .then(result => {
        return res.render('templates/gallery/edit', result.attributes) //need to reference edit - always an object
      })
  }); //closing for id/edit


// PUT /gallery/:id updates a single gallery photo identified by the :id param
router.route('/:id')
  .put((req, res) => {

    Gallery.forge({
        id: req.params.id
      })
      .save({
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
      })
      .then(result => {
        return res.redirect(`/gallery/${req.params.id}`);
      })
  }) //closing for put
  // DELETE /gallery/:id
  .delete((req, res) => {
    return new Gallery()
      .where({
        id: req.params.id
      })
      .destroy()
      .then(result => {
        return res.redirect('/gallery');
      })
      .catch(err => {
        return res.json({
          message: err.message,
          code: err.code
        })
      })
  }) //closing for delete


module.exports = router;