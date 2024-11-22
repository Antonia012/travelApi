import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'travel_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('username')
      table.specificType('countries', 'integer[]') // Correct: integer array
      table.specificType('cities', 'integer[]') // Correct: integer array
      table.specificType('activities', 'integer[]') // Correct: integer array
      table.string('about')
      table.specificType('todoItems', 'text[]') // Correct: text array for strings
      table.specificType('checkedItems', 'boolean[]') // Correct: boolean array
      table.datetime('created') // Correct: datetime

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
