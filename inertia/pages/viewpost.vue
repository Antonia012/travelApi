<template>
  <div v-if="travelPost">
    <h1>{{ travelPost.title }}</h1>
    <p>{{ travelPost.description }}</p>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
import { usePage } from '@inertiajs/vue3';

export default {
  setup() {
    const { travelPost } = usePage().props; // Access the travel post data passed by Inertia

    const goBack = () => {
      history.back(); // Navigate back to the previous page
    };

    return {
      travelPost,
      goBack,
    };
  },
};
</script>
