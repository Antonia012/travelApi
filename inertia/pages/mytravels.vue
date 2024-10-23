<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import Nav from './components/nav.vue'
import TravelPost from './components/post.vue' // Import the new component
import axios from 'axios'
import store from '~/css/themeStore'

const travelPosts = ref([])

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)
// Function to fetch travel posts from the server
const fetchTravelPosts = async () => {
  try {
    const response = await axios.get('/travelposts') // Adjust the URL as necessary
    travelPosts.value = response.data // Store the fetched posts
  } catch (error) {
    console.error('Error fetching travel posts:', error)
  }
}

// Fetch travel posts when the component is mounted
onMounted(() => {
  fetchTravelPosts()

  store.dispatch('loadThemeFromLocalStorage')
})
</script>

<template>
  <Head title="Travel Map - My Travels" />
  <Nav />
  <div :style="themeStyle" class="app-container">
    <h1>My Travels</h1>

    <a href="/addtravel">Add New Travel</a>

    <ul>
      <TravelPost v-for="post in travelPosts" :key="post.id" :post="post" viewMode="edit" />
    </ul>

    <div v-if="travelPosts.length === 0">
      <p>No travel posts available. Please add some!</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any styles you want here */
.app-container {
  min-height: 100vh;
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

a {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}

a:hover {
  background-color: #0056b3;
}
</style>
