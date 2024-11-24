<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import Nav from './components/nav.vue'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import store from '~/css/themeStore'

const userName = ref('')
let getNewPostId = ref('')

const title = ref('')
const about = ref('')

const countries = ref<any[]>([])
const selectedCountries = ref<any[]>([])
const countryInput = ref('')

const cities = ref<any[]>([])
const selectedCities = ref<any[]>([])
const cityInput = ref('')

const activities = ref<any[]>([])
const selectedActivities = ref<any[]>([])
const activityInput = ref('')

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

const fetchCountries = async () => {
  try {
    const response = await axios.get('/countries')
    countries.value = response.data
  } catch (error) {
    console.error('Error fetching countries:', error)
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

const fetchActivities = async () => {
  try {
    const response = await axios.get('/activities')
    activities.value = response.data
  } catch (error) {
    console.error('Error fetching activities:', error)
  }
}

onMounted(async () => {
  await fetchCountries()
  await fetchCities()
  await fetchActivities()

  await store.dispatch('loadThemeFromLocalStorage')

  try {
    const response = await axios.get('/user')
    userName.value = response.data.username
  } catch (error) {
    console.error('Failed to fetch user details', error)
  }

  try {
    const response = await axios.get('/travelposts/count')
    const maxId = response.data.maxId || 0
    getNewPostId = maxId + 1
  } catch (error) {
    console.error('Error fetching max ID:', error)
  }
})

const filteredCountries = computed(() => {
  return countries.value.filter((country) =>
    country.name.toLowerCase().includes(countryInput.value.toLowerCase())
  )
})

const filteredCities = computed(() => {
  return cities.value.filter((city) =>
    city.name.toLowerCase().includes(cityInput.value.toLowerCase())
  )
})

const filteredActivities = computed(() => {
  return activities.value.filter((activity) =>
    activity.name.toLowerCase().includes(activityInput.value.toLowerCase())
  )
})

const addCountry = (country) => {
  if (
    country &&
    !selectedCountries.value.some((c) => c.countryId === country.countryId) &&
    filteredCountries.value.includes(country)
  ) {
    selectedCountries.value.push(country)
    countryInput.value = ''
  }
}

const addCity = (city) => {
  if (
    city &&
    !selectedCities.value.some((c) => c.cityId === city.cityId) &&
    filteredCities.value.includes(city)
  ) {
    selectedCities.value.push(city)
    cityInput.value = ''
  }
}

const addActivity = (activity) => {
  if (
    activity &&
    !selectedActivities.value.some((a) => a.activityId === activity.activityId) &&
    filteredActivities.value.includes(activity)
  ) {
    selectedActivities.value.push(activity)
    activityInput.value = ''
  }
}

const removeCountry = (index: number) => {
  selectedCountries.value.splice(index, 1)
}

const removeCity = (index: number) => {
  selectedCities.value.splice(index, 1)
}

const removeActivity = (index: number) => {
  selectedActivities.value.splice(index, 1)
}

function goBack() {
  history.back()
}

const submitForm = async () => {
  console.log('Submit Form Called')

  const countryIds = selectedCountries.value.map((country) => country.countryId)
  const cityIds = selectedCities.value.map((city) => city.cityId)
  const activityIds = selectedActivities.value.map((activity) => activity.activityId)

  const todoItems = todos.value.map((todo) => todo.task)
  const checkedItems = todos.value.map((todo) => todo.completed)

  try {
    const response = await axios.post('/travelposts', {
      id: getNewPostId,
      username: userName.value,
      title: title.value,
      countries: countryIds,
      cities: cityIds,
      activities: activityIds,
      about: about.value,
      todoItems: todoItems,
      checkedItems: checkedItems,
      created: new Date().toISOString(),
    })

    await router.get('/mytravels')
  } catch (error) {
    console.error('Error saving travel post:', error)
  }
}
</script>

<template>
  <Head title="Travel Map - Add Travel" />
  <Nav />

  <div class="app__container" :style="themeStyle">
    <div class="container">
      <form class="add-travel" @submit.prevent="submitForm">
        <div class="container__title">Plan new travel</div>

        <div class="add-travel__section">
          <div class="container__subtitle">
            <label for="title"><b>Title</b></label>
          </div>
          <div class="add-travel__input">
            <input type="text" v-model="title" placeholder="Enter Title" name="title" required />
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__subtitle">
            <label for="about"><b>About</b></label>
          </div>
          <div class="add-travel__input">
            <input type="text" v-model="about" placeholder="Enter About Trip" name="about" />
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__subtitle">
            <label for="countries"><b>Countries</b></label>
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
                  v-for="country in filteredCountries"
                  :key="country.id"
                  @click="addCountry(country)"
                  class="add-travel__item"
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
                <button class="add-travel__item-button" @click="removeCountry(index)">x</button>
              </span>
            </div>
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__subtitle">
            <label for="cities"><b>Cities</b></label>
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
                  v-for="city in filteredCities"
                  :key="city.id"
                  @click="addCity(city)"
                  class="add-travel__item"
                >
                  {{ city.name }}
                </li>
              </ul>
            </div>
            <div class="selected-cities">
              <span v-for="(city, index) in selectedCities" :key="city.id" class="add-travel__item">
                {{ city.name }}
                <button class="add-travel__item-button" @click="removeCity(index)">x</button>
              </span>
            </div>
          </div>
        </div>

        <div class="add-travel__section">
          <div class="container__subtitle">
            <label for="activities"><b>Activities</b></label>
          </div>
          <div class="add-travel__input">
            <input
              type="text"
              v-model="activityInput"
              placeholder="Enter Activity"
              @keydown.enter.prevent="addActivity({ id: null, name: activityInput })"
            />
            <div
              class="add-travel__suggestion"
              v-if="activityInput && filteredActivities.length > 0"
            >
              <ul>
                <li
                  v-for="activity in filteredActivities"
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
          <div class="container__subtitle">
            <label for="todo"><b>Places to visit</b></label>
          </div>
          <div class="add-travel__input">
            <input
              v-model="newTask"
              @keydown.enter.prevent="addTodo"
              placeholder="Add a new one"
            />
            <ul>
              <li v-for="(todo, index) in todos" :key="index" class="todo-list-item">
                <button class="btn--add-todo" @click.prevent="insertTodo(index)">+</button>
                <div class="todo-item">
                  <input class="add-travel__checkbox" type="checkbox" v-model="todo.completed" />
                  <span>{{ todo.task }}</span>
                </div>
                <button class="btn btn--delete" @click.prevent="deleteTodo(index)">Delete</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="add-travel__ftr">
          <div>
            <button type="button" class="btn btn--delete" @click="goBack">Cancel travel</button>
          </div>
          <div>
            <button type="submit" class="btn btn--submit">Add travel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.add-travel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  background: v-bind(themeStyle.backgroundColor);
  border: 0 solid v-bind(themeStyle.color);
  box-shadow: 0 0 41px v-bind(themeStyle.color);

  border-radius: 32px;
  padding: 30px;
  margin: 20px 20px 50px;
}

input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 2px solid v-bind(themeStyle.secondary);
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
  justify-content: space-evenly;
  width: 100%;
  margin-top: 16px;
}

.selected-countries,
.selected-cities,
.selected-activities {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
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
  flex-direction: row;
  align-items: center;
  padding: 8px;
}

.add-travel__item:hover {
  background-color: #f0f0f0;
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
  width: 100%;
  border: 2px solid v-bind(themeStyle.secondary);
  border-radius: 16px;
  background-color: v-bind(themeStyle.backgroundColor);
  margin-top: 20px;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

.todo-list-item {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: left;
  margin: 5px 0;
}

.todo-item {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-grow: 1;
}

.add-travel__checkbox {
  width: 20px;
  height: 20px;
  transform: scale(1.5);
  border: 2px solid v-bind(themeStyle.accent);
  border-radius: 5px;
  appearance: none;
  background-color: v-bind(themeStyle.backgroundColor);
  cursor: pointer;
  outline: none;
  padding: 0;
  margin: 10px;
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

.btn--add-todo {
  border: 2px solid v-bind(themeStyle.secondary);
  color: v-bind(themeStyle.color);
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

.btn--add-todo:hover {
  color:v-bind(themeStyle.primary);
  border-color:v-bind(themeStyle.primary);
}

.btn--delete {
  color: v-bind(themeStyle.warning);
  box-shadow: 0 3px 5px v-bind(themeStyle.secondary);
}

.btn--delete:hover {
  box-shadow: 0 3px 5px v-bind(themeStyle.warning);
}

.btn--submit {
  color: v-bind(themeStyle.primary);
  box-shadow: 0 3px 5px v-bind(themeStyle.secondary);
}

.btn--submit:hover {
  box-shadow: 0 3px 5px v-bind(themeStyle.primary);
}
</style>
