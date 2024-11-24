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

router
  .get('/', async ({ inertia }) => {
    return inertia.render('home')
  })
  .as('home')

router
  .get('/about', async ({ inertia }) => {
    return inertia.render('about')
  })
  .as('about')

router
  .get('/discover', async ({ inertia }) => {
    return inertia.render('discover')
  })
  .as('discover')

router
  .get('/addtravel', async ({ inertia }) => {
    return inertia.render('addtravel')
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
  .as('addtravel')
router.group(() => {
  router
    .get('/signup', async ({ inertia }) => {
      return inertia.render('auth/signup')
    })
    .as('signup.index')

  router.post('/signup', [AuthController, 'register']).as('signup.register')

  router
    .get('/login', async ({ inertia }) => {
      return inertia.render('auth/login')
    })
    .as('login.index')

  router.post('/login', [AuthController, 'store']).as('login.store')
})

router.post('/logout', [AuthController, 'logout']).as('logout')

router
  .get('/mytravels', async ({ inertia }) => {
    return inertia.render('mytravels')
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
  .as('mytravels')

router.get('/travelposts', [TravelPostsController, 'index'])
router.post('/travelposts', [TravelPostsController, 'store']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/travelposts/count', [TravelPostsController, 'count'])

router.get('/travelposts/viewpost', [TravelPostsController, 'show']).as('post.view')

router
  .put('/travelposts/viewpost', [TravelPostsController, 'updatePost'])
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
  .as('post.update')

router.get('/travelposts/:id', [TravelPostsController, 'show']).as('post.show')

router.post('/travelposts/:id', [TravelPostsController, 'updatePost']).use(
  middleware.auth({
    guards: ['web'],
  })
)
router.delete('/travelposts/:id', [TravelPostsController, 'destroyPost']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/travelposts/user/:username', [TravelPostsController, 'userPosts'])

router.get('/user', [AuthController, 'getUser']).use(
  middleware.auth({
    guards: ['web'],
  })
)

router.get('/user/count', [AuthController, 'countUsers'])

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
