<template>
    <div>
    <div v-if="loading">
        loading...
    </div>
    <div v-else>
      <!-- Dashboard {{ data[0] }} -->
      <v-row>
        <v-col v-for="(item,index) in data" :key="index" cols="12" md="3">
          <DashboardCard :title="item.title" :value="item.value" :cash="item.cash"/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import DashboardCard from './DashboardCard.vue'
export default {
  name: 'DashboardComponent',
  components: {
    DashboardCard
  },
  setup() {
    const loading = ref(true)

    const data = ref([])

    // Functions
    function load_dashboard() {
      axios
        .get('api/load-dashboard')
        .then((response) => {
          data.value = response.data
          loading.value = false
        })
        .catch((error) => {
          return error
        })
    }

    // Function calls
    load_dashboard();

    return{
        loading,
        data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>