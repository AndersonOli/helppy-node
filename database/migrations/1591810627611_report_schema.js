'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table.integer('user_id')
      table.string('title', 100).notNullable()
      table.string('comment', 450).notNullable()
      table.string('reported_id').notNullable()
      table.string('status_report',1)
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportSchema
