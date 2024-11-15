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
  <div class="travel-post">
    <div :style="{ borderColor: themeStyle.primary }">
      <div class="travel-post__title">{{ post?.title }}</div>
      <p class="travel-post__paragraph"><b>About:</b> {{ post?.about }}</p>
      <p class="travel-post__paragraph"><b>Countries:</b> {{ post?.countries?.map((country) => country.name).join(', ') }}</p>
      <p class="travel-post__paragraph"><b>Cities:</b> {{ post?.cities?.map((city) => city.name).join(', ') }}</p>
      <p class="travel-post__paragraph"><b>Activities:</b> {{ post?.activities?.map((activity) => activity.name).join(', ') }}</p>

      <p class="travel-post__paragraph"><b>Todo List:</b></p>
      <ul v-if="post?.todoItems?.length > 0">
        <li v-for="(item, index) in post.todoItems" :key="index">
          <input type="checkbox" :checked="post.checkedItems[index]" disabled />
          {{ item }}
        </li>
      </ul>
      <p v-else>No items in the todo list.</p>

      <div>
        <button class="btn" v-if="viewMode === 'edit'" @click="editPost">Edit</button>
        <button class="btn" v-if="viewMode === 'edit'" @click="deletePost">Delete</button>
        <button class="btn" v-if="viewMode === 'view'" @click="viewMore">View More</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.travel-post {
  border: 2px solid v-bind(themeStyle.primary);
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
}

.travel-post__title{
  font-size: 20px;
  margin: 1rem auto 1rem;
  text-align: center;
}

.travel-post__paragraph{
  margin: 0.5rem 0;
}
</style>
