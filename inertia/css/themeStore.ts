// eslint-disable-next-line unicorn/filename-case
// eslint-disable-next-line unicorn/filename-case
import { createStore } from 'vuex'
import { Palette, lightPalette, darkPalette } from '~/css/colors'

const store = createStore({
  state: {
    theme: 'light' as 'light' | 'dark',
    palette: lightPalette as Palette,
    isMenuOpen: false,
    isLoggedIn: false,
  },
  mutations: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      state.palette = state.theme === 'light' ? lightPalette : darkPalette
    },
    setTheme(state, theme: 'light' | 'dark') {
      state.theme = theme
      state.palette = theme === 'light' ? lightPalette : darkPalette
    },
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen
    },
    setLoginStatus(state, status: boolean) {
      state.isLoggedIn = status
    },
  },
  getters: {
    themeStyle(state) {
      return {
        backgroundColor: state.palette.background,
        color: state.palette.text,
        primary: state.palette.primary,
        secondary: state.palette.secondary,
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
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
        if (savedTheme) {
          commit('setTheme', savedTheme)
        }

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        commit('setLoginStatus', isLoggedIn)
      }
    },
  },
})

export default store
