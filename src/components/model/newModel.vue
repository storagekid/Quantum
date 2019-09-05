<template>
  <q-card :id="'new-' + modelName" class="bg-white relative-position" style="minWidth: 80vw; overflow: visible">
    <q-card-section class="text-center bg-primary text-white">
      New Model
    </q-card-section>
    <q-card-section>
      <!-- <new-model-form-steps
        v-if="Object.keys(modelsNeeded).length === modelsFetched"
        :modelName="modelName"
        :quasarData="quasarData"
        v-on:formSent="changeStatus"
        v-on:formRespondedOK="closeModal"
        v-on:formRespondedWithErrors="changeStatus"
      >
      </new-model-form-steps> -->
      <new-model-form-steps
        :modelName="modelName"
        :quasarData="quasarData"
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
// import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'NewModel',
  components: { NewModelFormSteps },
  props: ['modelName', 'modelsNeeded', 'quasarData'],
  // mixins: [ModelsFetcher],
  data () {
    return {
      visible: false
    }
  },
  computed: {
    // ready () {
    //   if (Object.keys(this.modelsNeeded).length < 1) return true
    //   for (let model in this.modelsNeeded) {
    //     if (!this.$store.state.Model.models[model].items.length && !this.$store.state.Scope[this.$store.state.Scope.mode][model].items.length) return false
    //   }
    //   return true
    // }
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
