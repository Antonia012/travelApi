import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import auth from '#config/auth'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'
  redirectTo2 = '/'

  async handle(
    ctx: HttpContextContract,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    // console.log('Checking authenticationnn for: ${ctx.request.url()}')
    // if (ctx.request.url() === '/logout') {
    //   return next()
    // }
    // const user = ctx.auth.user
    // console.log('middle', user)
    //
    // if (user === undefined) {
    //   // If user is logged in, redirect to the desired route
    //   return ctx.response.redirect().toRoute(this.redirectTo) // Replace with your actual route name
    // }
    //
    // await next()

    if (ctx.request.url() === '/logout') {
      return next()
    }

    const isLoggedIn = await ctx.auth.use('web').check()
    console.log('User is logged in:', isLoggedIn)

    // const user = ctx.auth.use('web').user
    // console.log('Authenticated user:', user?.username)

    console.log('check if can go', isLoggedIn)

    if (!isLoggedIn) {
      return ctx.response.redirect(this.redirectTo)
    }

    await next()
  }
}
