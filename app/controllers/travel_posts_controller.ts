import { HttpContext } from '@adonisjs/core/http'

import db from '@adonisjs/lucid/services/db'
import TravelPost from '#models/travel_post'

export default class TravelPostsController {
  async index({ response }: HttpContext) {
    try {
      const posts = await TravelPost.all()

      return response.json(posts) // Return the posts as a JSON response
    } catch (error) {
      return response.status(500).send('Internal Server Error')
    }
  }

  // Store a new travel post
  async store({ request, response }: HttpContext) {
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
      await db.insertQuery().table('travel_posts').insert(data)

      const travelPost = await db.from('travel_posts').where('id', data.id).first()

      return response.status(201).json(travelPost)
    } catch (error) {
      return response.status(400).send('Failed to create travel post')
    }
  }

  async count({ response }: HttpContext) {
    try {
      const result = await db.from('travel_posts').max('id')
      const maxId = result[0]?.max ?? 0
      return response.json({ maxId })
    } catch (error) {
      return response.status(400).send('Failed to get maximum id')
    }
  }

  async show({ request, response, inertia }: HttpContext) {
    const data = request.only(['id', 'edit'])
    console.log('Data:', data)
    try {
      const travelPost = await db.from('travel_posts').where('id', data.id).first()
      if (travelPost) {
        return inertia.render('viewpost', { travelPost, edit: data.edit })
      } else {
        return response.status(404).send('Travel post not found')
      }
    } catch (error) {
      return response.status(500).send('Internal Server Error')
    }
  }

  async userPosts({ params, response }: HttpContext) {
    const { username } = params

    try {
      const userPosts = await db.from('travel_posts').where('username', username)

      if (userPosts.length > 0) {
        return response.json(userPosts)
      } else {
        return response.status(404).send('No posts found for this user')
      }
    } catch (error) {
      return response.status(500).send('Internal Server Error')
    }
  }

  async updatePost({ request, response }: HttpContext) {
    const data = request.only([
      'id',
      'username',
      'userOfPost',
      'title',
      'countries',
      'cities',
      'activities',
      'about',
      'todoItems',
      'checkedItems',
    ])

    const postData = {
      id: data.id,
      title: data.title,
      countries: data.countries,
      cities: data.cities,
      activities: data.activities,
      about: data.about,
      todoItems: data.todoItems,
      checkedItems: data.checkedItems,
    }
    try {
      if (data.userOfPost !== data.username) {
        return response.status(403).send('wrong user')
      }

      await db.from('travel_posts').where('id', data.id).update(postData)
      const travelPost = await db.from('travel_posts').where('id', data.id).first()
      return response.json(travelPost)
    } catch (error) {
      return response.status(400).send('Failed to update travel post')
    }
  }

  async destroyPost({ params, request, response }: HttpContext) {
    const { id } = params
    const { username, userOfPost } = request.only(['username', 'userOfPost'])
    try {
      if (userOfPost !== username) {
        return response.status(403).send('wrong user')
      }

      await db.from('travel_posts').where('id', id).delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(400).send('Failed to delete travel post')
    }
  }
}
