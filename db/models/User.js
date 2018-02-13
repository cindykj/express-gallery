
const bookshelf = require('./bookshelf');
const Gallery = require

// const User = bookshelf.Model.extend({
  //   tableName: 'users'
  // });

//ES6 style
class User extends bookshelf.Model {
  get tableName() { return 'users' }
  get hasTimestamps() { return true }  

  gallery(){
    // returns.hasMany(Gallery);
    return this.belongsTo(User)
  }
}

module.exports = User;