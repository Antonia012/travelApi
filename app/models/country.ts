import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  declare country_id: number

  @column()
  name: string
}
