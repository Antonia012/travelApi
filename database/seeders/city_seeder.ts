import { BaseSeeder } from '@adonisjs/lucid/seeders'
import City from '#models/city'

export default class extends BaseSeeder {
  async run() {
    await City.createMany([
      {
        country_id: 1,
        name: 'Bratislava',
      },
      {
        country_id: 1,
        name: 'Košice',
      },
      {
        country_id: 3,
        name: 'Brno',
      },
      {
        country_id: 3,
        name: 'Praha',
      },
      {
        country_id: 3,
        name: 'Ostrava',
      },
      {
        country_id: 2,
        name: 'Budapest',
      },
      {
        country_id: 4,
        name: 'Krakow',
      },
      {
        country_id: 4,
        name: 'Warsaw',
      },
    ])
  }
}
