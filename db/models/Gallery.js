const bookshelf = require('./bookshelf');
const User = require('./User')

// const Gallery = require('./Gallery');

class Gallery extends bookshelf.Model {
  get tableName() { return 'gallery' }
  get hasTimestamps() { return true }

  author() {
    return this.belongsTo(User); //referencing User class, ensure include const User
  }
}

module.exports = Gallery; //Not sure what goes here
