<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { onMounted, computed, ref } from 'vue'
import Nav from '~/pages/components/nav.vue'
import store from '~/css/themeStore'
import axios from 'axios'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)

onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
})

const login = async () => {
  errorMessage.value = '' // Clear any previous error messages
  try {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    })

    console.log('Login successful', response.data)

    store.commit('setLoginStatus', true)

    localStorage.setItem('isLoggedIn', 'true')

    await router.get('/mytravels')

    // Optionally, redirect to another page or store user session
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Login failed'
    console.error('Login failed', error)
  }
}
</script>

<template>
  <Head title="Travel Map - Log In" />
  <Nav />

  <div class="app__container" :style="themeStyle">
    <div class="container">
      <form class="login__section" @submit.prevent="login" method="post">
        <div class="container__subtitle pos-center">Log In Form</div>

        <div class="p16">
          <div class="login__item">
            <label for="uname"><b>Email</b></label>
            <input
              :style="{ background: themeStyle.backgroundColor }"
              type="text"
              v-model="email"
              placeholder="Enter Email"
              required
            />
          </div>

          <div class="login__item">
            <label for="psw"><b>Password</b></label>
            <input
              :style="{ background: themeStyle.backgroundColor }"
              type="password"
              v-model="password"
              placeholder="Enter Password"
              required
            />
          </div>

          <div class="pos-center">
            <button type="submit" class="btn btn--login">Login</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </div>

          <!--        <label>-->
          <!--          <input-->
          <!--            :style="{ background: themeStyle.backgroundColor }"-->
          <!--            type="checkbox"-->
          <!--            checked="checked"-->
          <!--            name="remember"-->
          <!--          />-->
          <!--          Remember me-->
          <!--        </label>-->
        </div>

        <div class="login__ftr-container">
          <span class="psw">Forgot <a href="#">password?</a></span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login__section {
  justify-self: center;

  border: 1px solid v-bind(themeStyle.color);
  box-shadow: 0 2px 16px v-bind(themeStyle.color);
  border-radius: 32px;

  padding: 30px;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
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

.btn--login {
  background: v-bind(themeStyle.backgroundColor
  );
  border-color: v-bind(themeStyle.color);
  color: v-bind(themeStyle.color);
}

.login__item {
  margin: 1rem auto;
}

.login__ftr-container {
  justify-self: right;
}
</style>
