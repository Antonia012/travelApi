import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        user_id: 1,
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'admin',
      },
    ])
  }
}
