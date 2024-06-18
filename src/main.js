// import './assets/main.css'
import '@mdi/font/css/materialdesignicons.min.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Axios
import axios from 'axios';

axios.defaults.headers = {
  "Accept":'application/json'
}

// // Base URL
// axios.defaults.baseURL = 'https://elton.donaldtz.com/';
axios.defaults.baseURL = 'http://127.0.0.1:8000/';

// Sweetalert
// import Swal from 'sweetalert2'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
