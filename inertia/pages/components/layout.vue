<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import logo from '/resources/img/logo.png'
import store from '~/css/themeStore'
import axios from 'axios'
import { router } from '@inertiajs/vue3'
import Pokus from '~/pages/components/nav.vue'

const userName = ref('')
const themeStyle = computed(() => store.getters.themeStyle)
const isLoggedIn = computed(() => store.state.isLoggedIn)
const dropdownVisible = ref(false)
const isMobile = computed(() => windowWidth.value < 600)
const windowWidth = ref(0)
const isPopupVisible = ref(false)
let errorMessage = ref('Wanna try dark mode? Buy premium')

function toggleTheme() {
  isPopupVisible.value = true
}

function goDark() {
  store.commit('toggleTheme')
  localStorage.setItem('theme', store.state.theme)
}

function closePopUp() {
  isPopupVisible.value = false
}

function toggleDropdown() {
  dropdownVisible.value = !dropdownVisible.value
}

onMounted(async () => {
  await store.dispatch('loadThemeFromLocalStorage')

  try {
    const response = await axios.get('/user')
    userName.value = response.data.username
  } catch (error) {
    console.error('Failed to fetch user details', error)
  }
})

const logout = async () => {
  try {
    const response = await axios.post('/logout')

    store.commit('setLoginStatus', false)
    localStorage.setItem('isLoggedIn', 'false')

    await router.get('/discover')
  } catch (error) {
    console.error('Logout failed', error)
  }
}

</script>

<script>
import axios from 'axios'
import { ref } from 'vue'

export default {
  name: 'Layout',
  setup() {
    const userName = ref('')
    const getUserName = async () => {
      try {
        const response = await axios.get('/user')
        userName.value = response.data.username
      } catch (error) {
        console.error('Failed to fetch user details', error)
      }
    }

    // Call the function when the component is mounted
    getUserName()

    return {
      userName,
    }
  },
}
</script>

<template>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <div :class="['topnav']" :style="themeStyle">
    <div class="topnav__mobile">
      <div @click="toggleTheme" :style="themeStyle" style="align-content: center">
        <img src="/resources/img/mode.png" alt="" class="mode" />
      </div>
    </div>

    <div class="nav-left">
      <a href="/discover" :style="themeStyle">Discover</a>
      <a href="/about" :style="themeStyle">About</a>
    </div>

    <div class="nav-center">
      <div class="logo" @click="toggleDropdown()">
        <img :src="logo" alt="Logo" class="logo-img" />
      </div>
    </div>

    <div class="nav-right">
      <a v-if="!isLoggedIn" href="/login" class="auth-split" :style="themeStyle">Log In</a>
      <a v-if="!isLoggedIn" href="/signup" class="auth-split" :style="themeStyle">Sign Up</a>
      <a v-if="isLoggedIn" href="/mytravels" :style="themeStyle">My Travels</a>
      <a v-if="isLoggedIn" @click.prevent="logout" class="auth-split" :style="themeStyle"
        >Log Out</a
      >
      <span v-if="isLoggedIn" :style="themeStyle" v-cloak>Welcome, {{ userName }}</span>
    </div>

    <div v-if="dropdownVisible" class="dropdown-content">
      <div class="nav-left-dropdown">
        <a href="/discover" :style="themeStyle">Discover</a>
        <a href="/about" :style="themeStyle">About</a>
      </div>
      <div class="nav-right-dropdown">
        <a v-if="!isLoggedIn" href="/login" :style="themeStyle">Log In</a>
        <a v-if="!isLoggedIn" href="/signup" :style="themeStyle">Sign Up</a>
        <a v-if="isLoggedIn" href="/mytravels" :style="themeStyle">My Travels</a>
        <a v-if="isLoggedIn" @click.prevent="logout" :style="themeStyle">Log Out</a>
      </div>
    </div>

    <div v-if="isPopupVisible" class="popup-overlay" @click.self="closePopUp">
      <div class="popup-content">
        <p class="error-message">{{ errorMessage }}</p>
        <div @click="goDark" class="easter-egg">easteregg</div>
        <button @click="isPopupVisible = false">Close</button>
      </div>
    </div>
  </div>

  <Transition name="fade" mode="out-in">
    <slot></slot>
  </Transition>

</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease; /* Smooth transition with 0.5s duration */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0; /* Initial or final state: fully transparent */
  transform: scale(0.95); /* Slight shrink effect */
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1; /* Final or initial state: fully visible */
  transform: scale(1); /* Slight shrink effect */
}


.topnav {
  padding: 10px 30px;
  overflow: hidden;
  background-color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  flex-direction: row;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.easter-egg {
  cursor: pointer;
  color: v-bind(themeStyle.backgroundColor);
}

.mode {
  height: 50px;
  min-width: 50px;
  width: auto;
}

.topnav__mobile {
  display: flex;
  flex-direction: row;
  gap: 30px;
}

.nav-left,
.nav-center,
.nav-right {
  display: flex;
  align-items: center;
}

.nav-left a,
.nav-right a {
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.nav-center {
  justify-content: center;
}

.nav-center .logo {
  display: block;

  @media (max-width: 600px){
    cursor: pointer;

  }
}

.nav-center .logo-img {
  width: 90px;
  height: 98px;
}

.nav-left {
  justify-content: flex-end;
  flex-grow: 1;
}

.nav-right {
  justify-content: flex-start;
  flex-grow: 1;
}

.auth-split {
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
}

.dropdown-content {
  display: none;
  width: 100%;
  z-index: 1;
  justify-content: space-between;
  padding: 10px;
}

.nav-left-dropdown,
.nav-right-dropdown {
  display: flex;
  flex-direction: column;
}

.nav-left-dropdown a,
.nav-right-dropdown a {
  text-align: center;
  padding: 10px;
  text-decoration: none;
  color: white;
}

.nav-left-dropdown a:hover,
.nav-right-dropdown a:hover {
  background-color: #555;
}

@media screen and (max-width: 600px) {
  .topnav .nav-left,
  .topnav .nav-right {
    display: none;
  }

  .dropdown-content {
    display: flex;
    flex-direction: column;
    background-color: v-bind(themeStyle.backgroundColor);
    border-radius: 32px;
    box-shadow: 0 3px 3px v-bind(themeStyle.secondary);
  }

  .nav-left-dropdown a,
  .nav-right-dropdown a {
    color: white;
    text-align: center;
    padding: 10px 20px;
    font-size: 16px;
  }

  .nav-left-dropdown a:hover,
  .nav-right-dropdown a:hover {
    background-color: #555;
  }
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: v-bind(themeStyle.backgroundColor);
  padding: 20px;
  border-radius: 32px;
  text-align: center;
  width: 300px;
  max-width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.popup-content p {
  font-size: 18px;
  margin-bottom: 20px;
}

.popup-content button {
  box-sizing: border-box;

  padding: 6px 13px;
  margin: 8px;
  cursor: pointer;
  border-radius: 16px;

  color: v-bind(themeStyle.color);
  box-shadow: 0 3px 5px v-bind(themeStyle.secondary);
  background: v-bind(themeStyle.backgroundColor);
}

.popup-content button:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 5px v-bind(themeStyle.primary);
  background: v-bind(themeStyle.backgroundColor);
}
</style>
