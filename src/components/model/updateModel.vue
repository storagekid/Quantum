<template>
  <q-card :id="'update-' + modelName" class="bg-white relative-position">
    <q-card-section class="text-subtitle1 text-center bg-primary text-white q-py-xs">
      Update Model <span class="text-bold">{{ model.label }}</span>
    </q-card-section>
    <q-card-section>
      <update-model-tabs
        mode="update"
        :batchMode="batchMode"
        :modelName="modelName"
        :source="model"
        :relation="relation"
        :quasarData="quasarData"
        v-on:formSent="changeStatus"
        v-on:formResponded="closeModal"
        v-on:relationFormResponded="$q.loading.hide()"
        v-on:loading="visible = true"
        v-on:loaded="visible = false"
      >
      </update-model-tabs>
    </q-card-section>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
import UpdateModelTabs from '../model/updateModelTabs'

export default {
  name: 'UpdateModel',
  components: { UpdateModelTabs },
  props: ['modelName', 'model', 'batchMode', 'quasarData', 'relation'],
  data () {
    return {
      visible: false
    }
  },
  methods: {
    changeStatus () {
      this.$q.loading.show()
    },
    closeModal () {
      this.$q.loading.hide()
      this.$emit('modelUpdated')
    }
  }
}
</script>

<style>
</style>
