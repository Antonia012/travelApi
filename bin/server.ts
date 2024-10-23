import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

// URL to the application root
const APP_ROOT = new URL('../', import.meta.url)

// Importer function for dynamic imports
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')

      // Dynamically import controllers if needed
      try {
        const CountriesController = await import('#controllers/countries_controller')
        const CitiesController = await import('#controllers/cities_controller')
        const ActivitiesController = await import('#controllers/activities_controller')
        const TravelPostsController = await import('#controllers/travel_posts_controller')
        const AuthController = await import('#controllers/auth_controller')

        // Register your controller with routes, etc., if necessary
      } catch (error) {
        console.error('Failed to load countries_controller:', error)
      }
    })
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .httpServer()
  .start()
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })
