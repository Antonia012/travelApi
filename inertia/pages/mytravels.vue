<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import TravelPost from './components/post.vue' // Import the new component
import axios from 'axios'
import store from '~/css/themeStore'
import Layout from '~/pages/components/layout.vue'

const travelPosts = ref([])
const cities = ref([])
const countries = ref([])
const activities = ref([])

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)
// Function to fetch travel posts from the server
const fetchTravelPosts = async () => {
  try {
    const response = await axios.get('/travelposts')
    travelPosts.value = response.data
  } catch (error) {
    console.error('Error fetching travel posts:', error)
  }
}

const fetchCities = async () => {
  try {
    const response = await axios.get('/cities')
    cities.value = response.data
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
}

const fetchCounties = async () => {
  try {
    const response = await axios.get('/countries')
    countries.value = response.data
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

const fetchActivites = async () => {
  try {
    const response = await axios.get('/activities')
    activities.value = response.data
  } catch (error) {
    console.error('Error fetching activities:', error)
  }
}

// Fetch travel posts when the component is mounted
onMounted(() => {
  fetchTravelPosts()
  fetchCities()
  fetchCounties()
  fetchActivites()
  store.dispatch('loadThemeFromLocalStorage')
})
</script>

<template>
  <Head title="Travel Map - My Travels" />
  <Layout>
    <div :style="themeStyle">
      <div class="container">
        <div class="my-travels__header">
          <a href="/addtravel" class="btn btn--add-travel">Add New Travel</a>
        </div>

        <div>
          <ul class="m3" >
            <TravelPost
              v-for="post in travelPosts"
              :key="post.id"
              :post="post"
              viewMode="edit"
              :countries="countries"
              :cities="cities"
              :activities="activities"
              class="mtb10"
            />
          </ul>
        </div>

        <div v-if="travelPosts.length === 0">
          <p>No travel posts available. Please add some!</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.my-travels__header {
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
}

.btn--add-travel {
  box-sizing: content-box;
  border-color: v-bind(themeStyle.accent);
  color: v-bind(themeStyle.accent);
  //box-shadow: 0 2px 16px v-bind(themeStyle.accent);
  font-size: 20px;
}

.btn--add-travel:hover {
  border-width: 2px;
  margin: 8px;

  //border-color: v-bind(themeStyle.color);
  background: v-bind(themeStyle.accent);
  color: v-bind(themeStyle.backgroundColor);

  //transition: color 0.5s, border-color 0.5s;
}

ul {
  list-style-type: none;
  padding: 0;
}

.my-travels__section {
  margin: 30px;
}

</style>
