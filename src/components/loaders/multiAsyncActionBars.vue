<template>
  <q-dialog
    v-model="opened"
    content-class="q-pa-lg"
    persistent
    >
      <q-card v-if="uploading">
        <q-card-section class="bg-primary text-white">
          <div class="text-h5 text-center">
            {{ headerText }}
          </div>
        </q-card-section>
        <q-card-section v-if="items.length">
          <p class="text-center text-tertiary q-mt-sm q-mb-lg" v-if="uploading.length">{{uploadingText}}</p>
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
  props: ['items', 'opened', 'keyField', 'headerText', 'relation', 'relatedTo', 'parentIndex'],
  data () {
    return {
      success: [],
      failed: []
    }
  },
  computed: {
    uploadingText () {
      return this.uploading[0]['model'] ? this.uploading[0].model[this.keyField] : this.uploading[0][this.keyField]
    },
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
    async multiUploadFiles () {
      console.log('Multi Async Actions Launched')
      // console.log(payload)
      for (let item of this.items) {
        this.$set(item, 'phase', 'waiting')
      }
      // this.multiAsyncAction.show = true
      let success = []
      let failed = []
      let round = 0
      while ((success.length + failed.length) < this.items.length) {
        let item = this.items[round]
        this.items[round].phase = 'uploading'
        if (this.relation) {
          console.log('Has Relation')
          item.url = item.actionPayload.url
          await this.$store.dispatch('Model/sendNewForm', {
            'source': item
          }).then((response) => {
            this.$store.commit('Model/addRelationItems', { name: this.relatedTo, relation: this.relation, items: response.model, parentIndex: this.parentIndex })
            this.$store.dispatch('Notify/displayMessage', { message: 'Relation Saved', position: 'top', type: 'positive' })
            this.$emit('multiUploadFileSuccess', { index: round })
            success.push(item)
            this.success.push(item)
            this.items[round].phase = 'success'
            round++
          }).catch((response) => {
            this.$store.dispatch('Response/responseErrorManager', response)
            failed.push(item)
            this.failed.push(item)
            this.items[round].phase = 'failed'
            round++
          })
        } else {
          await this.sendAction(item)
            .then((response) => {
              this.$emit('multiUploadFileSuccess', { index: round })
              success.push(item)
              this.success.push(item)
              this.items[round].phase = 'success'
              round++
            }).catch(() => {
              failed.push(item)
              this.failed.push(item)
              this.items[round].phase = 'failed'
              round++
            })
        }
      }
      return true
    },
    sendAction (payload) {
      // console.log('Send File')
      // console.log(payload)
      return new Promise((resolve, reject) => {
        this.$axios({
          url: payload.actionPayload.url,
          method: payload.actionPayload.method,
          params: payload.actionPayload.params
        }).then((response) => {
          // if (this.relation) {
          //   this.$store.commit('Model/addRelationItems', { name: this.relatedTo, relation: this.relation, items: response.model, parentIndex: this.parentIndex })
          // }
          this.$store.dispatch('Notify/displayMessage', { message: 'Action Completed', position: 'top', type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Notify/displayMessage', { message: 'Action Failed', position: 'top', type: 'negative' })
          // this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    uploadColorStatus (item) {
      if (item.phase === 'uploading') return 'primary'
      if (item.phase === 'waiting') return 'warning'
      if (item.phase === 'failed') return 'negative'
      if (item.phase === 'success') return 'positive'
    }
  },
  mounted () {
    this.multiUploadFiles()
  }
}
</script>

<style>
</style>
