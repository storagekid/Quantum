<template>
  <q-stepper v-model="stepName" color="primary" ref="stepper" flat swipeable alternative-labels animated>
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
        >
        <model-form
          :mode="'new'"
          :modelName="modelName"
          v-on:dirtiness="checkDirtyness"
          v-on:fieldChanged="updateAndCheck"
          v-on:filesAdded="filesAdded"
          :model="model"
          :quasarData="quasarData"
          :step="step"
        >
        </model-form>
        <q-stepper-navigation>
          <q-btn v-if="index > 0" color="primary" flat @click="$refs.stepper.previous()" :label="$t('navigation.previous')" />
          <q-btn color="primary" @click="$refs.stepper.next()" :label="$t('navigation.next')" :disable="!cleanForm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step name="relationsToClone" title="Relaciones" icon="compare_arrows" v-if="mode === 'clone' && relations.length">
        <p class="text-center">Would you like to clone relations too?</p>
        <div class="text-center">
          <q-btn-group>
            <q-btn
              label="All"
              color="primary"
              @click="selectAllRelations"
              >
            </q-btn>
            <q-btn
              label="None"
              color="secondary"
              text-color="primary"
              @click="relationsSelected = []"
              >
            </q-btn>
          </q-btn-group>
          <q-option-group
            class="q-mt-md"
            v-model="relationsSelected"
            :options="relations"
            keep-color
            color="primary"
            type="toggle"
          />
        </div>
        <q-stepper-navigation default>
          <q-btn color="primary" flat @click="$refs.stepper.previous()" :label="$t('navigation.previous')" />
          <q-btn color="primary" @click="$refs.stepper.next()" :label="$t('navigation.next')" :disable="!cleanForm"/>
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
          <q-btn color="primary" :label="'Crear ' + $tc('models.' + modelName +'.name', 1) " class="q-mt-md full-width" @click="startSaving"/>
        </q-stepper-navigation>
      </q-step>
  </q-stepper>
</template>

<script>
import ModelForm from './modelForm'
import ModelReview from './modelReview'
import { ModelBuilder, ModelUpdaterBuilder, ModelController, ModelRelations, RelationController } from '../../mixins/modelMixin'

export default {
  name: 'NewModelFormSteps',
  props: ['mode', 'modelName', 'quasarData', 'relation', 'source'],
  components: { ModelForm, ModelReview },
  mixins: [ModelBuilder, ModelUpdaterBuilder, ModelController, ModelRelations, RelationController],
  data () {
    return {
      stepName: 0,
      steps: {},
      model: {},
      relationsSelected: []
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
    },
    uniqueFields () {
      let fields = []
      for (let field in this.quasarData.rules) {
        if (this.quasarData.rules[field].includes('unique')) fields.push(field)
      }
      return fields
    },
    relations () {
      if (Object.keys(this.quasarData.relations).length) {
        let options = []
        for (let relation in this.quasarData.relations) options.push({ label: this.$tc('models.' + relation + '.name', 2), value: relation })
        return options
      }
      return []
    }
  },
  methods: {
    filesAdded (payload) {
      this.model[payload.field] = payload.files[0]
    },
    selectAllRelations () {
      this.relationsSelected = this.relations.map(i => i.value)
    },
    startSaving () {
      if (!this.cleanForm) return false
      this.$emit('formSent')
      if (!this.relation) {
        let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(this.model) }
        if (this.mode === 'clone') {
          payload.options = { relationsToClone: this.relationsSelected, sourceModel: this.model.id }
          payload.model.id = null
        }
        this.saveModel(payload, 'new').then(() => { this.$emit('formRespondedOK') }).catch(() => { this.$emit('formRespondedWithErrors') })
      } else {
        let payload = this.buildRelationPayload({
          relatedTo: this.quasarData.nameSpace,
          relation: this.modelName,
          model: this.model,
          index: false,
          parentName: this.relation.name,
          parentNameSpace: this.$store.state.Model.models[this.relation.name].quasarData.nameSpace,
          parentIndex: this.relation.index,
          parentId: this.relation.id,
          id: this.model['id'],
          quasarData: this.$store.state.Model.models[this.relation.name].quasarData.relations[this.modelName]
        })
        this.mode === 'update'
          ? this.updateRelation(payload).then(() => { this.$emit('formRespondedOK') }).catch(() => { this.$emit('formRespondedWithErrors') })
          : this.saveRelation(payload).then(() => { this.$emit('formRespondedOK') }).catch(() => { this.$emit('formRespondedWithErrors') })
      }
    },
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
    if (this.mode === 'clone' && this.source) this.model = this.buildUpdaterModel(this.source)
    else this.model = this.buildModel()
    this.buildStepper()
  }
}
</script>
