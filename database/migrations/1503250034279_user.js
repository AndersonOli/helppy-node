'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('nome_completo', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('senha', 60).notNullable()
      table.string('telefone', 20).notNullable()
      table.string('cep', 8).notNullable()
      table.string('endereco', 60).notNullable()
      table.string('numero', 10).notNullable()
      table.string('referencia', 254).notNullable()
      table.string('tipo_conta',1).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
