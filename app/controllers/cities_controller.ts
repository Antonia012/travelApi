import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from '#models/city'

export default class CitiesController {
  public async index({ response }: HttpContextContract) {
    try {
      const cities = await City.all() // Fetch all countries from the database
      return response.json(cities) // Return the countries as a JSON response
    } catch (error) {
      return response.status(500).send('Internal Server Error')
    }
  }
}
