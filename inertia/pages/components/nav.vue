<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
//import { useStore } from 'vuex'; // Import the Vuex store instance

// Access the Vuex store
//const store = useStore();

import store from '~/css/themeStore'
import axios from 'axios'

// const isLoading = ref(true)
const userName = ref('')

// Computed properties to access state reactively from Vuex
const themeStyle = computed(() => store.getters.themeStyle)
const isMenuOpen = computed(() => store.getters.isMenuOpen) // Access via getter
const isLoggedIn = computed(() => store.state.isLoggedIn) // You can also access it directly as it's reactive

// Function to toggle the theme using Vuex mutation
function toggleTheme() {
  store.commit('toggleTheme')
  localStorage.setItem('theme', store.state.theme) // Save theme in localStorage
}

// Function to toggle the menu using Vuex mutation
function toggleMenu() {
  store.commit('toggleMenu')
}

// Load the theme from localStorage when the component is mounted
onMounted(async () => {
  await store.dispatch('loadThemeFromLocalStorage')
  // isLoading.value = false

  try {
    const response = await axios.get('http://localhost:3000/user')
    userName.value = response.data.username
    console.log('sdfsdf', userName)
  } catch (error) {
    console.error('Failed to fetch user details', error)
  }
})

const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3000/logout')

    console.log('Logout successful', response.data)

    store.commit('setLoginStatus', false)

    localStorage.setItem('isLoggedIn', 'false')
    // Optionally, redirect to another page or store user session
  } catch (error: any) {
    console.error('Logout failed', error)
  }
}
</script>

<template>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!--  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">-->

  <!-- Apply theme dynamically to the entire navigation bar -->
  <div :class="['topnav', { responsive: isMenuOpen }]" :style="themeStyle">
    <!-- Toggle theme button -->
    <a @click="toggleTheme" class="active" :style="themeStyle">Toggle Theme</a>

    <!-- Left section: Navigation links like Discover, About, My Travels (if logged in) -->
    <div class="nav-left">
      <a href="/discover" :style="themeStyle">Discover</a>
      <a href="/about" :style="themeStyle">About</a>
    </div>

    <!-- Center section: Logo (redirects to home page) -->
    <div class="nav-center">
      <a href="/" class="logo">
        <img src="/resources/img/logo.png" alt="Logo" class="logo-img" />
      </a>
    </div>

    <!-- Right section: Authentication links and user info -->
    <div class="nav-right">
      <a v-if="!isLoggedIn" href="/login" class="auth-split" :style="themeStyle">Log In</a>
      <a v-if="!isLoggedIn" href="/signup" class="auth-split" :style="themeStyle">Sign Up</a>
      <a v-if="isLoggedIn" href="/mytravels" :style="themeStyle">My Travels</a>
      <a v-if="isLoggedIn" @click.prevent="logout" class="auth-split" :style="themeStyle">Log Out</a>
      <span v-if="isLoggedIn" :style="themeStyle">Welcome, {{ userName }}</span>
    </div>

    <!-- Mobile Menu Icon -->
    <a href="javascript:void(0);" class="icon" @click="toggleMenu" :style="themeStyle">
      <i class="fa fa-bars"></i>
    </a>
  </div>
</template>

<style scoped>

/* General Styles for the Navigation Bar */
.topnav {
  overflow: hidden;
  background-color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
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

.auth-container {
  display: flex;
  gap: 10px;
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

[v-cloak] {
  display: none;
}
</style>
