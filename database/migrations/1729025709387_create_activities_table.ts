import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Insert default data
    await Database.table(this.tableName).insert([
      { name: 'Default Activity 1', created_at: new Date(), updated_at: new Date() },
      { name: 'Default Activity 2', created_at: new Date(), updated_at: new Date() },
      { name: 'Default Activity 3', created_at: new Date(), updated_at: new Date() },
    ])
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
