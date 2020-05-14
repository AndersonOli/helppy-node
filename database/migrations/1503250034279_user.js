'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('full_name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('telephone', 20).notNullable()
      table.string('cep', 8).notNullable()
      table.string('address', 60).notNullable()
      table.string('latitude',60).notNullable()
      table.string('longitude',60).notNullable()
      table.string('house_number', 10).notNullable()
      table.string('reference', 254).notNullable()
      table.string('type_account',1).notNullable()
      table.integer('status_account').defaultTo(0)
      table.string('token_notification')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
