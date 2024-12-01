<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import Nav from './components/layout.vue'
import axios from 'axios'
import TravelPost from '~/pages/components/post.vue'
import store from '~/css/themeStore'
import Layout from "~/pages/components/layout.vue";

const travelPosts = ref(null)
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
  <Head title="Travel App - Discover" />
  <Layout>
  <div class="app__container" :style="themeStyle">
    <div class="container" >
      <div class="discover__background">
        <div class="container__title">Discover</div>
        <div v-if="travelPosts && travelPosts.length === 0">
          No travel posts found. Be the first traveler and experience new adventures ! &nbsp; :)
        </div>
      </div>

      <ul class="mtb3">
        <TransitionGroup name="fade" tag="ul">

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
        </TransitionGroup>
      </ul>
    </div>
  </div>
  </Layout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95); /* Slight shrink effect */
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1); /* Full size */
}

.discover__background {
  background: v-bind(themeStyle.backgroundColor);
  padding: 20px;
  border-radius: 32px;

  box-shadow: 0 0 10px v-bind(themeStyle.secondary);

  text-align: center;
  width: 100%;
}
</style>
