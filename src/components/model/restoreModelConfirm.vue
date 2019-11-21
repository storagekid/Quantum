<template>
  <q-card id="remove-model" class="bg-white">
    <q-card-section class="text-center bg-secondary text-primary">
      Restoring {{name}}
    </q-card-section>
    <q-separator />
    <q-card-section class="text-center">
      <p>{{modelQty}} {{name}} will be restore</p>
      <p class="text-negative q-title">Are you Sure?</p>
    </q-card-section>
    <q-btn color="primary" label="DO IT" class="full-width" @click="sendRestoreForm"/>
  </q-card>
</template>

<script>
export default {
  name: 'RestoreModelConfirm',
  props: ['name', 'modelQty', 'models', 'relatedTo', 'parentIndex', 'quasarData'],
  data () {
    return {}
  },
  methods: {
    sendRestoreForm () {
      this.$q.loading.show()
      this.$emit('confirmed')
      // console.log('Restoring Items')
      let action
      if (this.relatedTo) {
        this.$store.dispatch('Notify/displayMessage', { message: 'Not Implemented. Contact the administrator', position: 'top', type: 'warning' })
        // action = this.$store.dispatch('Model/restoreRelations', { name: this.name, items: this.models.map(model => { return { id: model.id } }), relatedTo: this.relatedTo, parentIndex: this.parentIndex })
      } else {
        action = this.$store.dispatch('Model/restoreModels', { name: this.name, items: this.models.map(model => { return model.id }), nameSpace: this.quasarData.nameSpace })
      }
      action.then((data) => {
        this.$store.dispatch('Notify/displayMessage', { message: this.modelQty + ' ' + this.name + ' restored', position: 'top', type: 'positive' })
        if (data.message) {
          this.$store.dispatch('Notify/displayMessage', { message: data.message, position: 'top', type: 'positive' })
        }
        this.$emit('finished')
        this.$q.loading.hide()
      }).catch((response) => {
        this.$store.dispatch('Response/responseErrorManager', response)
        this.$emit('finished')
        this.$q.loading.hide()
      })
    }
  }
}
</script>

<style>
</style>
