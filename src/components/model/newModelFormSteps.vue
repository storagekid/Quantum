<template>
  <q-stepper v-model="stepName" color="primary" ref="stepper" alternative-labels animated>
      <q-step
        v-for="(step, index) in quasarData.newLayout"
        :key="index"
        :name="index"
        :title="step.title"
        :caption="step.subtitle ? step.subtitle : ''"
        :icon="step.icon ? step.icon : 'account_box'"
        :done-icon="step.doneIcon ? step.doneIcon : 'check'"
        :active-icon="step.ActiveIcon ? step.ActiveIcon : 'account_box'"
        :error-icon="step.ErrorIcon ? step.ErrorIcon : 'account_box'"
        class="display-contents"
        style="display: contents">
        <model-form
          :mode="'new'"
          :modelName="modelName"
          v-on:dirtiness="checkDirtyness"
          v-on:fieldChanged="updateAndCheck"
          :model="model"
          :quasarData="quasarData"
          :step="step"
        >
        </model-form>
        <q-stepper-navigation>
          <q-btn color="primary" @click="$refs.stepper.next()" label="Siguiente" :disable="!cleanForm"/>
          <q-btn v-if="index > 0" color="primary" flat @click="$refs.stepper.previous()" label="Volver" />
        </q-stepper-navigation>
      </q-step>

      <q-step name="review" title="Revisar y guardar" icon="rate_review">
        <model-review
          :model="model"
          :quasarData="quasarData"
          >
        </model-review>
        <q-stepper-navigation default>
          <q-btn color="primary" flat @click="$refs.stepper.previous()" label="Volver" />
          <q-btn color="primary" :label="'Crear ' + $tc('models.' + modelName +'.name', 1) " class="q-mt-md full-width" @click="sendNewForm"/>
        </q-stepper-navigation>
      </q-step>
  </q-stepper>
</template>

<script>
import ModelForm from './modelForm'
import ModelReview from './modelReview'
import { ModelBuilder, ModelController } from '../../mixins/modelMixin'

export default {
  name: 'NewModelFormSteps',
  props: ['mode', 'modelName', 'quasarData'],
  components: { ModelForm, ModelReview },
  mixins: [ModelBuilder, ModelController],
  data () {
    return {
      stepName: 0,
      steps: {},
      model: {}
    }
  },
  computed: {
    cleanForm () {
      for (let step in this.steps) {
        if (this.steps[step].errors) return false
      }
      return true
    },
    clinics () {
      return this.$store.state.Scope.clinics.items
    }
  },
  methods: {
    checkDirtyness (payload) {
      // console.log(payload.step)
      // console.log(this.steps[payload.step].errors)
      this.steps[payload.step].errors = payload.dirty
    },
    updateAndCheck (payload) {
      this.model[payload.field] = payload.value
    },
    getModelById (name, id) {
      let model
      let items
      if (name === 'clinics') items = this.$store.state.Scope.clinic[name].items
      else if (name === 'stores') items = this.$store.state.Scope.store[name].items
      else items = this.$store.state.Model.models[name].items
      for (let item of items) {
        if (item.id === id) {
          model = item
          break
        }
      }
      return model
    },
    buildStepper (source = null) {
      for (let step of this.quasarData.newLayout) {
        this.$set(this.steps, step.title, {})
        this.$set(this.steps[step.title], 'errors', false)
      }
    }
  },
  created () {
    this.buildModel()
    this.buildStepper()
  }
}
</script>

<style>
  /* .display-contents > * {
     display: contents;
  }
  .display-contents > * > *{
     display: contents;
  } */
</style>
