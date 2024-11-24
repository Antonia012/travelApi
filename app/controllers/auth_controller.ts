import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  // Registration
  async register({ request, response }: HttpContextContract) {
    try {
      const userData = request.only(['username', 'email', 'password'])

      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      })

      return response.created({ user })
    } catch (error) {
      console.error('Error creating user:', error)
      return response.badRequest({ error: error.message })
    }
  }

  async store(ctx: HttpContextContract) {
    const { request, response, auth } = ctx
    const { email, password } = request.only(['email', 'password'])

    const trimmedPassword = password.trim()

    const user = await User.findBy('email', email)

    if (!user) {
      return response.badRequest({ message: 'Invalid credentials user' })
    }

    const isLoggedIn = await auth.use('web').check()

    if (isLoggedIn) {
      await auth.use('web').logout()
    }

    const passwordVerified = await hash.verify(user.password, trimmedPassword)

    if (!passwordVerified) {
      return response.badRequest({ message: 'Invalid credentials pswrd' })
    }
    await auth.use('web').login(user)

    return response.ok({ message: 'Login successful', user })
  }

  async logout(ctx: HttpContextContract) {
    const { auth, response } = ctx

    const isLoggedIn = await auth.use('web').check()

    if (!isLoggedIn) {
      return response.badRequest({ message: 'User is already logged in' })
    }

    await auth.use('web').logout()

    return response.redirect().toRoute('home')
  }

  async getUser(ctx: HttpContextContract) {
    const { auth, response } = ctx
    const isLoggedIn = await auth.use('web').check()

    if (!isLoggedIn) {
      return response.unauthorized({ message: 'navber User not authenticated' })
    }

    return response.ok(auth.use('web').user)
  }

  async countUsers(ctx: HttpContextContract) {
    try {
      const { response } = ctx
      const result = await db.from('users').max('id')
      const maxId = result[0]?.max ?? 0
      return response.json({ maxId })
    } catch (error) {
      return response.status(400).send('Failed to get maximum id')
    }
  }
}
