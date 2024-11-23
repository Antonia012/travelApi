<script setup lang="ts">
import { usePage, router } from '@inertiajs/vue3'
import Nav from '~/pages/components/nav.vue'
import store from '~/css/themeStore'
import { computed } from 'vue'
import { format } from 'date-fns'

const themeStyle = computed(() => store.getters.themeStyle)

const { travelPost } = usePage().props // Access the travel post data passed by Inertia

const getNamesFromIds = (ids: { id: number }[], dataArray: { id: number; name: string }[]) => {
  return ids
    .map((idObj) => {
      const item = dataArray.find((data) => data.id === idObj.id)
      return item ? item.name : null
    })
    .filter((name) => name !== null)
}

function formatDate(dateString) {
  return format(new Date(dateString), 'dd MMM yyyy')
}

const goBack = () => {
  router.get('/discover') // Navigate back to the previous page
}
</script>

<template>
  <Nav />
  <div v-if="travelPost" :style="themeStyle">
    <div class="app__container">
      <div class="container">
        <div class="travel-post">
          <div class="travel-post__header">
            <div class="travel-post__title">{{ travelPost?.title }}</div>
            <div class="travel-post__header-right">
              <div class="travel-post__username" v-if="viewMode === 'view'">
                {{ travelPost?.username }}
              </div>
              <div class="travel-post__date">{{ formatDate(travelPost.created) }}</div>
            </div>
          </div>
          <p class="travel-post__paragraph"><b>About:</b> {{ travelPost?.about }}</p>
          <p class="travel-post__paragraph">
            <b>Countries:</b>
            {{
              getNamesFromIds(travelPost?.countries || [], countries).join(', ') || 'No countries'
            }}
          </p>
          <p class="travel-post__paragraph">
            <b>Cities:</b>
            {{ getNamesFromIds(travelPost?.cities || [], cities).join(', ') || 'No cities' }}
          </p>
          <p class="travel-post__paragraph">
            <b>Activities:</b>
            {{
              getNamesFromIds(travelPost?.activities || [], activities).join(', ') ||
              'No activities'
            }}
          </p>

          <div class="travel-post__todo">
            <p class="travel-post__paragraph"><b>Todo List:</b></p>
            <ul v-if="travelPost?.todoItems?.length > 0">
              <li v-for="(item, index) in travelPost.todoItems" :key="index">
                <div class="todo-item">
                  <input
                    class="travel-post__checkbox"
                    type="checkbox"
                    :checked="travelPost.checkedItems[index]"
                    disabled
                  />
                  {{ item }}
                </div>
              </li>
            </ul>
            <p v-else>No items in the todo list.</p>
          </div>

          <button class="btn btn--viewpost" @click="goBack">Go back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.travel-post {
  background: v-bind(themeStyle.backgroundColor);
  display: flex;
  flex-direction: column;

  border: 0 solid v-bind(themeStyle.secondary);
  padding: 20px;
  border-radius: 24px;
  box-shadow: 19px 22px 41px v-bind(themeStyle.secondary);
}

.travel-post__header {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.travel-post__header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  margin-left: auto;
}

.travel-post__title {
  font-size: 20px;
  margin-left: 1rem;
}

.travel-post__paragraph {
  margin: 0.5rem 0;
}

.travel-post__todo {
  margin: 1rem 0;
}

.travel-post__checkbox {
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

.travel-post__checkbox:checked {
  background-color: v-bind(themeStyle.backgroundColor);
  border-color: v-bind(themeStyle.accent);
  position: relative;
}

.travel-post__checkbox:checked::after {
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

.todo-item {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-grow: 1;
}

.btn--viewpost{
  background: v-bind(themeStyle.backgroundColor);
  border-color: v-bind(themeStyle.secondary);
  color: v-bind(themeStyle.color);
}
</style>
