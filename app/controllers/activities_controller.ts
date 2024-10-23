import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Activity from '#models/activity'

export default class ActivitiesController {
  public async index({ response }: HttpContextContract) {
    try {
      const activities = await Activity.all(); // Fetch all countries from the database
      return response.json(activities); // Return the countries as a JSON response
    } catch (error) {
      return response.status(500).send('Internal Server Error');
    }
  }
}
