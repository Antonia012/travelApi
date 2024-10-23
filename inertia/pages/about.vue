<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Head } from '@inertiajs/vue3'
import Nav from '~/pages/components/nav.vue'
import store from '~/css/themeStore'

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)

// Load the theme from localStorage when the component is mounted
onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
})
</script>

<template>
  <!-- Apply theme to the entire body or root div -->
  <Head title="Travel Map" />

  <Nav />
  <div :style="themeStyle" class="app-container">
    <!-- Apply theme dynamically to the about-container -->
    <div class="about-container" :style="themeStyle">
      <h1>About This Project</h1>
      <p>
        This is a student project designed for travel enthusiasts to share their experiences and
        inspire others. The main goal is to create a platform where people can post their travel
        adventures and plan future trips.
      </p>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Travel Posts:</strong> Each travel post acts like a to-do list, consisting of:
          <ul>
            <li><strong>Header:</strong> The visited place</li>
            <li><strong>Description:</strong> A paragraph explaining the travel experience</li>
          </ul>
        </li>
        <li>
          <strong>Mark Your Travels:</strong> Users can mark places they've visited, allowing them
          to keep track of their adventures.
        </li>
        <li>
          <strong>Planning Tool:</strong> The site will generate suggestions for places you haven't
          visited, based on other users' travels that are near your intended destination.
        </li>
      </ul>

      <h2>Join Our Community!</h2>
      <p>
        Share your stories, get inspired by fellow travelers, and make your travel plans more
        exciting and organized. Together, we can explore the world one post at a time!
      </p>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh; /* Make sure the container covers the full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align the content at the top */
  padding: 0;
  margin: 0;
}

.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-top: 20px;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}
</style>
