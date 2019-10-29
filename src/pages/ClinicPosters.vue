<template>
  <q-page class="q-pa-md q-gutter-md">
    <model-table
      ref="clinicPostersTable"
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :rows="modelsNeeded.clinic_posters.paginate"
      :dense="true"
      :editAferCreate="true"
      :getModelView="true"
      startFilter="&&Activa!=&&Fecha de Baja=="
      v-if="modelsReady"
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
  }
}
</script>

<style>
</style>
