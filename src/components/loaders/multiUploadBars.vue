<template>
  <q-dialog
    v-model="opened"
    content-class="q-pa-lg"
    persistent
    >
      <q-card v-if="uploading">
        <q-card-section class="bg-primary text-white">
          <div class="text-h5 text-center">
            Uploading Files
          </div>
        </q-card-section>
        <q-card-section>
          <p class="text-center text-tertiary q-mt-sm q-mb-lg">{{uploading[0].file.name}}</p>
            <q-linear-progress
              class="q-mt-sm q-mb-lg"
              track-color="secondary"
              stripe
              color="primary"
              :value="completed"
              style="min-width:400px; height: 30px"
            />
            <q-linear-progress
              class="q-my-sm"
              v-for="(item, index) in items"
              :key="'LoadingBar' + index"
              :indeterminate="item.phase === 'uploading'"
              :color="uploadColorStatus(item)"
              :value="item.phase === 'success' ? 1 : 0"
              style="height: 10px"
            />
        </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'MultiUploadBars',
  props: ['items', 'opened'],
  data () {
    return {}
  },
  computed: {
    uploading () {
      let item = this.items.filter(item => { return item.phase === 'uploading' })
      return item.length ? item : false
    },
    completed () {
      let validPhases = ['success', 'failed']
      let completed = this.items.filter(item => { return validPhases.includes(item.phase) })
      return completed.length / this.items.length
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
