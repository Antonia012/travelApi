import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'travel_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('username')
      table.specificType('countries', 'integer[]')
      table.specificType('cities', 'integer[]')
      table.specificType('activities', 'integer[]')
      table.string('about')
      table.specificType('todoItems', 'text[]')
      table.specificType('checkedItems', 'boolean[]')
      table.datetime('created')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
