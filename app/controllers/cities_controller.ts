import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from '#models/city'

export default class CitiesController {
  async index({ response }: HttpContextContract) {
    try {
      const cities = await City.all()
      return response.json(cities)
    } catch (error) {
      return response.status(500).send('Internal Server Error')
    }
  }
}
