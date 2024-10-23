import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'


export default class TravelPost extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public title: string;

  @column()
  public countries: number[];

  @column()
  public cities: number[];

  @column()
  public activities: number[];

  @column()
  public about: string;

  @column()
  public todoItems: string[];

  @column()
  public checkedItems: boolean[];

}
