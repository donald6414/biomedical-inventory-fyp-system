<template>
  <div>
    <button @click="logout">logout</button>
  </div>
</template>

<script>
import axios from 'axios'
import { userStore } from '../stores/user.js'
import router from '@/router/index.js'
export default {
  name: 'LogoutComponent',
  setup() {
    function logout() {
      axios
        .post('http://127.0.0.1:8000/api/logout')
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
      logout
    }
  }
}
</script>

<style scoped>
</style>