import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Activity from '#models/activity'

export default class extends BaseSeeder {
  async run() {
    await Activity.createMany([
      {
        name: 'hiking',
      },
      {
        name: 'sight-seeing',
      },
      {
        name: 'other',
      },
      {
        name: 'beach',
      },
      {
        name: 'wine tasting',
      },
      {
        name: 'gastronomy',
      },
      {
        name: 'spa and wellness',
      },
      {
        name: 'shopping',
      },
      {
        name: 'fishing',
      },
      {
        name: 'cycling',
      },
      {
        name: 'wild safari',
      },
      {
        name: 'road trip',
      },
      {
        name: 'water sports',
      },
      {
        name: 'theme park',
      },
      {
        name: 'horseback riding',
      },
      {
        name: 'nightlife',
      },
      {
        name: 'photography',
      },
    ])
  }
}
