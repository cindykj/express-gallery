const express = require('express');

const Gallery = require('../db/models/Gallery');

const router = express.Router();

// GET / to view a list of gallery photos
router.route('/')
  .get((req, res) => {
    return Gallery // asking for instance, vs instantiating instance above at post
      .fetchAll()
      .then(gallery => {
        return res.json(gallery);
      })
      .catch(err => {
        return res.json({
          message: err.message
        });
      })
  }); // closing for get


// GET /gallery/:id to see a single gallery photo
router.route('/:id')
  .get((req, res) => {
    return new Gallery() //jesse things this is cleaner than below comments
      .where({ id: req.params.id })
      .fetch()
      .then(result => {
        if (!result) {
          throw new Error('Photo not found!');
        }
        return res.json(result);
      })

    .catch(err => {
      return res.json({
        message: err.message
      })
    })
  })


// GET /gallery/new to see a "new photo" form (fields: author, link, description)

// POST /gallery to create a new gallery photo
router.route('/gallery')
  .post((req, res) => {
    const {
      author,
      link,
      description
    } = req.body;

    return new Gallery({
        author,
        link,
        description
      })
      .save()
      .then(post => {
        return res.json(post);
      })
      .catch(err => {
        return res.json({
          message: err.message,
          code: err.code
        })
      })

  }) // closing for post /gallery

// GET /gallery/id:edit to see a form to edit a gallery photo identified by the :id param (form fields)


// PUT /gallery/:id updates a single gallery photo identified by the :id param

// DELETE /gallery/:id







module.exports = router;