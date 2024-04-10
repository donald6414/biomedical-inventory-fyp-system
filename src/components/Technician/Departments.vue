<template>
  <div>
    <div v-if="loading">loading...</div>
    <div v-else>
      <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-source-branch-plus"
        text="Add Department"
        variant="tonal"
        @click="add_department"
      ></v-btn>
    </div>

    <!-- Department listings -->
    <div class="mt-4">
      <v-card title="departments" flat>
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

        <v-data-table :headers="headers" :items="departments" :search="search">
          <template v-slot:item.actions="{ item }">
            <v-icon @click="edit_department(item)"> mdi-pencil </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Department Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card
        prepend-icon="mdi-toolbox-outline"
        :title="edit_mode ? 'Edit Department' : 'Add Department'"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="12" sm="12">
              <v-text-field
                label="Department Name"
                variant="outlined"
                v-model="department.name"
                required
              ></v-text-field>
              <div v-if="errors.name" v-html="errors.name[0]" style="color: red" />
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
            @click="save_new_department"
          ></v-btn>
          <v-btn
            :loading="button_loading"
            color="primary"
            text="Update"
            v-else
            variant="tonal"
            @click="update_department"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
  name: 'DepartmentComponent',
  setup() {
    const dialog = ref(false)
    const button_loading = ref(false)
    const edit_mode = ref(false)
    const loading = ref(true)

    const search = ref('')

    const department_id = ref()

    const departments = ref([])

    const errors = ref([])

    const department = ref({
      name: ''
    })

    const headers = ref([
      {
        align: 'start',
        key: 'name',
        sortable: false,
        title: 'Department name'
      },
      { key: 'actions', title: 'Actions' }
    ])

    // Functions
    function get_departments() {
      axios
        .get('api/get-departments')
        .then((response) => {
          departments.value = response.data
          loading.value = false
        })
        .catch((error) => {
          errors.value = error.response.data.errors
          loading.value = false
          return error
        })
    }

    function add_department() {
      department.value.name = ''
      edit_mode.value = false
      department_id.value = ''
      dialog.value = true
    }

    function save_new_department() {
      button_loading.value = true
      axios
        .post('api/save-new-department', department.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              department.value.name = ''
              Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'Department added successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: {
                  title: 'swal-title',
                  timerProgressBar: 'swal-progressbar'
                }
              })
              get_departments()
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
          button_loading.value = false
          return error
        })
    }

    function update_department() {
      button_loading.value = true
      axios
        .patch('api/update-department/' + department_id.value, department.value)
        .then((response) => {
          switch (response.data[0]) {
            case 200:
              department.value.name = ''
              Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'Department updated successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                customClass: {
                  title: 'swal-title',
                  timerProgressBar: 'swal-progressbar'
                }
              })
              get_departments()
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
          button_loading.value = false
          return error
        })
    }

    function edit_department(item) {
      department.value.name = item.name
      edit_mode.value = true
      department_id.value = item.id
      dialog.value = true
    }

    // Function calls
    get_departments()

    return {
      dialog,
      edit_mode,
      loading,
      save_new_department,
      update_department,
      button_loading,
      department,
      add_department,
      edit_department,
      departments,
      headers,
      search,
      errors
    }
  }
}
</script>

<style scoped>
</style>