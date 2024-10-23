<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';
import Nav from '~/pages/components/nav.vue';
import store from '~/css/themeStore';
import axios from 'axios';

// Access the Vuex store for theme styles
const themeStyle = computed(() => store.getters.themeStyle);

// Load theme from localStorage on component mount
onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage');
});

// Form data refs
const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Registration function
const register = async () => {
  errorMessage.value = ''; // Clear any previous error messages
  try {
    const response = await axios.post('http://localhost:3000/signup', {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    console.log(password.value);

    console.log('Registration successful', response.data);
    // Optionally, redirect to login or another page
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Registration failed';
    console.error('Registration failed', error);
  }
};
</script>

<template>
  <Head title="Travel Map - Sign Up" />
  <Nav />

  <div class="outer-signup-container" :style="themeStyle">
    <form class="signup-container" @submit.prevent="register" method="post">
      <h2>Sign Up Form</h2>

      <!-- Form Fields -->
      <div class="signup-container-data">
        <label for="uname"><b>Username</b></label>
        <input
          :style="{ background: themeStyle.backgroundColor }"
          type="text"
          placeholder="Enter Username"
          v-model="username"
          required />

        <label for="email"><b>Email</b></label>
        <input
          :style="{ background: themeStyle.backgroundColor }"
          type="email"
          v-model="email"
          required />

        <label for="psw"><b>Password</b></label>
        <input
          :style="{ background: themeStyle.backgroundColor }"
          type="password"
          placeholder="Enter Password"
          v-model="password"
          required
        />

        <!-- Button with dynamic theme styling -->
        <button
          type="submit"
          :style="{ backgroundColor: themeStyle.primary }"
        >
          Sign Up
        </button>
      </div>

      <!-- Error Message Display -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <!-- Footer with cancel button and password link -->
      <div class="signup-ftr-container">
        <button type="button" class="cancelbtn" :style="{ backgroundColor: themeStyle.secondary }">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Styling for the signup form */
.outer-signup-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: calc(100vh - 60px); /* Adjust based on nav bar height */
  padding-top: 20px;
}

.signup-container {
  border: 1px solid #939090;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
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

.cancelbtn {
  width: auto;
  padding: 10px 18px;
  color: white;
  border: none;
  cursor: pointer;
}

.signup-ftr-container {
  margin-top: 16px;
}

.signup-container-data {
  padding: 16px;
}

span.psw {
  float: right;
  padding-top: 16px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

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
