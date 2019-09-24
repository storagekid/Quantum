<template>
  <q-card :id="'new-' + modelName" class="bg-white relative-position" style="minWidth: 80vw; overflow: visible">
    <q-card-section class="text-center bg-primary text-white">
      <strong>{{ $t('forms.actions.create') + ' ' + $tc('models.' + modelName + '.name', 1)}}</strong>
    </q-card-section>
    <q-card-section>
      <new-model-form-steps
        :mode="relation ? 'update' : 'new'"
        :modelName="modelName"
        :quasarData="quasarData"
        :relation="relation"
        v-on:formSent="changeStatus"
        v-on:formRespondedOK="closeModal"
        v-on:formRespondedWithErrors="changeStatus"
      >
      </new-model-form-steps>
    </q-card-section>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
import NewModelFormSteps from '../model/newModelFormSteps'

export default {
  name: 'NewModel',
  components: { NewModelFormSteps },
  props: ['modelName', 'modelsNeeded', 'quasarData', 'relation'],
  data () {
    return {
      visible: false
    }
  },
  methods: {
    changeStatus () {
      this.visible = !this.visible
    },
    closeModal () {
      this.visible = false
      this.$emit('profileCreated')
    }
  }
}
</script>

<style>
</style>
