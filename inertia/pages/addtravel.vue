<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import Nav from './components/nav.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import store from '~/css/themeStore'

const title = ref('') // New ref for title
const about = ref('') // New ref for about

const countries = ref<any[]>([])
const selectedCountries = ref<any[]>([])
const countryInput = ref('')

const cities = ref<any[]>([])
const selectedCities = ref<any[]>([])
const cityInput = ref('')

const activities = ref<any[]>([])
const selectedActivities = ref<any[]>([])
const activityInput = ref('')

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)

const newTask = ref('')
const todos = ref([])
const addTodo = () => {
  if (newTask.value.trim()) {
    todos.value.push({ task: newTask.value, completed: false })
    newTask.value = ''
  }
}

const insertTodo = (index) => {
  if (newTask.value.trim()) {
    todos.value.splice(index + 1, 0, { task: newTask.value, completed: false })
    newTask.value = ''
  }
}

const deleteTodo = (index) => {
  todos.value.splice(index, 1)
}

// Fetch countries from the API
const fetchCountries = async () => {
  try {
    const response = await axios.get('/countries')
    countries.value = response.data
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

// Fetch cities from the API
const fetchCities = async () => {
  try {
    const response = await axios.get('/cities')
    cities.value = response.data
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
}

// Fetch activities from the API
const fetchActivities = async () => {
  try {
    const response = await axios.get('/activities')
    activities.value = response.data
  } catch (error) {
    console.error('Error fetching activities:', error)
  }
}

onMounted(() => {
  fetchCountries()
  fetchCities()
  fetchActivities()

  store.dispatch('loadThemeFromLocalStorage')
})

// Filter countries based on user input
const filteredCountries = computed(() => {
  return countries.value.filter((country) =>
    country.name.toLowerCase().includes(countryInput.value.toLowerCase())
  )
})

// Filter cities based on user input
const filteredCities = computed(() => {
  return cities.value.filter((city) =>
    city.name.toLowerCase().includes(cityInput.value.toLowerCase())
  )
})

// Filter activities based on user input
const filteredActivities = computed(() => {
  return activities.value.filter((activity) =>
    activity.name.toLowerCase().includes(activityInput.value.toLowerCase())
  )
})

// Add selected country
const addCountry = (country) => {
  // Check if the country is in the filtered list before adding
  if (
    country &&
    !selectedCountries.value.some((c) => c.id === country.id) &&
    filteredCountries.value.includes(country)
  ) {
    selectedCountries.value.push(country)
    countryInput.value = '' // Clear the input field after adding
  }
}

const addCity = (city) => {
  if (
    city &&
    !selectedCities.value.some((c) => c.id === city.id) &&
    filteredCities.value.includes(city)
  ) {
    selectedCities.value.push(city)
    cityInput.value = '' // Clear the input field after adding
  }
}

const addActivity = (activity) => {
  if (
    activity &&
    !selectedActivities.value.some((c) => c.id === activity.id) &&
    filteredActivities.value.includes(activity)
  ) {
    selectedActivities.value.push(activity)
    activityInput.value = '' // Clear the input field after adding
  }
}

// Remove selected country
const removeCountry = (index: number) => {
  selectedCountries.value.splice(index, 1)
}

// Remove selected city
const removeCity = (index: number) => {
  selectedCities.value.splice(index, 1)
}

// Remove selected activity
const removeActivity = (index: number) => {
  selectedActivities.value.splice(index, 1)
}

defineProps(['countries'])

const submitForm = async () => {
  console.log('Submit Form Called')

  // Extract IDs for countries, cities, and activities
  const countryIds = selectedCountries.value.map((country) => country.id)
  const cityIds = selectedCities.value.map((city) => city.id)
  const activityIds = selectedActivities.value.map((activity) => activity.id)

  // Create arrays for todo items and their completion status
  const todoItems = todos.value.map((todo) => todo.task) // Extract task text
  const checkedItems = todos.value.map((todo) => todo.completed) // Extract completion status

  try {
    // Fetch the count of travel posts
    const countResponse = await axios.get('/travelposts/count')
    const newId = countResponse.data.total > 0 ? Number(countResponse.data.total) + 1 : 1 // Ensure total is treated as a number

    // Make the POST request with the new ID and todo information
    const response = await axios.post('/travelposts', {
      id: newId,
      title: title.value,
      countries: countryIds,
      cities: cityIds,
      activities: activityIds,
      about: about.value,
      todoItems: todoItems, // Array of to-do item texts
      checkedItems: checkedItems, // Array of completion statuses
    })

    console.log('Travel post created:', response.data)
  } catch (error) {
    console.error('Error saving travel post:', error)
  }
}
</script>

<template>
  <Head title="Travel Map - Add Travel" />
  <Nav />

  <div class="outer-travel-container" :style="themeStyle">
    <form class="travel-container" @submit.prevent="submitForm">
      <h2>Plan new travel</h2>

      <div class="travel-container-data">
        <label for="title"><b>Title</b></label>
        <input
          :style="{ background: themeStyle.backgroundColor }"
          type="text"
          v-model="title"
          placeholder="Enter Title"
          name="title"
          required
        />
      </div>

      <div class="travel-container-data">
        <label for="about"><b>About</b></label>
        <input
          :style="{ background: themeStyle.backgroundColor }"
          type="text"
          v-model="about"
          placeholder="Enter About Trip"
          name="about"
        />
      </div>

      <div class="travel-container-data">
        <label for="countries"><b>Visited Countries</b></label>
        <div class="countries-input">
          <input
            :style="{ background: themeStyle.backgroundColor }"
            type="text"
            v-model="countryInput"
            placeholder="Enter Country"
            @keydown.enter.prevent="addCountry({ id: null, name: countryInput })"
          />
          <div class="suggestions" v-if="countryInput && filteredCountries.length > 0">
            <ul>
              <li
                v-for="(country, index) in filteredCountries"
                :key="country.id"
                @click="addCountry(country)"
                class="suggestion-item"
              >
                {{ country.name }}
              </li>
            </ul>
          </div>
          <div class="selected-countries">
            <span
              v-for="(country, index) in selectedCountries"
              :key="country.id"
              class="country-item"
            >
              {{ country.name }}
              <button @click="removeCountry(index)">x</button>
            </span>
          </div>
        </div>
      </div>

      <div class="travel-container-data">
        <label for="cities"><b>Visited Cities</b></label>
        <div class="cities-input">
          <input
            :style="{ background: themeStyle.backgroundColor }"
            type="text"
            v-model="cityInput"
            placeholder="Enter City"
            @keydown.enter.prevent="addCity({ id: null, name: cityInput })"
          />
          <div class="suggestions" v-if="cityInput && filteredCities.length > 0">
            <ul>
              <li
                v-for="(city, index) in filteredCities"
                :key="city.id"
                @click="addCity(city)"
                class="suggestion-item"
              >
                {{ city.name }}
              </li>
            </ul>
          </div>
          <div class="selected-cities">
            <span v-for="(city, index) in selectedCities" :key="city.id" class="city-item">
              {{ city.name }}
              <button @click="removeCity(index)">x</button>
            </span>
          </div>
        </div>
      </div>

      <div class="travel-container-data">
        <label for="activities"><b>Activities</b></label>
        <div class="activities-input">
          <input
            :style="{ background: themeStyle.backgroundColor }"
            type="text"
            v-model="activityInput"
            placeholder="Enter Activity"
            @keydown.enter.prevent="addActivity({ id: null, name: activityInput })"
          />
          <div class="suggestions" v-if="activityInput && filteredActivities.length > 0">
            <ul>
              <li
                v-for="(activity, index) in filteredActivities"
                :key="activity.id"
                @click="addActivity(activity)"
                class="suggestion-item"
              >
                {{ activity.name }}
              </li>
            </ul>
          </div>
          <div class="selected-activities">
            <span
              v-for="(activity, index) in selectedActivities"
              :key="activity.id"
              class="activity-item"
            >
              {{ activity.name }}
              <button @click="removeActivity(index)">x</button>
            </span>
          </div>
        </div>
      </div>

      <div class="travel-container-data">
        <label for="todo"><b>Todo List</b></label>
        <div class="todo-input">
          <input
            :style="{ background: themeStyle.backgroundColor }"
            v-model="newTask"
            @keydown.enter.prevent="addTodo"
            placeholder="Add a new task"
          />
          <ul>
            <li v-for="(todo, index) in todos" :key="index" class="todo-list-item">
              <button class="insert-button" @click.prevent="insertTodo(index)">+</button>
              <div class="todo-item">
                <input type="checkbox" v-model="todo.completed" />
                <span>{{ todo.task }}</span>
                <button class="delete" @click.prevent="deleteTodo(index)">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="travel-ftr-container">
        <button type="button" class="btn btn-cancel">Cancel</button>
        <button type="submit" class="btn btn-submit">Add travel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
input.active {
  border-color: blue; /* Highlight the active input */
}

.outer-travel-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding-top: 20px;
}

.travel-container {
  border: 1px solid #939090;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}

input[type='text'] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.btn {
  color: white;
  padding: 14px 20px;
  margin: 8px;
  border: none;
  cursor: pointer;
  width: 100%;
}

.btn-submit {
  background-color: #0f4c5c;
}

.btn-cancel {
  background-color: #9a031e;
}

button:hover {
  opacity: 0.8;
}

.travel-container-data {
  padding: 16px;
}

.travel-ftr-container {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.countries-input,
.cities-input,
.activities-input {
  display: flex;
  flex-direction: column;
  position: relative; /* Added for positioning suggestions */
}

.selected-countries,
.selected-cities,
.selected-activities {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
}

.selected-countries span,
.selected-cities span,
.selected-activities span {
  background-color: #e0e0e0;
  padding: 5px;
  margin: 5px;
  border-radius: 4px;
}

.city-item,
.country-item,
.activity-item {
  display: flex;
  align-items: center;
  margin: 5px;
}

.selected-countries button,
.selected-cities button,
.selected-activities button {
  margin-left: 5px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestions {
  position: absolute;
  z-index: 10;
  width: 100%;
  border: 1px solid #ccc;
  background-color: white;
  margin-top: 60px; /* Space to prevent overlap */
  overflow-y: auto; /* Enable scrolling if suggestions exceed height */
}

.suggestion-item {
  padding: 8px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.todo-input {
  position: relative; /* For positioning the button */
}

.todo-input {
  position: relative;
}

ul {
  list-style-type: none;
  padding: 0;
}

.todo-list-item {
  display: flex;
  align-items: center;
  margin: 5px 0; /* Add some vertical spacing */
}

.todo-item {
  display: flex;
  align-items: center;
  flex-grow: 1; /* Allows it to take the available space */
}

.insert-button {
  background-color: green;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px; /* Space from the todo item */
  transition: background-color 0.3s; /* Smooth transition for hover */
}

.insert-button:hover {
  background-color: darkgreen; /* Change color on hover */
}

button.delete {
  background-color: red;
  color: white;
  margin-left: 10px; /* Space between task and delete button */
}
</style>
