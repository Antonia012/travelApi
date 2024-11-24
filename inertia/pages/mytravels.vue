<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import Nav from './components/nav.vue'
import TravelPost from './components/post.vue'
import axios from 'axios'
import store from '~/css/themeStore'

const travelPosts = ref([])
const cities = ref([])
const countries = ref([])
const activities = ref([])
const username = ref('')

const themeStyle = computed(() => store.getters.themeStyle)
const fetchTravelPosts = async () => {
  try {
    const response = await axios.get(`/travelposts/user/${username.value}`, {
      params: { id: username.value },
    })
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

function refreshPage() {
  router.reload()
}

const handleEditPost = async (postId) => {
  router.get(`/travelposts/${postId}`, { id: postId, edit: true })
}

onMounted(async () => {
  await store.dispatch('loadThemeFromLocalStorage')

  try {
    const response = await axios.get('/user')
    username.value = response.data.username
  } catch (error) {
    console.error('Failed to fetch user details', error)
  }
  await fetchTravelPosts()
  await fetchCities()
  await fetchCountries()
  await fetchActivities()
})

const handleDeletePost = async (postId, userOfPost) => {
  try {
    const response = await axios.delete(`/travelposts/${postId}`, { username, userOfPost })

    /*if (response.status === 204) {
      console.log("Post deleted successfully");
    }*/
    travelPosts.value = travelPosts.value.filter((post) => post.id !== postId)
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

const handleViewMore = async (postId) => {
  router.get(`/travelposts/${postId}`, { id: postId, edit: false })
}
</script>

<template>
  <Head title="Travel Map - My Travels" />
  <Nav />

  <div class="app__container" :style="themeStyle">
    <div class="container">
      <div v-if="travelPosts.length === 0" class="my-travels__background mb2">
        No travel posts found. Why not to plan an adventure ? :)
      </div>

      <div>
        <div class="my-travels__header">
          <a href="/addtravel" class="btn btn--add-travel">Add New Travel</a>
        </div>

        <div>
          <ul class="mtb3">
            <TravelPost
              v-for="post in travelPosts"
              :key="post.id"
              :post="post"
              viewMode="edit"
              :countries="countries"
              :cities="cities"
              :activities="activities"
              class="mtb10"
              @post-deleted="refreshPage"
              @edit-post="handleEditPost(post.id)"
              @delete-post="handleDeletePost(post.id)"
              @view-more="handleViewMore(post.id, post.username)"
            />
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.my-travels__header {
  justify-self: center;
}

.btn--add-travel {
  font-style: unset;
  box-sizing: content-box;
  background: v-bind(themeStyle.accent);
  border-color: v-bind(themeStyle.accent);
  color: v-bind(themeStyle.backgroundColor);
  box-shadow: 0 2px 16px v-bind(themeStyle.secondary);
  font-size: 20px;
  align-items: center;
}

.btn--add-travel:hover {
  border-width: 2px;
  margin: 8px;

  background: v-bind(themeStyle.accent);
  color: v-bind(themeStyle.backgroundColor);
  box-shadow: 0 2px 16px v-bind(themeStyle.accent);
}

ul {
  list-style-type: none;
  padding: 0;
}

.my-travels__background {
  background: v-bind(themeStyle.backgroundColor);
  border-radius: 32px;
  padding: 20px;

  box-shadow: 0 0 10px v-bind(themeStyle.secondary);

  text-align: center;
  width: 100%;
}
</style>
