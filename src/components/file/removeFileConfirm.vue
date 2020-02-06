<template>
  <q-card id="remove-model" class="bg-white">
    <q-card-section class="text-center bg-secondary text-primary">
      Removing {{ fileName }}
    </q-card-section>
    <q-separator />
    <q-card-section class="text-center">
      <!-- <p>{{modelQty}} {{ $tc('models.' + name + '.name', modelQty) }} will be removed <strong class="text-negative" v-if="forceDeleting"> PERMANENTLY</strong></p> -->
      <p class="text-negative text-h6">Are you Sure?</p>
    </q-card-section>
    <q-btn-group spread>
      <q-btn color="warning" label="Cancel" class="" @click="cancel"/>
      <q-btn color="primary" label="DO IT" class="" @click="confirm"/>
    </q-btn-group>
  </q-card>
</template>

<script>
export default {
  name: 'removeFileConfirm',
  props: ['fileName'],
  data () {
    return {}
  },
  methods: {
    confirm () {
      this.$emit('confirmed')
    },
    cancel () {
      this.$emit('canceled')
    }
  }
}
</script>
