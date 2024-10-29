<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import Nav from './components/nav.vue'
import axios from 'axios'
import TravelPost from '~/pages/components/post.vue'
import store from '~/css/themeStore'

const travelPosts = ref([])

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)

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
  <Head title="Travel Map - Discover" />
  <Nav />
  <div :style="themeStyle" class="app-container">
    <h1>Discover</h1>

    <ul>
      <TravelPost v-for="post in travelPosts" :key="post.id" :post="post" viewMode="view" />
    </ul>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

button {
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid;
  border-radius: 5px;
}
</style>
