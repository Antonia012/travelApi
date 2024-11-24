<script setup lang="ts">
import { computed, defineProps, onMounted } from "vue";
import store from "~/css/themeStore";
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
  color: v-bind(themeStyle.color);
  box-shadow: 0 3px 5px v-bind(themeStyle.secondary);

}

.btn--travel-post:hover{
  box-shadow: 0 3px 5px v-bind(themeStyle.primary);
}
</style>
