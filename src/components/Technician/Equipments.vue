<template>
  <div>
    <div v-if="loading">loading...</div>
    <div v-else>
      <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-toolbox-outline"
        text="Add Equipment"
        variant="tonal"
        @click="add_new_equipment"
      ></v-btn>

      <!-- Equipments listing -->
      <div class="mt-4">
        <v-card title="Equipments" flat>
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

          <v-data-table :headers="headers" :items="equipments" :search="search">
            <template v-slot:item.actions="{ item }">
              <v-icon @click="edit_equipment(item)"> mdi-pencil </v-icon>
              <v-icon @click="download_qrcode(item)"> mdi-download </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </div>

      <!-- Equipment Dialog -->
      <v-dialog v-model="dialog" max-width="600">
        <v-card
          prepend-icon="mdi-toolbox-outline"
          :title="edit_mode ? 'Edit Equipment' : 'Add Equipment'"
        >
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="12" sm="12">
                <v-select
                  v-model="equipment.department"
                  :items="departments"
                  item-title="name"
                  item-value="id"
                  label="Select"
                  variant="outlined"
                ></v-select>
                <div v-if="errors.department" v-html="errors.department[0]" style="color: red" />
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field
                  label="Equipment Name"
                  variant="outlined"
                  v-model="equipment.name"
                  required
                ></v-text-field>
                <div v-if="errors.name" v-html="errors.name[0]" style="color: red" />
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field
                  label="Serial Number"
                  variant="outlined"
                  v-model="equipment.serial_number"
                  required
                ></v-text-field>
                <div
                  v-if="errors.serial_number"
                  v-html="errors.serial_number[0]"
                  style="color: red"
                />
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field
                  label="Shedule Maintanance Days"
                  variant="outlined"
                  v-model="equipment.number_of_days"
                  required
                ></v-text-field>
                <div
                  v-if="errors.number_of_days"
                  v-html="errors.number_of_days[0]"
                  style="color: red"
                />
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
              v-if="!edit_mode"
              variant="tonal"
              @click="save_new_equipment"
            ></v-btn>
            <v-btn
              :loading="button_loading"
              color="primary"
              text="Update"
              v-else
              variant="tonal"
              @click="update_equipment"
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
  name: 'EquipmentsComponent',
  setup() {
    const dialog = ref(false)
    const edit_mode = ref(false)
    const loading = ref(true)
    const departments = ref([])
    const errors = ref([])
    const equipments = ref([])
    const search = ref('')
    const equipment_id = ref(null)
    const button_loading = ref(false)

    const equipment = ref({
      name: '',
      serial_number: '',
      number_of_days: '',
      department: ''
    })

    const headers = ref([
      {
        align: 'start',
        key: 'name',
        sortable: false,
        title: 'Equipment name'
      },
      { key: 'department.name', title: 'Department' },
      { key: 'serial_no', title: 'Serial Number' },
      { key: 'schedule', title: 'Schedule' },
      { key: 'actions', title: 'Actions' }
    ])

    // Functions
    function get_departments() {
      axios
        .get('api/get-departments')
        .then((response) => {
          departments.value = response.data
        })
        .catch((error) => {
          errors.value = error.response.data.errors
          return error
        })
    }

    function get_equipments() {
      axios
        .get('api/get-equipments')
        .then((response) => {
          equipments.value = response.data
          loading.value = false
        })
        .catch((error) => {
          errors.value = error.response.data.errors
          loading.value = false
          return error
        })
    }

    function add_new_equipment() {
      edit_mode.value = false
      equipment_id.value = null
      equipment.value.name = ''
      equipment.value.serial_number = ''
      equipment.value.number_of_days = ''
      equipment.value.department = ''
      dialog.value = true
    }

    function save_new_equipment() {
      button_loading.value = true
      axios
        .post('api/save-new-equipment', equipment.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              equipment.value.name = ''
              equipment.value.serial_number = ''
              equipment.value.number_of_days = ''
              equipment.value.department = ''
              Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'Equipment added successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: {
                  title: 'swal-title',
                  timerProgressBar: 'swal-progressbar'
                }
              })
              get_equipments()
              button_loading.value = false
              dialog.value = false
              break
          }
          loading.value = false
        })
        .catch((error) => {
          button_loading.value = false
          errors.value = error.response.data.errors
          Swal.fire({
            toast: true,
            position: 'top-end',
            title: 'Something went wrong please try again!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            customClass: {
              title: 'swal-title',
              timerProgressBar: 'swal-progressbar'
            }
          })
          loading.value = false
          return error
        })
    }

    function edit_equipment(item) {
      edit_mode.value = true
      equipment_id.value = item.id
      equipment.value.name = item.name
      equipment.value.serial_number = item.serial_no
      equipment.value.number_of_days = item.schedule
      equipment.value.department = item.department_id
      dialog.value = true
    }

    function update_equipment() {
      button_loading.value = true
      axios
        .patch('api/update-equipment/' + equipment_id.value, equipment.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              equipment.value.name = ''
              equipment.value.serial_number = ''
              equipment.value.number_of_days = ''
              equipment.value.department = ''
              Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'Equipment updated successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: {
                  title: 'swal-title',
                  timerProgressBar: 'swal-progressbar'
                }
              })
              button_loading.value = false
              get_equipments()
              dialog.value = false
              break
          }
          loading.value = false
        })
        .catch((error) => {
          button_loading.value = false
          errors.value = error.response.data.errors
          Swal.fire({
            toast: true,
            position: 'top-end',
            title: 'Something went wrong please try again!',
            icon: 'error',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            customClass: {
              title: 'swal-title',
              timerProgressBar: 'swal-progressbar'
            }
          })
          loading.value = false
          return error
        })
    }

    function download_qrcode(item) {
      axios
        .get('api/download-qrcode/' + item.id, {
          responseType: 'blob' // Ensure the response is treated as binary data
        })
        .then((response) => {
          // Create a temporary URL for the image blob
          const url = window.URL.createObjectURL(new Blob([response.data]))

          // Create a temporary link element
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', item.qr_id) // Set the file name
          document.body.appendChild(link)

          // Trigger the download
          link.click()

          // Cleanup
          window.URL.revokeObjectURL(url)
          document.body.removeChild(link)
        })
        .catch((error) => {
          errors.value = error.response.data.errors
          return error
        })
    }

    // Functions calls
    get_departments()
    get_equipments()

    return {
      dialog,
      add_new_equipment,
      edit_mode,
      equipment,
      departments,
      loading,
      save_new_equipment,
      errors,
      equipments,
      search,
      headers,
      edit_equipment,
      update_equipment,
      button_loading,
      download_qrcode
    }
  }
}
</script>

<style scoped>
</style>