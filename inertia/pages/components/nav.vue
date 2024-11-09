<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
//import { useStore } from 'vuex'; // Import the Vuex store instance

// Access the Vuex store
//const store = useStore();

import store from '~/css/themeStore'
import axios from 'axios'

const isLoading = ref(true)
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
  store.dispatch('loadThemeFromLocalStorage')
  isLoading.value = false

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

    <div>
      <a @click="toggleTheme" class="active" :style="themeStyle">Toggle Theme</a>
    </div>

    <!-- Navigation links -->
    <a href="/discover" :style="themeStyle">Discover</a>

    <!--    <template v-if="!isLoading">-->
    <!-- Always visible About link -->
    <a href="/about" :style="themeStyle">About</a>
    <!-- Conditionally display "My travels" based on login state -->
    <a v-if="isLoggedIn" href="/mytravels" :style="themeStyle">My travels</a>

    <!-- Authentication links (login, signup or logout) -->
    <div class="auth-container split">
      <a v-if="!isLoggedIn" href="/login" class="auth-split" :style="themeStyle">Log In</a>
      <a v-if="!isLoggedIn" href="/signup" class="auth-split" :style="themeStyle">Sign Up</a>
      <a v-if="isLoggedIn" @click.prevent="logout" class="auth-split" :style="themeStyle"
        >Log Out</a
      >
      <span v-if="isLoggedIn" :style="themeStyle">Welcome, {{ userName.username }}</span>
    </div>
    <!--    </template>-->

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

.topnav a {
  float: left;
  display: block;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.topnav .active {
  color: white;
}

/* Create a right-aligned (split) link inside the navigation bar */
.split {
  float: right;
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

.auth-split {
  text-decoration: none; /* Optional: Remove underline */
  padding: 10px;
  border-radius: 5px;
}

[v-cloak] {
  display: none;
}
</style>
