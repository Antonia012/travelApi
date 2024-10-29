<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
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
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      password: password.value,
    })

    console.log('Login successful', response.data)

    store.commit('setLoginStatus', true)

    localStorage.setItem('isLoggedIn', 'true')
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

  <div class="outer-login-container" :style="themeStyle">
    <form class="login-container" @submit.prevent="login" method="post">
      <h2>Log In Form</h2>

      <div class="login-container-data">
        <label for="uname"><b>Email</b></label>
        <input
          :style="{ background: themeStyle.backgroundColor }"
          type="text"
          v-model="email"
          placeholder="Enter Email"
          required
        />

        <label for="psw"><b>Password</b></label>
        <input
          :style="{ background: themeStyle.backgroundColor }"
          type="password"
          v-model="password"
          placeholder="Enter Password"
          required
        />

        <button type="submit" :style="{ backgroundColor: themeStyle.primary }">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <label>
          <input
            :style="{ background: themeStyle.backgroundColor }"
            type="checkbox"
            checked="checked"
            name="remember"
          />
          Remember me
        </label>
      </div>

      <div class="login-ftr-container">
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div>
    </form>
  </div>
</template>

<style scoped>
.outer-login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to start for better spacing */
  height: calc(100vh - 60px); /* Adjust based on nav bar height */
  padding-top: 20px; /* Optional padding */
}

.login-container {
  border: 1px solid #939090;
  padding: 30px;
  width: 100%; /* Full width */
  max-width: 400px; /* Maximum width */
  margin-top: 20px; /* Margin to ensure spacing below nav */
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.8;
}

.login-container-data {
  padding: 16px;
}

span.psw {
  float: right;
  padding-top: 16px;
}

/* Responsive adjustments */
@media screen and (max-width: 600px) {
  .outer-login-container {
    padding-top: 40px; /* Increase padding for smaller screens */
  }

  .login-container {
    margin-top: 40px; /* Increase margin for smaller screens */
  }
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.psw {
    display: block;
    float: none;
  }
  .cancelbtn {
    width: 100%;
  }
}
</style>
