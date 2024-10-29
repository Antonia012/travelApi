/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import {middleware} from "#start/kernel";
import AuthMiddleware from "#middleware/auth_middleware";

const CountriesController = () => import('#controllers/countries_controller')
const CitiesController = () => import('#controllers/cities_controller')
const ActivitiesController = () => import('#controllers/activities_controller')
const TravelPostsController = () => import('#controllers/travel_posts_controller')
const AuthController = () => import('#controllers/auth_controller')
const auth = () => import('#middleware/auth_middleware')

router.on('/').renderInertia('home')
router.on('/about').renderInertia('about')
router.on('/discover').renderInertia('discover')
router.on('/login').renderInertia('auth/login')
router.on('/signup').renderInertia('auth/signup')
router.on('/mytravels').renderInertia('mytravels')
router.on('/addtravel').renderInertia('addtravel')

router.get('/countries', [CountriesController, 'index'])
router.get('/cities', [CitiesController, 'index'])
router.get('/activities', [ActivitiesController, 'index'])

router.get('/travelposts', [TravelPostsController, 'index'])
router.post('/travelposts', [TravelPostsController, 'store'])
router.get('/travelposts/count', [TravelPostsController, 'count'])

router.post('/signup', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
// router.get('/logout').use(middleware.auth({guards: ['basicAuth']}))
const authMiddleware = new AuthMiddleware()

router.get('/logout', async (ctx) => {
  const authController = new AuthController(); // Create an instance of the controller
  return await authController.logout(ctx); // Pass the context directly
}).use(middleware.auth);
