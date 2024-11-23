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
      'username',
      'title',
      'countries',
      'cities',
      'activities',
      'about',
      'todoItems',
      'checkedItems',
      'created',
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
      const result = await db.from('travel_posts').max('id')
      console.log(result)
      // If there are no records, the max ID will be null, so default to 0
      const maxId = result[0]?.max ?? 0
      console.log('Max ID:', maxId)
      return response.json({ maxId })
    } catch (error) {
      console.error('Error getting maximum id:', error)
      return response.status(400).send('Failed to get maximum id')
    }
  }

  // Show a specific travel post by its ID
  async show({ request, response, inertia }: HttpContext) {
    const data = request.only(['id', 'edit'])
    console.log('Data:', data)
    try {
      const travelPost = await db.from('travel_posts').where('id', data.id).first()
      if (travelPost) {
        // Render the Inertia page for the travel post
        return inertia.render('viewpost', { travelPost, edit: data.edit })
      } else {
        return response.status(404).send('Travel post not found')
      }
    } catch (error) {
      console.error('Error fetching travel post:', error)
      return response.status(500).send('Internal Server Error')
    }
  }

  // Show a specific travel post by its ID
  async userPosts({ params, request, response }: HttpContext) {
    console.log(params)
    const { username } = params // Extract userId from route parameters
    console.log('User ID:', username)

    try {
      // Query the database to fetch posts for the specific user
      const userPosts = await db.from('travel_posts').where('username', username)

      if (userPosts.length > 0) {
        return response.json(userPosts) // Return the user's posts as JSON
      } else {
        return response.status(404).send('No posts found for this user')
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
      return response.status(500).send('Internal Server Error')
    }
  }

  async updatePost({ request, response }: HttpContext) {
    const data = request.only([
      'title',
      'countries',
      'cities',
      'activities',
      'about',
      'todoItems',
      'checkedItems',
    ])
    try {
      await db.from('travel_posts').where('id', data.id).update(data)
      const travelPost = await db.from('travel_posts').where('id', data.id).first()
      return response.json(travelPost)
    } catch (error) {
      console.error('Error updating travel post:', error)
      return response.status(400).send('Failed to update travel post')
    }
  }

  async destroyPost({ params, response }: HttpContext) {
    const { id } = params
    try {
      await db.from('travel_posts').where('id', id).delete()
      return response.status(204).send()
    } catch (error) {
      console.error('Error deleting travel post:', error)
      return response.status(400).send('Failed to delete travel post')
    }
  }
}
