import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Activity extends BaseModel {
  @column({ isPrimary: true })
  declare activity_id: number

  @column()
  name: string
}
