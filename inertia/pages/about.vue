<script setup>
import { computed, onMounted } from 'vue'
import { Head } from '@inertiajs/vue3'
import Nav from '~/pages/components/layout.vue'
import store from '~/css/themeStore'
import Layout from "~/pages/components/layout.vue";

const themeStyle = computed(() => store.getters.themeStyle)

onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
})
</script>

<template>
  <Head title="Travel App - About" />
  <Layout>
    <div class="app__container" :style="themeStyle">
      <div class="container">
        <div class="about__section">
          <div class="about__background">
            <div class="container__title">About This Project</div>
            <p>
              This is a student project designed for travel enthusiasts to share their experiences
              and inspire others. The main goal is to create a platform where people can post their
              travel adventures and plan future trips.
            </p>

            <br />
            <br />

            <div class="container__subtitle pos-center">Features</div>
            <div class="pos-center">
              Each travel post serves as a detailed record of your journey, including:
            </div>
          </div>

          <br />

          <div class="about__row">
            <div class="about__column">
              <div class="about__travel-box">
                <h3>Name of Travel</h3>
                <p>The place you visited, marking the destination of your adventure.</p>
              </div>
            </div>
            <div class="about__column">
              <div class="about__travel-box">
                <h3>About Your Travel</h3>
                <p>A paragraph describing your travel experience and memories.</p>
              </div>
            </div>
            <div class="about__column">
              <div class="about__travel-box">
                <h3>Countries</h3>
                <p>A list of the countries you've visited during your trip.</p>
              </div>
            </div>
            <div class="about__column">
              <div class="about__travel-box">
                <h3>Cities</h3>
                <p>A list of cities you explored during your travels.</p>
              </div>
            </div>
            <div class="about__column">
              <div class="about__travel-box">
                <h3>Activities</h3>
                <p>A list of activities you planned or experienced during your trip.</p>
              </div>
            </div>
            <div class="about__column">
              <div class="about__travel-box">
                <h3>Planned Places</h3>
                <p>
                  A feature where you can list places you plan to visit, and once visited, mark them
                  as completed, allowing you to keep track of both future travels and past
                  adventures in one place.
                </p>
              </div>
            </div>
          </div>

          <br />

          <div class="about__background">
            <div class="container__subtitle">Join Our Community!</div>
            <p class="mb2">
              Share your stories, get inspired by fellow travelers, and make your travel plans more
              exciting and organized. Together, we can explore the world one post at a time!
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.about__section {
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;

  text-align: center;
}

.about__background {
  background: v-bind(themeStyle.backgroundColor);
  border-radius: 32px;
  padding: 30px;

  box-shadow: 0 0 10px v-bind(themeStyle.secondary);
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}

.about__row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 50px;
  margin-bottom: 50px;
}

.about__column {
  flex: 1 1 25%;
  padding: 0 8px;
  box-sizing: border-box;
}

.about__travel-box {
  background-color: v-bind(themeStyle.backgroundColor);
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 20px v-bind(themeStyle.secondary);
  transition: 0.3s;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  min-width: 200px;
}

.about__travel-box h3,
.about__travel-box p {
  margin: 0;
  padding: 0;
}

.about__travel-box h3 {
  font-size: 18px;
  color: v-bind(themeStyle.color);
  margin-bottom: 10px;
}

.about__travel-box p {
  font-size: 14px;
  color: v-bind(themeStyle.color);
  flex-grow: 1;
}

.about__travel-box:hover {
  box-shadow: 0 8px 16px v-bind(themeStyle.primary);
  transform: scale(1.05);
}
</style>
