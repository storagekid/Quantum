<template>
  <q-card id="remove-model" class="bg-white">
    <q-card-section class="text-center bg-secondary text-primary">
      Cloning {{name}}
    </q-card-section>
    <q-separator />
    <q-card-section class="text-center">
      <p>{{name}} will be cloned</p>
      <p class="text-negative q-title">Are you Sure?</p>
    </q-card-section>
    <q-btn color="primary" label="DO IT" class="full-width" @click="cloneModel"/>
  </q-card>
</template>

<script>
import { ModelBuilder, ModelController } from '../../mixins/modelMixin'

export default {
  name: 'CloneModelConfirm',
  props: ['name', 'model', 'relatedTo', 'parentIndex'],
  mixins: [ModelBuilder, ModelController],
  data () {
    return {}
  }
}
</script>

<style>
</style>
