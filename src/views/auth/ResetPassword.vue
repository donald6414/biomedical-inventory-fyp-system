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
            <div>
              <div class="text-subtitle-1 text-medium-emphasis">OTP CODE</div>
              <v-text-field
                v-model="user.otp_code"
                name="input-10-1"
                label="OTP CODE"
                variant="outlined"
              ></v-text-field>
              <div v-if="errors.otp_code" v-html="errors.otp_code[0]" style="color: red" />
            </div>

            <div>
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
              <v-text-field
                v-model="user.password_confirmation"
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password Confirmation"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                @click:append-inner="show1 = !show1"
              ></v-text-field>
              <div
                v-if="errors.password_confirmation"
                v-html="errors.password_confirmation[0]"
                style="color: red"
              />
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
                  @click="reset_password()"
                >
                  Sign in
                </v-btn>
              </v-layout>
            </div>
          </form>
        </v-card>
      </v-container>
    </div>
    <!-- Snackbar for response display -->
    <v-snackbar v-model="snackbar" multi-line>
      {{ response_message }}

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
  <script>
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router/index.js'
export default {
  name: 'LoginPage',
  setup() {
    const loading = ref(null)
    const show1 = ref(false)
    const user = ref({
      password: null,
      password_confirmation: null,
      otp_code: null
    })

    const snackbar = ref(false)
    const response_message = ref(null)

    const errors = ref([])

    //Functions
    function reset_password() {
      errors.value = []
      loading.value = true
      axios
        .post('http://127.0.0.1:8000/api/reset_password', user.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              response_message.value = response.data[1];
              snackbar.value = true;
              router.push({ name: 'Login' })
              //   console.log(response.data)
              break
            case 401:
              response_message.value = response.data[1];
              snackbar.value = true;
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
      reset_password,
      errors,
      show1,
      loading,
      snackbar,
      response_message
    }
  }
}
</script>
  
  <style scoped>
</style>