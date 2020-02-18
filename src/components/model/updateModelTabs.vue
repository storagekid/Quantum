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
        >
        <q-banner inline-actions dense class="col-xs-12 text-white bg-warning-dark q-py-none" v-if="batchMode">
          <template v-slot:avatar>
            <q-icon name="warning" color="white" />
          </template>
          <span class="text-bold">Actualización multiple.</span> ¿Ignorar campos vacios al actualizar?
          <template v-slot:action>
            <q-toggle color="white" v-model="ignoreEmptyfields"/>
          </template>
        </q-banner>
        <model-form
            :mode="mode"
            :batchMode="batchMode"
            :batchSource="source"
            :batchIgnoreEmptyFields="ignoreEmptyfields"
            :modelName="modelName"
            :model="model"
            :relation="relation"
            :quasarData="quasarData"
            :step="step"
            @dirtiness="checkDirtyness"
            @loading="$emit('loading')"
            @loaded="$emit('loaded')"
            @filesAdded="filesAdded"
            @restoreOriginalFile="restoreOriginalFile"
            @removeFieldFromForm="removeFieldFromForm"
          >
        </model-form>
        <div class="row">
          <q-btn color="primary" :label="$t('forms.actions.save')" class="q-mt-md full-width" @click="startUpdate" v-if="step.fields.length" :disable="saveNotReady"/>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import ModelForm from './modelForm'
import { ModelUpdaterBuilder, ModelController, ModelRelations, RelationController } from '../../mixins/modelMixin'

export default {
  name: 'UpdateModelTabs',
  props: ['source', 'modelName', 'quasarData', 'mode', 'batchMode', 'relation'],
  components: { ModelForm },
  mixins: [ ModelUpdaterBuilder, ModelController, ModelRelations, RelationController ],
  data () {
    return {
      tabName: 0,
      steps: {},
      model: {},
      ignoreEmptyfields: true
    }
  },
  computed: {
    saveNotReady () {
      if (this.batchMode && this.ignoreEmptyfields) return false
      return !this.cleanForm
    },
    modelIndex () {
      if (this.relation) return this.$store.state.Model.models[this.relation.name].items[this.relation.index][this.modelName].findIndex((i) => { return i.id === this.model.id })
      return this.$store.state.Model.models[this.modelName].items.findIndex((i) => { return i.id === this.model.id })
    },
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
    removeFieldFromForm (fieldName) {
      delete this.model[fieldName]
    },
    filesAdded (payload) {
      this.$set(this.model, payload.field, payload.files)
    },
    restoreOriginalFile (payload) {
      this.model[payload.field] = this.source[payload.field]
      this.model[payload.fileFieldName] = this.source[payload.fileFieldName]
    },
    startUpdate () {
      if (this.saveNotReady) return false
      else if (!this.relation) {
        this.$emit('formSent')
        let model = JSON.parse(JSON.stringify(this.model))
        if (this.batchMode && this.ignoreEmptyfields) {
          for (let field in model) {
            if (!model[field]) delete model[field]
          }
        }
        let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(model) }
        if (this.batchMode) {
          this.batchModel(payload, this.source).then(() => { this.$emit('formResponded') }).catch(() => { this.$emit('formRespondedWithErrors') })
        } else {
          this.saveModel(payload, 'update').then(() => { this.$emit('formResponded') }).catch(() => { this.$emit('formRespondedWithErrors') })
        }
      } else {
        this.$emit('formSent')
        let payload = this.buildRelationPayload({
          relatedTo: this.quasarData.nameSpace,
          relatedToID: this.model.id,
          relation: this.modelName,
          model: this.model,
          index: this.modelIndex,
          parentName: this.relation.name,
          parentNameSpace: this.$store.state.Model.models[this.relation.name].quasarData.nameSpace,
          parentIndex: this.relation.index,
          parentId: this.relation.id,
          id: this.model.id,
          quasarData: this.$store.state.Model.models[this.relation.name].quasarData.relations[this.modelName]
        })
        this.updateRelation(payload).then(() => {
          this.$emit('formResponded')
        }).catch(() => { this.$emit('formRespondedWithErrors') })
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
    this.model = this.buildUpdaterModel(this.source)
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
