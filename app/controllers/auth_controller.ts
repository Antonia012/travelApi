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
  async store(ctx: HttpContextContract) {
    const { request, response, auth } = ctx
    const { email, password } = request.only(['email', 'password'])

    const trimmedPassword = password.trim()

    const user = await User.findBy('email', email)

    if (!user) {
      return response.badRequest({ message: 'Invalid credentials user' })
    }

    // Check if the user is already logged in
    const isLoggedIn = await auth.use('web').check()
    console.log('User is logged in:', isLoggedIn)

    if (isLoggedIn) {
      console.log('User is already logged in:', auth.use('web').user)
      await auth.use('web').logout()

      // return response.badRequest({ message: 'User is already logged in' })
    }

    const passwordVerified = await hash.verify(user.password, trimmedPassword)

    console.log(passwordVerified)

    if (!passwordVerified) {
      return response.badRequest({ message: 'Invalid credentials pswrd' })
    }
    console.log('before', auth.use('web').user)
    await auth.use('web').login(user)
    console.log('after', auth.use('web').user)

    // response.redirect.toRoute('about')
    // return response.redirect().toRoute('about')
    return response.ok({ message: 'Login successful', user, redirectUrl: '/about' })
  }

  // async login({ request, auth, response }: HttpContext) {
  //   /**
  //    * Step 1: Get credentials from the request body
  //    */
  //   const { email, password } = request.only(['email', 'password'])
  //
  //   /**
  //    * Step 2: Verify credentials
  //    */
  //   const user = await User.verifyCredentials(email, password)
  //
  //   /**
  //    * Step 3: Login user
  //    */
  //   await auth.use('web').login(user)
  //
  //   /**
  //    * Step 4: Send them to a protected route
  //    */
  //   response.redirect('/')
  // }

  //Logout
  async logout(ctx: HttpContextContract) {
    const { auth, response } = ctx

    // Check if the user is already logged in
    const isLoggedIn = await auth.use('web').check()
    console.log('User is logged in:', isLoggedIn)

    if (!isLoggedIn) {
      console.log('User is already logged in:', auth.use('web').user)
      return response.badRequest({ message: 'User is already logged in' })
    }

    console.log('logout before', auth.use('web').user)

    await auth.use('web').logout()
    console.log('logout after', auth.use('web').user)

    // return ctx.response.redirect('/about')
    return response.ok({ message: 'Logged out successfully' })
  }

  async getUser(ctx: HttpContextContract) {
    const { auth, response } = ctx
    const isLoggedIn = await auth.use('web').check()

    if (!isLoggedIn) {
      return response.unauthorized({ message: 'navber User not authenticated' })
    }

    return response.ok(auth.use('web').user)
  }
}
