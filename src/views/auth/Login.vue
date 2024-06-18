<template>
  <v-app>
    <div
      style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center"
    >
      <v-container>
        <v-img
          class="mx-auto my-6"
          max-width="228"
          src="https://donaldtz.com/_nuxt/christmass-logo.11457e53.png"
        ></v-img>
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
          <form @submit.prevent="login">
            <div v-if="wrong_cred" style="color:red;">{{ wrong_cred[1] }}</div>
            <div>
              <div class="text-subtitle-1 text-medium-emphasis">Account</div>
              <v-text-field
                v-model="user.email"
                name="E-mail"
                label="E-mail"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
              <div v-if="errors.email" v-html="errors.email[0]" style="color: red" />
            </div>
            <div>
              <div
                class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
              >
                Password

                <router-link
                  class="text-caption text-decoration-none text-blue"
                  to="/forgot-password"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Forgot login password?</router-link
                >
              </div>
              <v-text-field
                v-model="user.password"
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                @click:append-inner="show1 = !show1"
              ></v-text-field>
              <div v-if="errors.password" v-html="errors.password[0]" style="color: red" />
            </div>
            <div>
              <v-layout align-center justify-center>
                <v-btn
                  :loading="loading"
                  block
                  class="mb-8"
                  color="blue"
                  size="large"
                  variant="tonal"
                  @click="login()"
                >
                  Sign in
                </v-btn>
              </v-layout>
            </div>
          </form>
        </v-card>
      </v-container>
    </div>
  </v-app>
</template>
<script>
import { ref } from 'vue'
import axios from 'axios'
import { userStore } from '../../stores/user.js'
import router from '@/router/index.js'
export default {
  name: 'LoginPage',
  setup() {
    const loading = ref(null)
    const show1 = ref(false)
    const user = ref({
      email: null,
      password: null
    })

    const wrong_cred = ref()
    const errors = ref([])

    //Functions
    function login() {
      errors.value = []
      loading.value = true
      wrong_cred.value = null;
      axios
        .post('api/login', user.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              userStore().saveUserData(response.data[1])
              router.push('/')
              //   console.log(response.data)
              break
            case 401:
              wrong_cred.value = response.data
              break
            default:
              break
          }
          loading.value = false
        })
        .catch((error) => {
          errors.value = error.response.data.errors
          loading.value = false
          return error
        })
    }

    //Returning the data to be used in template
    return {
      user,
      login,
      wrong_cred,
      errors,
      show1,
      loading
    }
  }
}
</script>

<style scoped>
</style>