import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Country from '#models/country'

export default class CountriesController {
  public async index({ response }: HttpContextContract) {
    try {
      const countries = await Country.all(); // Fetch all countries from the database
      return response.json(countries); // Return the countries as a JSON response
    } catch (error) {
      return response.status(500).send('Internal Server Error');
    }
  }
}
