import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Country from '#models/country'

export default class CountriesController {
  async index({ response }: HttpContextContract) {
    try {
      const countries = await Country.all()
      return response.json(countries)
    } catch (error) {
      return response.status(500).send('Internal Server Error')
    }
  }
}
