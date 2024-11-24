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

const themeStyle = computed(() => store.getters.themeStyle)

const fetchTravelPosts = async () => {
  try {
    const response = await axios.get('/travelposts')
    travelPosts.value = response.data
  } catch (error) {
    console.error('Error fetching travel posts:', error)
  }
}

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

const fetchCities = async () => {
  try {
    const response = await axios.get('/cities')
    cities.value = response.data.map((city) => ({
      id: city.cityId,
      name: city.name,
    }))
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
}

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
  router.get(`/travelposts/${postId}`, { id: postId, edit: false} )
};


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
      <div class="discover__background">
        <div class="container__title">Discover</div>
        <div v-if="travelPosts.length === 0">
          No travel posts found. Be the first traveler and experience new adventures ! &nbsp; :)
        </div>
      </div>

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

<style scoped>
.discover__background {
  background: v-bind(themeStyle.backgroundColor);
  border-radius: 32px;
  padding: 20px;

  box-shadow: 0 0 10px v-bind(themeStyle.secondary);

  text-align: center;
  width: 100%;
}
</style>
