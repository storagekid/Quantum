<template>
  <q-page class="q-pa-md q-gutter-md">
    <model-table
      ref="clinicPostersTable"
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :sticky="true"
      :virtualScroll="true"
      :dense="true"
      :editAferCreate="true"
      :getModelView="true"
      startFilter="&&Activa!=&&Fecha de Baja=="
      v-if="modelsReady"
      >
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
