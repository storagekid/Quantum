<template>
  <q-dialog
    v-model="opened"
    content-class="q-pa-lg"
    persistent
    >
      <q-card v-if="uploading">
        <q-card-section class="bg-primary text-white">
          <div class="text-h5 text-center">
            {{ headerText ? headerText : 'Multiaction Send'}}
          </div>
        </q-card-section>
        <q-card-section v-if="items.length">
          <p class="text-center text-tertiary q-mt-sm q-mb-lg" v-if="uploading.length">{{uploading[0][keyField ? keyField : 'id']}}</p>
          <p class="text-center text-tertiary q-mt-sm q-mb-lg" v-else>Finished</p>
            <q-linear-progress
              class="q-mt-sm q-mb-lg"
              track-color="secondary"
              stripe
              color="primary"
              :value="completed"
              style="min-width:400px; height: 30px"
            />
            <p class="text-center text-h6 text-primary">{{ completedItems.length }} de {{ items.length }}</p>
            <q-linear-progress
              class="q-my-sm"
              v-for="(item, index) in items"
              :key="'LoadingBar' + index"
              :indeterminate="item.phase === 'uploading'"
              :color="uploadColorStatus(item)"
              :value="['success', 'failed'].includes(item.phase) ? 1 : 0"
              style="height: 10px"
            />
        </q-card-section>
        <q-card-section v-else>
          <p class="text-center text-h6 text-warning q-pt-md">No hay acciones que realizar</p>
        </q-card-section>
        <q-card-actions align="right" v-if="!uploading.length || !items.length">
          <q-btn label="Cerrar" color="info" @click="$emit('Finished')"/>
        </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'MultiAsyncActionBars',
  props: ['items', 'opened', 'keyField', 'headerText'],
  data () {
    return {}
  },
  computed: {
    uploading () {
      let item = this.items.filter(item => { return item.phase === 'uploading' })
      return item.length ? item : true
    },
    completed () {
      return this.completedItems.length / this.items.length
    },
    completedItems () {
      let validPhases = ['success', 'failed']
      let completed = this.items.filter(item => { return validPhases.includes(item.phase) })
      return completed
    }
  },
  methods: {
    uploadColorStatus (item) {
      if (item.phase === 'uploading') return 'primary'
      if (item.phase === 'waiting') return 'warning'
      if (item.phase === 'failed') return 'negative'
      if (item.phase === 'success') return 'positive'
    }
  }
}
</script>

<style>
</style>
