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

  <body :style="themeStyle">
    <div class="container">
      <div class="my-travels__header">
        <div class="container__title">My Travels:</div>
        <a href="/addtravel" class="btn btn--add-travel">Add New Travel</a>
      </div>

      <ul>
        <TravelPost v-for="post in travelPosts" :key="post.id" :post="post" viewMode="edit" />
      </ul>

      <div v-if="travelPosts.length === 0">
        <p>No travel posts available. Please add some!</p>
      </div>
    </div>
  </body>
</template>

<style scoped>
.my-travels__header{
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  margin-bottom: 1rem;
}

.btn--add-travel{
  border-color: v-bind(themeStyle.accent);
  color: v-bind(themeStyle.color);
}

ul {
  list-style-type: none;
  padding: 0;
}

</style>
