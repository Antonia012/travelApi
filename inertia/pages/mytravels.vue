<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { Head, router } from '@inertiajs/vue3'
import Nav from './components/nav.vue'
import TravelPost from './components/post.vue' // Import the new component
import axios from 'axios'
import store from '~/css/themeStore'

const travelPosts = ref([])
const cities = ref([])
const countries = ref([])
const activities = ref([])
const username = ref('')

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)
// Function to fetch travel posts from the server
const fetchTravelPosts = async () => {
  try {
    console.log('userName', username.value)
    const response = await axios.get(`/travelposts/user/${username.value}`, { params: { id: username.value} })
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

function refreshPage() {
  router.reload()
}

const handleEditPost = async (postId) => {
  // Navigate to a new page with the post data passed as route state
  console.log('Editing post:', postId)
  router.get(`/travelposts/${postId}`, { id: postId, edit: true} )
};

// Fetch travel posts when the component is mounted
onMounted(async () => {
  store.dispatch('loadThemeFromLocalStorage')

  try {
    const response = await axios.get('/user')
    username.value = response.data.username
    console.log('sdfsdf', username.value)
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
    // Sending DELETE request using axios.delete without the 'method' field
    const response = await axios.delete(`/travelposts/${postId}`, {username, userOfPost});

    if (response.status === 204) {
      // Successfully deleted
      console.log("Post deleted successfully");
      // You can remove the post from the UI or trigger a refresh
      // this.$emit("post-deleted", true); // Optional: Emit an event to notify the parent component
    }
    travelPosts.value = travelPosts.value.filter((post) => post.id !== postId);

  } catch (error) {
    console.error("Error deleting post:", error);
    // Handle the error (display a message or show a toast notification)
  }
};

const handleViewMore = async (postId) => {
  // Navigate to a new page with the post data passed as route state
  console.log('Viewing post:', postId)
  router.get(`/travelposts/${postId}`, { id: postId, edit: false} )
};
</script>

<template>
  <Head title="Travel Map - My Travels" />
  <Nav />

  <div class="app__container" :style="themeStyle">
    <div class="container">
      <div class="my-travels__header">
        <a href="/addtravel" class="btn btn--add-travel">Add New Travel</a>
      </div>

      <div>
        <ul class="mtb3" >
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

      <div v-if="travelPosts.length === 0">
        <p>No travel posts available. Please add some!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-travels__header {
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
}

.btn--add-travel {
  font-style: unset;
  box-sizing: content-box;
  background: v-bind(themeStyle.backgroundColor);
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

</style>
