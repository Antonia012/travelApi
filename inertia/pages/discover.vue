<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import Nav from './components/nav.vue'
import axios from 'axios'
import TravelPost from '~/pages/components/post.vue'
import store from '~/css/themeStore'

const travelPosts = ref([])
const cities = ref([])
const countries = ref([])
const activities = ref([])

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)

const fetchTravelPosts = async () => {
  try {
    const response = await axios.get('/travelposts')
    travelPosts.value = response.data
  } catch (error) {
    console.error('Error fetching travel posts:', error)
  }
}

// Fetch countries from the API
const fetchCountries = async () => {
  try {
    const response = await axios.get('/countries')
    countries.value = response.data.map((country) => ({
      id: country.countryId,
      name: country.name,
    }))
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

// Fetch cities from the API
const fetchCities = async () => {
  try {
    const response = await axios.get('/cities')
    cities.value = response.data.map((city) => ({
      id: city.cityId,
      name: city.name,
    }))
    console.log('citiessss', response)
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
}

// Fetch activities from the API
const fetchActivities = async () => {
  try {
    const response = await axios.get('/activities')
    activities.value = response.data.map((activity) => ({
      id: activity.activityId,
      name: activity.name,
    }))
  } catch (error) {
    console.error('Error fetching activities:', error)
  }
}

const handleViewMore = async (postId) => {
  // Navigate to a new page with the post data passed as route state
  console.log('Viewing post:', postId)
  router.get(`/travelposts/${postId}`, { id: postId, edit: false} )
};


// Fetch travel posts when the component is mounted
onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
  fetchTravelPosts()
  fetchCities()
  fetchCountries()
  fetchActivities()
})
</script>

<template>
  <Head title="Travel Map - Discover" />
  <Nav />
  <div class="app__container" :style="themeStyle">
    <div class="container" >
      <div class="container__title">Discover</div>

      <ul class="mtb3">
        <TravelPost
          v-for="post in travelPosts"
          :key="post.id"
          :post="post"
          viewMode="view"
          :countries="countries"
          :cities="cities"
          :activities="activities"
          class="mtb10"
          :style="themeStyle"
          @view-more="handleViewMore(post.id)"
        />
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
