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

  <body :style="themeStyle">
    <div class="container">
      <form class="add-travel" @submit.prevent="submitForm">
        <div class="container__header">Plan new travel</div>

        <div class="add-travel__section">
          <div class="container__title">
            <label for="title"><b>Title</b></label>
          </div>
          <div class="add-travel__input">
            <input type="text" v-model="title" placeholder="Enter Title" name="title" required />
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__title">
            <label for="about"><b>About</b></label>
          </div>
          <div class="add-travel__input">
            <input type="text" v-model="about" placeholder="Enter About Trip" name="about" />
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__title">
            <label for="countries"><b>Visited Countries</b></label>
          </div>
          <div class="add-travel__input">
            <input
              type="text"
              v-model="countryInput"
              placeholder="Enter Country"
              @keydown.enter.prevent="addCountry({ id: null, name: countryInput })"
            />
            <div class="add-travel__suggestion" v-if="countryInput && filteredCountries.length > 0">
              <ul>
                <li
                  v-for="(country) in filteredCountries"
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
                class="add-travel__item"
              >
                {{ country.name }}
                <button class="add-travel__item-button"  @click="removeCountry(index)">x</button>
              </span>
            </div>
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__title">
            <label for="cities"><b>Visited Cities</b></label>
          </div>
          <div class="add-travel__input">
            <input
              type="text"
              v-model="cityInput"
              placeholder="Enter City"
              @keydown.enter.prevent="addCity({ id: null, name: cityInput })"
            />
            <div class="add-travel__suggestion" v-if="cityInput && filteredCities.length > 0">
              <ul>
                <li
                  v-for="(city) in filteredCities"
                  :key="city.id"
                  @click="addCity(city)"
                  class="add-travel__item"
                >
                  {{ city.name }}
                </li>
              </ul>
            </div>
            <div class="selected-cities">
              <span v-for="(city, index) in selectedCities" :key="city.id" class="city-item">
                {{ city.name }}
                <button class="add-travel__item-button"  @click="removeCity(index)">x</button>
              </span>
            </div>
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__title">
            <label for="activities"><b>Activities</b></label>
          </div>
          <div class="add-travel__input">
            <input
              type="text"
              v-model="activityInput"
              placeholder="Enter Activity"
              @keydown.enter.prevent="addActivity({ id: null, name: activityInput })"
            />
            <div class="add-travel__suggestion" v-if="activityInput && filteredActivities.length > 0">
              <ul>
                <li
                  v-for="(activity) in filteredActivities"
                  :key="activity.id"
                  @click="addActivity(activity)"
                  class="add-travel__item"
                >
                  {{ activity.name }}
                </li>
              </ul>
            </div>
            <div class="selected-activities">
              <span
                v-for="(activity, index) in selectedActivities"
                :key="activity.id"
                class="add-travel__item"
              >
                {{ activity.name }}
                <button class="add-travel__item-button" @click="removeActivity(index)">x</button>
              </span>
            </div>
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__title">
            <label for="todo"><b>Todo List</b></label>
          </div>
          <div class="add-travel__input">
            <input
              v-model="newTask"
              @keydown.enter.prevent="addTodo"
              placeholder="Add a new task"
            />
            <ul>
              <li v-for="(todo, index) in todos" :key="index" class="todo-list-item">
                <button class="add-travel__btn--add-todo" @click.prevent="insertTodo(index)">+</button>
                <div class="todo-item">
                  <input class="add-travel__checkbox" type="checkbox" v-model="todo.completed" />
                  <span>{{ todo.task }}</span>
                </div>
                <button class="add-travel__btn add-travel__btn--delete" @click.prevent="deleteTodo(index)">Delete</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="add-travel__ftr">
          <button type="button" class="add-travel__btn add-travel__btn--delete">
            Cancel
          </button>
          <button type="submit" class="add-travel__btn add-travel__btn--submit">
            Add travel
          </button>
        </div>
      </form>
    </div>
  </body>
</template>

<style scoped>
.add-travel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  border: 2px solid v-bind(themeStyle.accent);
  box-shadow:
    0 2px 16px v-bind(themeStyle.accent),
    0 0 0 2px v-bind(themeStyle.accent);

  border-radius: 32px;
  padding: 30px;
}

input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 2px solid v-bind(themeStyle.primary);
  box-sizing: border-box;
  border-radius: 16px;
  background: v-bind(themeStyle.backgroundColor);
}

.add-travel__section {
  width: 100%;
  padding: 16px;
}

.add-travel__input {
  display: flex;
  flex-direction: column;
  position: relative;
}
.add-travel__ftr {
  display: flex;
  justify-content: right;
  width: 100%;
  margin-top: 16px;
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
  padding: 5px;
  margin: 5px;
  border-radius: 4px;
}

.add-travel__item {
  display: flex;
  align-items: center;
  margin: 5px;
}

.add-travel__item-button {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: 5px;
  color: v-bind(themeStyle.warning);
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  padding: 0;
}

.add-travel__suggestion {
  position: absolute;
  z-index: 10;
  width: 100%;
  border: 2px solid v-bind(themeStyle.accent);
  border-radius: 16px;
  background-color: v-bind(themeStyle.backgroundColor);
  margin-top: 70px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 8px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

ul {
  list-style-type: none;
  padding: 0;
}

.todo-list-item {
  display: flex;
  gap:10px;
  align-items: center;
  justify-content: left;
  margin: 5px 0;
}

.todo-item {
  display: flex;
  gap:10px;
  align-items: center;
  flex-grow: 1;
}

.add-travel__checkbox {
  width: 30px;
  height: 30px;
  transform: scale(1.5);
  border: 2px solid v-bind(themeStyle.accent);
  border-radius: 5px;
  appearance: none;
  background-color: v-bind(themeStyle.backgroundColor);
  cursor: pointer;
  outline: none;
  padding:0;
  margin: 20px 10px;
}

.add-travel__checkbox:checked {
  background-color: v-bind(themeStyle.backgroundColor);
  border-color: v-bind(themeStyle.accent);
  position: relative;
}

.add-travel__checkbox:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 10px;
  border: solid v-bind(themeStyle.accent);
  border-width: 0 3px 3px 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

.add-travel__btn {
  border: 2px solid v-bind(themeStyle.color);
  color:  v-bind(themeStyle.color);
  padding: 14px 20px;
  margin: 8px;
  cursor: pointer;
  border-radius: 16px;
}


.add-travel__btn--add-todo {
  border: 2px solid v-bind(themeStyle.primary);
  color: v-bind(themeStyle.primary);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.add-travel__btn--delete{
  border-color: v-bind(themeStyle.warning);
  color: v-bind(themeStyle.warning);

}

.add-travel__btn--submit {
  border-color: v-bind(themeStyle.primary);
  color: v-bind(themeStyle.primary);

}
</style>
