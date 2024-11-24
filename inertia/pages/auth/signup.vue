<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { ref, onMounted, computed } from 'vue'
import Nav from '~/pages/components/nav.vue'
import store from '~/css/themeStore'
import axios from 'axios'

const themeStyle = computed(() => store.getters.themeStyle)

onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
})

const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const userId = ref('')

onMounted( async () =>{
  try {
    const response = await axios.get('/user/count');
    const maxId = response.data.maxId || 0;
    userId.value = maxId + 1;
  } catch (error) {
    console.error('Error fetching max ID:', error);
  }
})

const register = async () => {
  errorMessage.value = ''
  try {
    await axios.post('/signup', {
      id: userId.value,
      username: username.value,
      email: email.value,
      password: password.value,
    })

    await router.get('/login')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Registration failed'
    console.error('Registration failed', error)
  }
}
</script>

<template>
  <Head title="Travel Map - Sign Up" />
  <Nav />

  <div class="app__container" :style="themeStyle">
    <div class="container">
      <form class="signup__section" @submit.prevent="register" method="post">
        <div class="container__subtitle">Sign Up Form</div>

        <div class="p16">
          <div class="signup__item">
            <label for="uname"><b>Username</b></label>
            <input
              :style="{ background: themeStyle.backgroundColor }"
              type="text"
              placeholder="Enter Username"
              v-model="username"
              required
            />
          </div>

          <div class="signup__item">
            <label for="email"><b>Email</b></label>
            <input
              :style="{ background: themeStyle.backgroundColor }"
              type="email"
              placeholder="Enter Email"
              v-model="email"
              required
            />
          </div>

          <div class="signup__item">
            <label for="psw"><b>Password</b></label>
            <input
              :style="{ background: themeStyle.backgroundColor }"
              type="password"
              placeholder="Enter Password"
              v-model="password"
              required
            />
          </div>

          <div class="pos-center">
            <button type="submit" class="btn btn--submit">Sign Up</button>
          </div>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.signup__section {
  background: v-bind(themeStyle.backgroundColor);

  justify-self: center;
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

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.btn--submit {
  color: v-bind(themeStyle.color);
  box-shadow: 0 3px 5px v-bind(themeStyle.secondary);
}

.btn--submit:hover {
  box-shadow: 0 3px 5px v-bind(themeStyle.primary);

}

.signup__item {
  margin: 1rem auto;
}
</style>
