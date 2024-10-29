<script setup lang="ts">
import { computed, defineProps, onMounted } from 'vue'
import themeStore from '~/css/themeStore'
import store from '~/css/themeStore'

const themeStyle = computed(() => store.getters.themeStyle)

const props = defineProps<{
  post: {
    id: number
    title: string
    about: string
    countries: { name: string }[]
    cities: { name: string }[]
    activities: { name: string }[]
    todoItems: string[]
    checkedItems: boolean[]
  } | null
  viewMode: 'edit' | 'view' // New prop for view mode
}>()

// Load the theme from localStorage when the component is mounted
onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
})
</script>

<template>
  <li :style="{ borderColor: themeStyle.primary }">
    <h2>{{ post?.title }}</h2>
    <p>About: {{ post?.about }}</p>
    <p>Countries: {{ post?.countries?.map((country) => country.name).join(', ') }}</p>
    <p>Cities: {{ post?.cities?.map((city) => city.name).join(', ') }}</p>
    <p>Activities: {{ post?.activities?.map((activity) => activity.name).join(', ') }}</p>

    <h3>Todo List:</h3>
    <ul v-if="post?.todoItems?.length > 0">
      <li v-for="(item, index) in post.todoItems" :key="index">
        <input type="checkbox" :checked="post.checkedItems[index]" disabled />
        {{ item }}
      </li>
    </ul>
    <p v-else>No items in the todo list.</p>

    <div>
      <button v-if="viewMode === 'edit'" @click="editPost">Edit</button>
      <button v-if="viewMode === 'edit'" @click="deletePost">Delete</button>
      <button v-if="viewMode === 'view'" @click="viewMore">View More</button>
    </div>
  </li>
</template>

<style scoped>
li {
  border: 1px solid;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
}
</style>
