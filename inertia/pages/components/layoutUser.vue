<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex' // Access Vuex store
import axios from 'axios'
import { router } from '@inertiajs/vue3' // Inertia router
import { defineComponent } from 'vue'
import store from '~/css/themeStore'
import { Link } from '@inertiajs/vue3'
import auth from "#config/auth";


// Access Vuex store

// Reactive variable for the user name
const userName = ref('')

// Computed properties to access state reactively from Vuex
const themeStyle = computed(() => store.getters.themeStyle)
const isMenuOpen = computed(() => store.getters.isMenuOpen)
const isLoggedIn = computed(() => store.state.isLoggedIn)

// Function to toggle the theme using Vuex mutation
const toggleTheme = () => {
  store.commit('toggleTheme') // Toggle theme using Vuex
  localStorage.setItem('theme', store.state.theme) // Save theme to localStorage
}

// Function to toggle the menu using Vuex mutation
const toggleMenu = () => {
  store.commit('toggleMenu') // Toggle menu visibility using Vuex
}

// Function to handle logout
const logout = async () => {
  try {
    await router.post('/logout') // Use Inertia router to log out
    store.commit('setLoginStatus', false) // Update the login status in Vuex
    localStorage.setItem('isLoggedIn', 'false') // Update localStorage with login status
  } catch (error) {
    console.error('Logout failed', error)
  }
}

// Load theme from localStorage and fetch user details when the component is mounted
onMounted(async () => {
  // Load theme from localStorage (assuming you have an action for that)
  await store.dispatch('loadThemeFromLocalStorage')

  // Fetch user details from the server via Axios
  try {
    const response = await axios.get('/user')

    userName.value = response.data.username // Set the fetched username
    console.log('User name:', userName.value) // Log the username to console
  } catch (error) {
    console.error('Failed to fetch user details', error)
  }
})
</script>

<template>
  <main>
    <header>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <!-- Apply theme dynamically to the entire navigation bar -->
      <div class="topnav" :class="[{ responsive: isMenuOpen }]" :style="themeStyle">
        <!-- Toggle theme button -->
        <a class="toggle-theme active" @click="toggleTheme" :style="themeStyle">Toggle Theme</a>

        <!-- Left section: Navigation links like Discover, About, My Travels (if logged in) -->
        <div class="nav-left" >
          <a href="/discover">Discoverrrrr</a>
          <a href="/about" :style="themeStyle">About</a>
        </div>

        <!-- Center section: Logo (redirects to home page) -->
        <div class="nav-center">
          <a href="/" class="logo">
            <img src="/resources/img/logo.png" alt="Logo" class="logo-img" />
          </a>
        </div>

        <!-- Right section: Authentication links and user info -->
        <div class="nav-right" >
          <a href="/mytravels" :style="themeStyle">My Travels</a>
          <a @click.prevent="logout" class="auth-split" :style="themeStyle">Log Out</a>

          <!-- Only display user name if not loading -->
          <span :style="themeStyle" >Welcome, {{ userName }}</span>
        </div>

        <!-- Mobile Menu Icon -->
        <a href="javascript:void(0);" class="icon" @click="toggleMenu" :style="themeStyle">
          <i class="fa fa-bars"></i>
        </a>
      </div>
    </header>
    <article>
      <slot />
    </article>
  </main>
</template>


<style scoped>
.toggle-theme {
  font-size: 16px;
  padding: 10px 20px;
  border: 2px solid v-bind(themeStyle.accent);
  border-radius: 32px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

/* Active class when the theme is dark */
.toggle-theme.active {
  background-color: v-bind(themeStyle.backgroundColor);
  color: v-bind(themeStyle.color);
}

/* Add smooth transition for styling */
.toggle-theme:hover {
  background-color: #ddd;
}

/* General Styles for the Navigation Bar */
.topnav {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
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
}

.nav-center .logo-img {
  max-width: 90px; /* Adjust size of the logo */
}

.topnav .active {
  color: white;
}

/* Split layout for the left, center, and right sections */
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

.topnav .icon {
  display: none;
  cursor: pointer;
}

@media screen and (max-width: 600px) {
  .topnav a:not(:first-child) {
    display: none;
  }

  .topnav a.icon {
    float: right;
    display: block;
  }
}

@media screen and (max-width: 600px) {
  .topnav.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
  }

  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
}

/* Styling for the authentication links */
.auth-container {
  display: flex;
  gap: 10px; /* Adjust the gap as needed */
}
</style>
