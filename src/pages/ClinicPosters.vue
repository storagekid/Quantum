<template>
  <q-page class="q-pa-md q-gutter-md">
    <model-table
      ref="clinicPostersTable"
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :permissions="permissions"
      :rows="modelsNeeded.clinic_posters.paginate"
      :dense="true"
      :editAferCreate="true"
      :getModelView="true"
      startFilter="&&Activa!=&&Fecha de Baja=="
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-clinic.active" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="item.item" color="positive"></q-icon>
        <q-icon name="check_circle" v-else color="negative"></q-icon>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'ClinicPosters',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'clinic_posters',
      modelsNeeded: {
        clinic_posters: {
          scoped: true,
          refresh: true,
          orderBy: 'clinic_id',
          withCount: ['clinic_poster_priorities'],
          full: true
        }
      }
    }
  },
  computed: {
    permissions () {
      let role = this.$store.state.User.groupsInfo['Clinics']
      let object = {
        show: (role !== 'guest'),
        create: ['user', 'editor', 'administrator', 'overseeker', 'root'].includes(role),
        edit: ['administrator', 'editor', 'overseeker', 'root'].includes(role),
        delete: ['overseeker', 'root'].includes(role)
      }
      return object
    }
  }
}
</script>

<style>
</style>
