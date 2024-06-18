<template>
    <div>
      <div v-if="loading">loading...</div>
      <div v-else>
        <!-- Equipments listing -->
        <div class="mt-4">
          <v-card title="Scheduled Maintenance" flat>
            <template v-slot:text>
              <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </template>
  
            <v-data-table :headers="headers" :items="faults_reported" :search="search">
              <template v-slot:item.actions="{ item }">
                <v-icon @click="write_report(item)"> mdi-pencil </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </div>
  
        <!-- Report Dialog -->
        <v-dialog v-model="dialog" max-width="600">
          <v-card prepend-icon="mdi-toolbox-outline" title="Write a report">
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="12" sm="12">
                  <v-text-field
                    label="Report Title"
                    variant="outlined"
                    v-model="report.name"
                    required
                    disabled
                  ></v-text-field>
                </v-col>
  
                <v-col cols="12" md="12" sm="12">
                  <v-text-field
                    label="Report Title"
                    variant="outlined"
                    v-model="report.title"
                    required
                  ></v-text-field>
                  <div v-if="errors.title" v-html="errors.title[0]" style="color: red" />
                </v-col>
  
                <v-col cols="12" md="12" sm="12">
                  <v-textarea
                    label="Description"
                    row-height="25"
                    rows="3"
                    variant="outlined"
                    auto-grow
                    shaped
                    v-model="report.description"
                  ></v-textarea>
                  <div v-if="errors.description" v-html="errors.description[0]" style="color: red" />
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <v-radio-group v-model="report.status">
                    <v-radio label="Solved" value="true"></v-radio>
                    <v-radio label="Not Solved" value="false"></v-radio>
                  </v-radio-group>
                  <div v-if="errors.status" v-html="errors.status[0]" style="color: red" />
                </v-col>
              </v-row>
            </v-card-text>
  
            <v-divider></v-divider>
  
            <v-card-actions>
              <v-spacer></v-spacer>
  
              <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
  
              <v-btn
                :loading="button_loading"
                color="primary"
                text="Save"
                variant="tonal"
                @click="save_report"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  export default {
    setup() {
      const loading = ref(true)
  
      const button_loading = ref(false)
  
      const dialog = ref(false)
  
      const faults_reported = ref([])
  
      const errors = ref([])
  
      const fault_reported = ref(null)
  
      const search = ref('')
  
      const headers = ref([
        {
          align: 'start',
          key: 'equipment.name',
          sortable: false,
          title: 'Equipment Name'
        },
        { key: 'equipment.department.name', title: 'Department' },
        { key: 'equipment.serial_no', title: 'Serial Number' },
        // { key: 'date', title: 'Scheduled' },
        { key: 'actions', title: 'Actions' }
      ])
  
      const report = ref({
        name: '',
        title: '',
        equipment: '',
        description: '',
        status: Boolean,
      })
  
      //Functions
      function get_scheduled_maintenance() {
        axios
          .get('api/get-fault-reports')
          .then((response) => {
            faults_reported.value = response.data
            loading.value = false
          })
          .catch((error) => {
            return error
          })
      }
  
      function write_report(item) {
        fault_reported.value = item.id
        report.value.name = item.equipment.name
        report.value.equipment = item.equipment.id
        dialog.value = true
      }
  
      function save_report() {
        button_loading.value = true
        axios
          .post('api/save-reported_fault/' + fault_reported.value,report.value)
          .then((response) => {
            switch (response.data[0]) {
              case 200:
                report.value.title = ''
                report.value.description = ''
                report.value.status = ''
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  title: 'Report submitted successfully!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2500,
                  timerProgressBar: true,
                  customClass: {
                    title: 'swal-title',
                    timerProgressBar: 'swal-progressbar'
                  }
                })
                get_scheduled_maintenance()
                button_loading.value = false
                dialog.value = false
                break
            }
          })
          .catch((error) => {
            button_loading.value = false
            errors.value = error.response.data.errors
            return error
          })
      }
  
      // Function calls
      get_scheduled_maintenance()
  
      return {
        loading,
        faults_reported,
        headers,
        search,
        write_report,
        dialog,
        report,
        save_report,
        errors,
        button_loading
      }
    }
  }
  </script>
  
  <style scoped>
  </style>