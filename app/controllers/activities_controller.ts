import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Activity from '#models/activity'

export default class ActivitiesController {
  async index({ response }: HttpContextContract) {
    try {
      const activities = await Activity.all()
      return response.json(activities)
    } catch (error) {
      return response.status(500).send('Internal Server Error')
    }
  }
}
