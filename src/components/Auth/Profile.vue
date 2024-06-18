<template>
  <div>
    <v-card class="mb-5">
      <v-card-title> Profile </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <v-text-field
              v-model="user.name"
              label="Name"
              variant="outlined"
              prepend-inner-icon="mdi-account"
            ></v-text-field>
            <div v-if="errors.name" v-html="errors.name[0]" style="color: red" />
          </v-col>
          <v-col cols="12" md="6" sm="12">
            <v-text-field
              v-model="user.email"
              label="Email"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
            ></v-text-field>
            <div v-if="errors.email" v-html="errors.email[0]" style="color: red" />
          </v-col>
        </v-row>
        <div>
          <v-btn block elevation="2" @click="update_profile">Update Profile</v-btn>
        </div>
      </v-card-text>
    </v-card>
    <!--    Update password card-->
    <v-card>
      <v-card-title> Update Password </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" sm="12">
            <v-text-field
              v-model="password_update.old_password"
              label="Old password"
              :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              variant="outlined"
              @click:append="show1 = !show1"
            ></v-text-field>
            <div v-if="errors.old_password" v-html="errors.old_password[0]" style="color: red" />
          </v-col>
          <v-col cols="12" md="4" sm="12">
            <v-text-field
              v-model="password_update.new_password"
              label="New Password"
              :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              variant="outlined"
              @click:append="show1 = !show1"
            ></v-text-field>
            <div v-if="errors.new_password" v-html="errors.new_password[0]" style="color: red" />
          </v-col>
          <v-col cols="12" md="4" sm="12">
            <v-text-field
              v-model="password_update.new_password_confirmation"
              label="Password Confirmation"
              :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              variant="outlined"
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>
        </v-row>
        <div>
          <v-btn block elevation="2" @click="update_password">Update Password</v-btn>
        </div>
      </v-card-text>
    </v-card>
    <!-- Snackbar for user feedbacks -->
    <v-snackbar
      v-model="snackbar"
      multi-line
    >
      {{ message }}

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { userStore } from '../../stores/user.js'
export default {
  name: 'ProfileComponent',
  setup() {
    const userData = userStore().user.data;

    const show1 = ref(false)
    const snackbar = ref(false)
    const message = ref(null)

    const user = ref({
      name: null,
      email: null
    })

    const password_update = ref({
      old_password: null,
      new_password: null,
      new_password_confirmation: null
    })

    const errors = ref([]);

    // Methods
    function get_user_profile() {
      axios
        .get("api/profile/" + userData.id)
        .then((response) => {
            user.value.name = response.data[1].name;
            user.value.email = response.data[1].email;
        })
        .catch((error) => {
            message.value = "Something went wrong please try again!"
            snackbar.value = true;
          return error;
        });
    }

    function update_profile(){
        axios
        .patch("http://127.0.0.1:8000/api/update_profile/" + userData.id, user.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
            message.value = "Profile updated successful"
            snackbar.value = true;
              user.value.name = response.data[1].name;
              user.value.email = response.data[1].email;
              //Update user state
            //   sessionStorage.setItem("data", JSON.stringify(response.data[1]));
              break;

            default:
              // this.progress_dialog = false;
              errors.value = response.data.errors;
              message.value = "Something went wrong please try again!"
            snackbar.value = true;
              break;
          }
          this.progress_dialog = false;
        })
        .catch((error) => {
          errors.value = error.response.data.errors;
          message.value = "Something went wrong please try again!"
            snackbar.value = true;
          return error;
        });
    }

    function update_password() {
      axios
        .patch("http://127.0.0.1:8000/api/update_password/" + userData.id, password_update.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
            message.value = response.data[1];
            snackbar.value = true;
              password_update.value.old_password = null;
              password_update.value.new_password = null;
              password_update.value.new_password_confirmation = null;
              break;
            case 403:
              var error_msg = response.data[1];
              message.value = error_msg;
            snackbar.value = true;
              break;
          }
        })
        .catch((error) => {
          errors.value = error.response.data.errors;
          message.value = "Something went wrong please try again!"
            snackbar.value = true;
          return error;
        });
    }

    // Methods call
    get_user_profile();

    return {
      show1,
      user,
      password_update,
      errors,
      snackbar,
      message,
      update_profile,
      update_password,
      userData
    }
  }
}
</script>

<style scoped>
</style>