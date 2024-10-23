import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  // Registration
  async register({ request, response }: HttpContextContract) {
    try {
      // Get user data from the request
      const userData = request.only(['username', 'email', 'password'])
      console.log('Received user data:', userData) // Log incoming data for debugging

      console.log('get', userData.password)

      // Create the user
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      })

      console.log('save', user.password)

      // Send back a success response
      return response.created({ user })
    } catch (error) {
      console.error('Error creating user:', error)
      return response.badRequest({ error: error.message })
    }
  }

  // Login
  async login({ request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    const trimmedPassword = password.trim()

    const user = await User.findBy('email', email)

    if (!user) {
      return response.badRequest({ message: 'Invalid credentials user' })
    }

    const passwordVerified = await hash.verify(user.password, trimmedPassword)

    console.log(passwordVerified)

    if (!passwordVerified) {
      return response.badRequest({ message: 'Invalid credentials pswrd' })
    }

    return response.ok({ message: 'Login successful', user })
  }

  // Logout
  async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.ok({ message: 'Logged out successfully' })
  }
}
