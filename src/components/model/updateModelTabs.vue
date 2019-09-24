<template>
  <div>
    <q-tabs animated align="justify" v-model="tabName" class="text-accent" active-color="primary">
      <q-tab
        v-for="(step, index) in quasarData.updateLayout"
        :key="'Tab'+index"
        :name="index"
        :icon="step.icon ? step.icon : 'subject'"
        />
    </q-tabs>
    <q-tab-panels v-model="tabName" class="display-inner-selects">
      <q-tab-panel
        v-for="(step, index) in quasarData.updateLayout"
        :key="'TabPane'+index"
        :name="index"
        class="q-pa-none"
        keep-alive
        style="display: contents"
        >
        <model-form
            :mode="mode"
            :batchMode="batchMode"
            :batchSource="source"
            :modelName="modelName"
            :model="model"
            :quasarData="quasarData"
            :step="step"
            v-on:dirtiness="checkDirtyness"
            v-on:loading="$emit('loading')"
            v-on:loaded="$emit('loaded')"
          >
        </model-form>
        <div class="row">
          <q-btn color="primary" label="Save Changes" class="q-mt-md full-width" @click="startUpdate" v-if="step.fields.length" :disable="steps[step.title].errors"/>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import ModelForm from './modelForm'
import { ModelUpdaterBuilder, ModelController } from '../../mixins/modelMixin'

export default {
  name: 'UpdateModelTabs',
  props: ['source', 'modelName', 'quasarData', 'mode', 'batchMode'],
  components: { ModelForm },
  mixins: [ModelUpdaterBuilder, ModelController],
  data () {
    return {
      tabName: 0,
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
    batchIDs () {
      let ids = []
      this.source.forEach((i) => { ids.push(i.id) })
      return ids
    }
  },
  methods: {
    startUpdate () {
      if (!this.cleanForm) return false
      else {
        this.$emit('formSent')
        let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(this.model) }
        if (this.batchMode) {
          this.batchModel(payload, this.source).then(() => { this.$emit('formResponded') }).catch(() => { this.$emit('formRespondedWithErrors') })
        } else {
          this.saveModel(payload, 'update').then(() => { this.$emit('formResponded') }).catch(() => { this.$emit('formRespondedWithErrors') })
        }
      }
    },
    checkDirtyness (payload) {
      this.steps[payload.step].errors = payload.dirty
    },
    buildStepper (source = null) {
      for (let step of this.quasarData.updateLayout) {
        this.$set(this.steps, step.title, {})
        this.$set(this.steps[step.title], 'errors', false)
      }
    }
  },
  created () {
    this.buildUpdaterModel(this.source)
    this.buildStepper()
  }
}
</script>

<style>
.display-inner-selects {
   overflow: visible;
 }
 .display-inner-selects > div {
   display: contents;
 }
</style>
