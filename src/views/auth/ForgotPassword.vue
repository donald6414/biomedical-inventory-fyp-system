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
          <!-- <div v-if="output" style="color: green;">{{ output }}</div> -->
          <form @submit.prevent="forgot_password">
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
              <v-layout align-center justify-center>
                <v-btn
                  :loading="loading"
                  block
                  class="mb-8"
                  color="blue"
                  size="large"
                  variant="tonal"
                  @click="forgot_password"
                >
                  Submit
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
// import { userStore } from '../../stores/user.js'
// import router from '@/router/index.js'
export default {
  setup() {
    const loading = ref(null)
    const show1 = ref(false)
    const user = ref({
      email: null
    })
    const errors = ref([])
    // const output = ref(null);
    const snackbar = ref(false)
    const response_message = ref(null)

    //Functions
    function forgot_password() {
      errors.value = []
      loading.value = true
      axios
        .post('http://127.0.0.1:8000/api/forgot_password', user.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              // output.value = response.data[1];
              response_message.value = response.data[1]
              snackbar.value = true
              //   console.log(response.data)
              break
            case 401:
              response_message.value = response.data[1]
              snackbar.value = true
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
      errors,
      show1,
      loading,
      // output,
      snackbar,
      forgot_password,
      response_message
    }
  }
}
</script>
  
  <style scoped>
</style>