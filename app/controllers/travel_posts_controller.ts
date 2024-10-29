import { HttpContext } from '@adonisjs/core/http'

import db from '@adonisjs/lucid/services/db'
import TravelPost from '#models/travel_post'

export default class TravelPostsController {
  async index({ response }: HttpContext) {
    try {
      const posts = await TravelPost.all()
      return response.json(posts) // Return the posts as a JSON response
    } catch (error) {
      console.error('Error fetching travel posts:', error) // Log the error
      return response.status(500).send('Internal Server Error')
    }
  }

  // Store a new travel post
  async store({ request, response }: HttpContext) {
    // Extract data from the request, including the id
    const data = request.only([
      'id',
      'title',
      'countries',
      'cities',
      'activities',
      'about',
      'todoItems',
      'checkedItems',
    ])
    try {
      // Insert the new travel post into the database, assuming 'id' is provided in the data
      await db.insertQuery().table('travel_posts').insert(data)

      // Fetch the newly created travel post
      const travelPost = await db.from('travel_posts').where('id', data.id).first()

      return response.status(201).json(travelPost) // Return the created travel post
    } catch (error) {
      console.error('Error creating travel post:', error)
      return response.status(400).send('Failed to create travel post')
    }
  }

  // Count the number of travel posts
  async count({ response }: HttpContext) {
    try {
      const total = await db.from('travel_posts').count('* as total')

      const recordCount = total.length > 0 ? total[0].total : 0

      return response.json({ total: recordCount })
    } catch (error) {
      console.error('Error fetching travel post count:', error)
      return response.status(500).send('Internal Server Error')
    }
  }
}
