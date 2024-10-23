import { createStore } from 'vuex'
import { Palette, lightPalette, darkPalette } from '~/css/colors' // Make sure these are correctly imported

const store = createStore({
  state: {
    theme: 'light' as 'light' | 'dark',
    palette: lightPalette as Palette, // Initialize palette with lightPalette
    isMenuOpen: false,
    isLoggedIn: false,
  },
  mutations: {
    toggleTheme(state) {
      // Toggle between 'light' and 'dark'
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      // Update the palette based on the theme
      state.palette = state.theme === 'light' ? lightPalette : darkPalette
    },
    setTheme(state, theme: 'light' | 'dark') {
      // Set the theme directly (useful for loading from localStorage)
      state.theme = theme
      state.palette = theme === 'light' ? lightPalette : darkPalette
    },
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen
    },
    setLoginStatus(state, status: boolean) {
      state.isLoggedIn = status
    },
    setLoginStatus(state, status: boolean) {
      state.isLoggedIn = status
    },
  },
  getters: {
    themeStyle(state) {
      // Dynamically apply styles based on the current theme
      return {
        backgroundColor: state.palette.background,
        color: state.palette.text,
        primary: state.palette.primary,
        secondary: state.palette.secondary,
        /*primary_inverse: state.palette.primary_inverse,
        secondary_inverse: state.palette.secondary_inverse,*/
        accent: state.palette.accent,
        warning: state.palette.warning,
      }
    },
    isMenuOpen(state) {
      return state.isMenuOpen
    },
    isLoggedIn(state) {
      return state.isLoggedIn
    },
  },
  actions: {
    async loadThemeFromLocalStorage({ commit }) {
      // Load theme from localStorage when the app is initialized
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
        if (savedTheme) {
          commit('setTheme', savedTheme) // Set the theme directly
        }

        // Load login status from localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        commit('setLoginStatus', isLoggedIn)
      }
    },
  },
})

// Export the store
export default store
