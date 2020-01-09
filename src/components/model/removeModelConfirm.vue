<template>
  <q-card id="remove-model" class="bg-white">
    <q-card-section class="text-center bg-secondary text-primary">
      Removing {{ $tc('models.' + name + '.name', modelQty) }}
    </q-card-section>
    <q-separator />
    <q-card-section class="text-center">
      <p>{{modelQty}} {{ $tc('models.' + name + '.name', modelQty) }} will be removed <strong class="text-negative" v-if="forceDeleting"> PERMANENTLY</strong></p>
      <p class="text-negative q-title">Are you Sure?</p>
    </q-card-section>
    <q-btn color="primary" label="DO IT" class="full-width" @click="sendDestroyForm" v-if="!preventScopeSelected"/>
    <q-btn color="info" label="CHANGE SCOPE BEFORE DELETING" class="full-width" v-else v-close-popup/>
  </q-card>
</template>

<script>
export default {
  name: 'RemoveModelConfirm',
  props: ['name', 'modelQty', 'models', 'relatedTo', 'parentIndex'],
  data () {
    return {}
  },
  computed: {
    softDeleting () {
      return this.models[0].hasOwnProperty('deleted_at')
    },
    forceDeleting () {
      for (let model of this.models) {
        if (!model.deleted_at) return false
      }
      return true
    },
    preventScopeSelected () {
      if (!this.forceDeleting) return false
      if (this.name === 'clinics') {
        if (this.$store.getters['Scope/clinicSelected']) {
          let ids = this.models.map(i => { return i.id })
          if (ids.includes(this.$store.getters['Scope/clinicSelected'].id)) return true
        }
      } else if (this.name === 'stores') {
        if (this.$store.getters['Scope/storeSelected']) {
          let ids = this.models.map(i => { return i.id })
          if (ids.includes(this.$store.getters['Scope/storeSelected'].id)) return true
        }
      }
      return false
    }
  },
  methods: {
    sendDestroyForm () {
      this.$q.loading.show()
      this.$emit('confirmed')
      // console.log('Removing Items')
      let action
      if (this.relatedTo) {
        action = this.$store.dispatch('Model/removeRelations', { name: this.name, items: this.models.map(model => { return { id: model.id } }), relatedTo: this.relatedTo, parentIndex: this.parentIndex })
      } else {
        action = this.$store.dispatch('Model/removeModels', { name: this.name, items: this.models.map(model => { return model.id }), softDeleting: this.softDeleting, forceDeleting: this.forceDeleting })
      }
      action.then((data) => {
        this.$store.dispatch('Notify/displayMessage', { message: this.modelQty + ' ' + this.name + ' removed', position: 'top', type: 'positive' })
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
