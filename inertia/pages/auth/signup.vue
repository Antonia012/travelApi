<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { ref, onMounted, computed } from 'vue'
import store from '~/css/themeStore'
import axios from 'axios'
import Layout from '~/pages/components/layout.vue'

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle)

// Load theme from localStorage on component mount
onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
})

// Form data refs
const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// Registration function
const register = async () => {
  errorMessage.value = ''
  try {
    const response = await axios.post('/signup', {
      username: username.value,
      email: email.value,
      password: password.value,
    })

    console.log(password.value)

    console.log('Registration successful', response.data)

    await router.get('/login')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Registration failed'
    console.error('Registration failed', error)
  }
}
</script>

<template>
  <Layout>
    <Head title="Travel Map - Sign Up" />
    <div :style="themeStyle">
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

          <div class="signup-ftr-container pos-right">
            <!--          <button-->
            <!--            type="button"-->
            <!--            class="btn btn&#45;&#45;cancel"-->
            <!--            :style="{ backgroundColor: themeStyle.secondary }"-->
            <!--          >-->
            <!--            Cancel-->
            <!--          </button>-->
            <span class="psw">Forgot <a href="#">password?</a></span>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.signup__section {
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

.signup-ftr-container {
  margin-top: 16px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.btn--submit {
  border-color: v-bind(themeStyle.secondary);
  color: v-bind(themeStyle.color);
}

.signup__item {
  margin: 1rem auto;
}
</style>
