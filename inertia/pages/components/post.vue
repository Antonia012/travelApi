<script setup lang="ts">
import { computed, defineProps, onMounted } from "vue";
import store from "~/css/themeStore";
import axios from "axios";
import { router } from "@inertiajs/vue3";
import { DateTime } from "luxon";
import { format } from "date-fns";

const themeStyle = computed(() => store.getters.themeStyle);

let response;

const props = defineProps<{
  post: {
    id: number
    title: string
    created: DateTime
    about: string
    countries: { id: number }[]
    cities: { id: number }[]
    activities: { id: number }[]
    todoItems: string[]
    checkedItems: boolean[]
  } | null
  viewMode: "edit" | "view" // New prop for view mode
  countries: { id: number; name: string }[]
  cities: { id: number; name: string }[]
  activities: { id: number; name: string }[]
}>();


const getNameFromIds = (ids: [], dataArray: { id: number; name: string }[]) => {
  return ids
    .map((idObj) => {
      const item = dataArray.find((data) => data.id === idObj);
      return item ? item.name : null;
    })
    .filter((name) => name !== null);
};

function formatDate(dateString) {
  return format(new Date(dateString), "dd MMM yyyy");
}


// Load the theme from localStorage when the component is mounted
onMounted(() => {
  store.dispatch("loadThemeFromLocalStorage");
});
</script>

<template>
  <div class="travel-post">
    <div class="travel-post__header">
      <div class="travel-post__title">{{ post?.title }}</div>
      <div class="travel-post__header-right">
        <div class="travel-post__username" v-if="viewMode === 'view'">{{ post?.username }}</div>
        <div class="travel-post__date">{{ formatDate(post.created) }}</div>
      </div>
    </div>
    <p class="travel-post__paragraph"><b>About:</b> {{ post?.about }}</p>
    <p class="travel-post__paragraph">
      <b>Countries:</b>
      {{ getNameFromIds(post?.countries || [], countries).join(', ') || 'No countries' }}
    </p>
    <p class="travel-post__paragraph">
      <b>Cities:</b> {{ getNameFromIds(post?.cities || [], cities).join(', ') || 'No cities' }}
    </p>
    <p class="travel-post__paragraph">
      <b>Activities:</b>
      {{ getNameFromIds(post?.activities || [], activities).join(', ') || 'No activities' }}
    </p>

    <!--<div class="travel-post__todo">
      <p class="travel-post__paragraph"><b>Todo List:</b></p>
      <ul v-if="post?.todoItems?.length > 0">
        <li v-for="(item, index) in post.todoItems" :key="index">
          <div class="todo-item">
            <input
              class="travel-post__checkbox"
              type="checkbox"
              :checked="post.checkedItems[index]"
              disabled
            />
            {{ item }}
          </div>
        </li>
      </ul>
      <p v-else>No items in the todo list.</p>
    </div>-->

    <div class="pos-right">
      <div class="travel-post__buttons">
        <button class="btn btn--travel-post" v-if="viewMode === 'edit'" @click="$emit('editPost')">
          Edit
        </button>
        <button
          class="btn btn--travel-post"
          v-if="viewMode === 'edit'"
          @click="$emit('deletePost')"
        >
          Delete
        </button>
        <button class="btn btn--travel-post" @click="$emit('viewMore')">
          View More
        </button>
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

.travel-post__buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.btn--travel-post {
  background: v-bind(themeStyle.backgroundColor);
  border-color: v-bind(themeStyle.secondary);
  color: v-bind(themeStyle.color);
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
</style>
