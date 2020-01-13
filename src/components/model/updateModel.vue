<template>
  <q-card :id="'update-' + modelName" class="bg-white relative-position">
    <q-card-section class="text-subtitle1 text-center bg-primary text-white q-py-xs">
      {{ $t('forms.actions.update') + ' ' + $tc('models.' + modelName + '.name', 1) }} <span class="text-bold">{{ model.label }}</span>
    </q-card-section>
    <q-card-section>
      <update-model-tabs
        :mode="mode"
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
    <q-btn
      round
      dense
      size="xl"
      color="warning"
      text-color="primary"
      @click="endUpdating"
      icon="chevron_left"
      style="position: absolute; left: -10px; top: -10px"
    />
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
  props: ['modelName', 'model', 'batchMode', 'quasarData', 'relation', 'mode'],
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
    },
    endUpdating () {
      this.$emit('cancelUpdate')
    }
  }
}
</script>

<style>
</style>
