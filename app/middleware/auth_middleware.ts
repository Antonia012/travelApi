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

  async handle(
    ctx: HttpContextContract,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    if (ctx.request.url() === '/logout') {
      return next()
    }

    const isLoggedIn = await ctx.auth.use('web').check()

    if (!isLoggedIn) {
      return ctx.response.redirect(this.redirectTo)
    }

    await next()
  }
}
