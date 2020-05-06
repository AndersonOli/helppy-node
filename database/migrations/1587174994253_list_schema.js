'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListSchema extends Schema {
  up () {
    this.create('lists', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('full_name', 80).notNullable()
      table.string('address', 60).notNullable()
      table.string('house_number', 10).notNullable()
      table.string('reference', 254).notNullable()
      table.string('telephone', 20).notNullable()
      table.string('title', 100).notNullable()
      table.string('description', 300).notNullable()
      table.string('shoppings').notNullable()
      table.timestamps()
      table.string('accept_by', 80)
      table.string('accept_by_id')
      table.string('status').notNullable()
    })
  }

  down () {
    this.drop('lists')
  }
}

module.exports = ListSchema
