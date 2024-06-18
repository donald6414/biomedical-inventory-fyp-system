<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-img
        class="mx-auto my-6"
        max-width="100"
        src="https://donaldtz.com/_nuxt/christmass-logo.11457e53.png"
      ></v-img>
      <!-- Profile -->
      <v-app-bar-title>
        <v-list style="float: left;">
          <v-list-item
            :title="userData.name"
            :subtitle="userData.email"
          >
            <template v-slot:append>
              <router-link to="profile" style="text-decoration: none; color: inherit">
              <v-btn style="float: right;" size="small" variant="text" icon="mdi-pencil"></v-btn>
            </router-link>
            </template>
          </v-list-item>
        </v-list>
      </v-app-bar-title>
      <!-- navigation links -->
      <v-list>
        <router-link
          :to="path"
          v-for="[icon, text, path] in links"
          :key="icon"
          style="text-decoration: none; color: inherit"
        >
          <v-list-item :prepend-icon="icon" :title="text" link> </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- Logout -->
      <v-app-bar-title>
        <v-list style="float: right">
          <v-list-item
          >
            <template v-slot:append>
              <v-btn size="small" variant="text" icon="mdi-logout" @click="logout"></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <!--  -->
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
  
  <script>
import { userStore } from '../../stores/user'
import router from '@/router/index.js'
import axios from 'axios'
// import Logout from '../../components/Logout.vue'
import { ref } from 'vue'
export default {
  components: {
    // Logout
  },
  setup() {
    const userData = userStore().user.data

    const links = [
      ['mdi-inbox-arrow-down', 'Dashboard', '/dashboard'],
      ['mdi-source-branch', 'Departments', '/departments'],
      ['mdi-toolbox-outline', 'Equipments', '/equipments'],
      ['mdi-clock-outline', 'Scheduled Maintenance', '/scheduled-maintenance'],
      ['mdi-clock', 'Fault Reports', '/faults-reports'],
    ]

    const drawer = ref(null)

    //Logout button
    function logout() {
      axios
        .post('api/logout')
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              axios.defaults.headers = {}
              userStore().logout()
              router.push('/login')
              //   console.log(response.data)
              break
          }
        })
        .catch((error) => {
          return error
        })
    }

    return {
      userData,
      links,
      drawer,
      logout
    }
  }
}
</script>