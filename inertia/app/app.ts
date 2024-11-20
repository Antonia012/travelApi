import '../css/app.css' // Import global styles
import { createSSRApp, h } from 'vue'
import axios from 'axios'
import store from '~/css/themeStore' // Import the Vuex store (ensure it's defined)
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import auth from '#config/auth'
import LayoutUser from '~/pages/components/layoutUser.vue'
import LayoutGuest from '~/pages/components/layoutGuest.vue'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

// Set the Axios default base URL globally
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Optionally, set the Authorization header if a token is present
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Create the Inertia app
createInertiaApp({
  progress: { background: 'red' }, // Loading progress color

  title: (title) => `${title} - ${appName}`, // Title formatting

  resolve: async (name) => {
    // Resolve page components dynamically based on the page name
    return resolvePageComponent(`../pages/${name}.vue`, import.meta.glob('../pages/**/*.vue'))

    // // Resolve page components dynamically based on the page name
    // const page = await resolvePageComponent(
    //   `../pages/${name}.vue`,
    //   import.meta.glob('../pages/**/*.vue')
    // )
    // // Determine layout based on authentication
    // const isLoggedIn = await auth.user // Or use Vuex state or another method to check authentication
    // console.log(isLoggedIn)
    //
    // // Use LayoutUser if logged in, LayoutGuest otherwise
    // // Assign the layout to the page
    // // page.default.layout = isLoggedIn ? LayoutUser : LayoutGuest
    // page.default.layout = LayoutUser
    // return page
  },

  setup({ el, App, props, plugin }) {
    // Create the SSR app instance
    const app = createSSRApp({ render: () => h(App, props) })

    // Use the store (Vuex or Pinia)
    app.use(store) // Ensure the store is used

    // Use Inertia.js plugin
    app.use(plugin)

    // Mount the app to the provided DOM element
    app.mount(el)
  },
})
