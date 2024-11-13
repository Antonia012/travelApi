import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Country from '#models/country'

export default class extends BaseSeeder {
  async run() {
    await Country.createMany([
      {
        name: 'Slovakia',
      },
      {
        name: 'Hungary',
      },
      {
        name: 'Czech Republic',
      },
      {
        name: 'Poland',
      },
    ])
  }
}
