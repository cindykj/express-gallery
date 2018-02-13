
exports.up = function(knex, Promise) {
  return knex.schema.table('gallery', function (table) {
    table.integer('user_id').unsigned().notNullable(); //unsigned = only positive integer
    table.foreign('user_id').references('id').inTable('users');
  })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropColumn('user_id');
};
