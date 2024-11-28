<script setup>
import { Head, router } from '@inertiajs/vue3'
import { onMounted, computed, ref } from 'vue'
import Nav from '~/pages/components/layout.vue'
import store from '~/css/themeStore'
import axios from 'axios'
import Layout from '~/pages/components/layout.vue'

const email = ref('')
const password = ref('')
let errorMessage = ref('')

const themeStyle = computed(() => store.getters.themeStyle)
const isPopupVisible = ref(false)

onMounted(() => {
  store.dispatch('loadThemeFromLocalStorage')
})

const login = async () => {
  try {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    })

    console.log('Login successful', response.data)

    store.commit('setLoginStatus', true)

    localStorage.setItem('isLoggedIn', 'true')

    await router.get('/mytravels')
  } catch (error) {
    isPopupVisible.value = true
    errorMessage.value = error.response?.data?.message || 'Login failed'
  }
}

function forgotPassword() {
  isPopupVisible.value = true
  errorMessage.value = 'Too bad, make new account :('
}

function closePopUp() {
  isPopupVisible.value = false
  errorMessage.value = ''
}
</script>

<template>
  <Head title="Travel Map - Log In" />
  <Layout>
    <div class="app__container" :style="themeStyle">
      <div class="container">
        <div class="login__section">
          <form @submit.prevent="login" method="post">
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
              </div>
            </div>
          </form>
          <div class="login__ftr-container">
            <button class="psw" @click="forgotPassword">Forgot password?</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isPopupVisible" class="popup-overlay" @click.self="closePopUp">
      <div class="popup-content">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button @click="isPopupVisible = false">Close</button>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.login__section {
  justify-self: center;

  background: v-bind(themeStyle.backgroundColor);
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
  background: v-bind(themeStyle.backgroundColor);
  color: v-bind(themeStyle.color);
  box-shadow: 0 3px 5px v-bind(themeStyle.secondary);
}

.btn--login:hover {
  box-shadow: 0 3px 5px v-bind(themeStyle.primary);
}

.login__item {
  margin: 1rem auto;
}

.login__ftr-container {
  justify-self: right;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: v-bind(themeStyle.backgroundColor);
  padding: 20px;
  border-radius: 32px;
  text-align: center;
  width: 300px;
  max-width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.popup-content p {
  font-size: 18px;
  margin-bottom: 20px;
}

.popup-content button {
  box-sizing: border-box;

  padding: 6px 13px;
  margin: 8px;
  cursor: pointer;
  border-radius: 16px;

  color: v-bind(themeStyle.color);
  box-shadow: 0 3px 5px v-bind(themeStyle.secondary);
  background: v-bind(themeStyle.backgroundColor);
}

.popup-content button:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 5px v-bind(themeStyle.primary);
  background: v-bind(themeStyle.backgroundColor);
}
</style>
