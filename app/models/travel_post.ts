import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TravelPost extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  username: string

  @column()
  title: string

  @column()
  countries: number[]

  @column()
  cities: number[]

  @column()
  activities: number[]

  @column()
  about: string

  @column()
  todoItems: string[]

  @column()
  checkedItems: boolean[]

  @column()
  created: DateTime
}
