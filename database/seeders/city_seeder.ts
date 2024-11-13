import { BaseSeeder } from '@adonisjs/lucid/seeders'
import City from '#models/city'

export default class extends BaseSeeder {
  async run() {
    await City.createMany([
      {
        name: 'Bratislava',
        countryId: 1,
      },
      {
        name: 'Košice',
        countryId: 1,
      },
      {
        name: 'Brno',
        countryId: 3,
      },
      {
        name: 'Praha',
        countryId: 3,
      },
      {
        name: 'Ostrava',
        countryId: 3,
      },
      {
        name: 'Budapest',
        countryId: 2,
      },
      {
        name: 'Krakow',
        countryId: 4,
      },
      {
        name: 'Warsaw',
        countryId: 4,
      },
    ])
  }
}
