<template>
  <form v-if="quasarData">
    <div class="row q-col-gutter-md q-mt-md" v-for="(row, index) in step.fields" :key="'R'+index">
      <template
        v-for="(field, index) in row"
        >
        <div
          v-if="!batchMode || (batchMode && field.batch)"
          :key="'F'+index"
          class="col-xs-12 col-sm-4"
          >
          <q-input
            v-if="field.type.name === 'inputText'"
            icon="subject"
            :label-width="12"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="text"
            />
          <q-input
            v-if="field.type.name === 'password'"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="password"
            />
          <q-input
            v-if="field.type.name === 'date'"
            mask="####-##-##"
            :rules="[]"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            stack-label
            v-model="model[field.name]"
            >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" color="primary">
                <q-popup-proxy :ref="'qDateProxy-' + index" transition-show="scale" transition-hide="scale">
                  <q-date color="primary" v-model="model[field.name]" @input="hideDatePicker(index)" mask="YYYY-MM-DD"/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <custom-select
            v-if="field.type.name === 'select'"
            :field="field"
            :excludeModel="field.type.hasFamily && mode === 'update' ? getFamily() : false"
            :initValue="model[field.name]"
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            @updated="updateCustomSelect(field.name, ...arguments)"
            >
          </custom-select>
          <q-select
            v-if="field.type.name === 'enum'"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.type.default.text"
            stack-label
            v-model="model[field.name]"
            :options="field.type.array"
          />
          <q-select
            v-if="field.type.name === 'array'"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.type.default.text"
            stack-label
            v-model="model[field.name]"
            :options="field.type.array"
          />
        </div>
      </template>
    </div>
    <template flat v-for="(relation, index) in step.relations">
      <relation-card
        :key="'Rel'+index"
        :relationData="quasarData.relations[relation]"
        :model="model"
        :relatedTo="modelName"
        :modelData="quasarData"
        :mode="mode"
        :batchMode="batchMode"
        :batchSource="batchSource"
        v-on:multiUploadSent="showMultiUpload"
        v-on:multiUploadFileSuccess="multiUploadFileSuccess"
        v-on:multiUploadFileFailed="multiUploadFileFailed"
        v-on:multiUploadFinish="clearMultiUpload"
        >
      </relation-card>
    </template>
    <multi-upload-bars
      v-if="multiUpload.show"
      :opened="multiUpload.show"
      :items="multiUpload.items"
      >
    </multi-upload-bars>
    <q-dialog v-model="removeModel">
      <remove-model-confirm
        :modelQty="selectedItems.length"
        :name="relationName"
        :models="selectedItems"
        :relatedTo="modelName"
        :parentIndex="model.__index"
        v-on:confirmed="hideRemoveRelation"
        v-on:finished="finishRemoveRelation"
        >
      </remove-model-confirm>
    </q-dialog>
  </form>
</template>

<script>
import MultiUploadBars from '../loaders/multiUploadBars'
import RemoveModelConfirm from './removeModelConfirm'
import CustomSelect from '../form/customSelect'
import RelationCard from '../relation/relationCard'

export default {
  name: 'ModelForm',
  props: ['mode', 'modelName', 'model', 'quasarData', 'step', 'batchMode', 'batchSource'],
  components: { RemoveModelConfirm, RelationCard, MultiUploadBars, CustomSelect },
  data () {
    return {
      removeModel: false,
      relationName: null,
      multiUpload: {
        show: false,
        items: []
      },
      selectedItems: [],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 18 // current rows per page being displayed
      },
      filter: ''
    }
  },
  watch: {
    '$v.model.$anyError' () {
      this.$emit('dirtiness', { step: this.step.title, dirty: this.$v.model.$anyError })
    }
  },
  methods: {
    getFamily () {
      let ids = []
      if (this.batchSource.children) {
        this.batchSource.children.map(i => { ids.push(i.id) })
      }
      ids.push(this.model.id)
      return ids
    },
    hideDatePicker (index) {
      let picker = 'qDateProxy-' + index
      console.log(picker)
      this.$refs[picker][0].hide()
    },
    showMultiUpload (payload) {
      for (let item of payload.items) {
        this.$set(item, 'phase', 'waiting')
      }
      payload.items[0].phase = 'uploading'
      this.multiUpload.items = payload.items
      this.multiUpload.show = true
      // console.log(this.multiUpload.items)
    },
    multiUploadFileSuccess (payload) {
      this.multiUpload.items[payload.index].phase = 'success'
      if (payload.index < this.multiUpload.items.length - 1) {
        this.multiUpload.items[payload.index + 1].phase = 'uploading'
      }
    },
    multiUploadFileFailed (payload) {
      this.multiUpload.items[payload.index].done = 'failed'
      if (payload.index < this.multiUpload.items.length - 1) {
        this.multiUpload.items[payload.index + 1].phase = 'uploading'
      }
    },
    clearMultiUpload () {
      this.multiUpload.show = false
      this.multiUpload.items = []
    },
    getModelById (name, id) {
      if (this.$store.state.Model.models[name]) return this.$store.state.Model.models[name].items.filter(item => item.id === id)[0]
      return this.$store.state.Scope[this.$store.state.Scope.mode][name].items.filter(item => item.id === id)[0]
    },
    getErrors (field) {
      for (let param in field.$params) {
        if (!field[param]) {
          let error = 'forms.errors.' + param
          if (param === 'minLength') {
            return this.$t(error, { min: field.$params[param].min })
          } else if (param === 'maxLength') {
            return this.$t(error, { max: field.$params[param].max })
          }
          return this.$t(error)
        }
      }
    },
    showRemoveRelation (relation) {
      this.removeModel = true
      this.relationName = relation
    },
    hideRemoveRelation () {
      this.removeModel = false
    },
    finishRemoveRelation () {
      this.selectedItems = []
      this.relationName = null
    },
    getRelationListOptions (name) {
      if (this.$store.state.Model.models[name]) return this.$store.state.Model.models[name].items.filter(item => this.model[name].includes(item.id))
      else if (name === 'clinics') return this.$store.state.Scope.clinic[name].items.filter(item => this.model[name].includes(item.id))
      else if (name === 'stores') return this.$store.state.Scope.store[name].items.filter(item => this.model[name].includes(item.id))
    },
    updateCustomSelect (field, payload) {
      this.model[field] = payload
      this.$v.model[field].$touch()
    },
    validateFromLaravel (rules) {
      let validations = {}
      for (let rule of rules) {
        if (typeof rule !== 'string') continue
        if (rule === 'required') {
          const { required } = require('vuelidate/lib/validators')
          validations = { ...validations, required }
        } else if (rule.includes('min:')) {
          const { minLength } = require('vuelidate/lib/validators')
          let minValue = parseInt(rule.substring((rule.indexOf(':') + 1)))
          validations = { ...validations, minLength: minLength(minValue) }
        } else if (rule.includes('max:')) {
          const { maxLength } = require('vuelidate/lib/validators')
          let maxValue = parseInt(rule.substring((rule.indexOf(':') + 1)))
          validations = { ...validations, maxLength: maxLength(maxValue) }
        } else if (rule.includes('same:')) {
          const { sameAs } = require('vuelidate/lib/validators')
          let sameField = rule.substring((rule.indexOf(':') + 1))
          validations = { ...validations, sameAs: sameAs(sameField) }
        }
      }
      return validations
    }
  },
  validations () {
    let model = {}
    if (!this.step) return { model }
    for (let row of this.step.fields) {
      for (let field in row) {
        if (this.batchMode && !row[field].batch) continue
        if (this.quasarData.rules[field]) {
          model[field] = this.validateFromLaravel(this.quasarData.rules[field])
        }
      }
    }
    return { model }
  },
  mounted () {
    this.$v.$touch()
  }
}
</script>

<style>
</style>
