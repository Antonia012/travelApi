/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CountriesController = () => import('#controllers/countries_controller')
const CitiesController = () => import('#controllers/cities_controller')
const ActivitiesController = () => import('#controllers/activities_controller')
const TravelPostsController = () => import('#controllers/travel_posts_controller')
const AuthController = () => import('#controllers/auth_controller')

router.on('/').renderInertia('home').as('home')
router.on('/about').renderInertia('about').as('about')
router.on('/discover').renderInertia('discover').as('discover')
router.on('/addtravel').renderInertia('addtravel')
router.group(() => {
  router.on('/signup').renderInertia('auth/signup')
  router.post('/signup', [AuthController, 'register'])
  router.on('/login').renderInertia('auth/login')
  router.post('/login', [AuthController, 'store'])
})
router.post('/logout', [AuthController, 'logout'])

router
  .on('/mytravels')
  .renderInertia('mytravels')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

router.get('/countries', [CountriesController, 'index']).use(
  middleware.auth({
    guards: ['web'],
  })
)
router.get('/cities', [CitiesController, 'index']).use(
  middleware.auth({
    guards: ['web'],
  })
)
router.get('/activities', [ActivitiesController, 'index']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/travelposts', [TravelPostsController, 'index'])
router.post('/travelposts', [TravelPostsController, 'store']).use(
  middleware.auth({
    guards: ['web'],
  })
)
router.get('/travelposts/count', [TravelPostsController, 'count'])

router.get('/user', [AuthController, 'getUser']).use(
  middleware.auth({
    guards: ['web'],
  })
)
