<template>
  <form v-if="quasarData">
    <div :class="['row', 'q-col-gutter-md', {'q-mt-md': mode !== 'filter'}]" v-for="(row, index) in step.fields" :key="'R'+index">
      <template
        v-for="(field, index) in row"
        >
        <div
          v-if="(!batchMode || (batchMode && field.batch)) && (mode !== 'filter' || (mode === 'filter') && model[field.name] !== undefined)"
          :key="'F'+index"
          class="col-xs-12 col-sm-4"
          :style="{'min-width': filterMode ? '300px' : ''}"
          >
          <q-input
            v-if="field.type.name === 'inputText'"
            icon="subject"
            :dense="isDense"
            :label-width="12"
            bottom-slots
            :error="$v.model[field.name].$error && !filterMode"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            :clearable="filterMode"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="text"
            :disable="viewMode"
            />
          <q-input
            v-if="field.type.name === 'password'"
            icon="subject"
            :dense="isDense"
            bottom-slots
            :error="$v.model[field.name].$error && !filterMode"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            :clearable="filterMode"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="password"
            :disable="viewMode"
            />
          <q-input
            v-if="field.type.name === 'number'"
            icon="subject"
            :dense="isDense"
            bottom-slots
            :error="$v.model[field.name].$error && !filterMode"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            :clearable="filterMode"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="number"
            :step="field.type.step ? field.type.step : 1"
            :disable="viewMode"
            />
          <q-input
            v-if="field.type.name === 'date'"
            mask="####-##-##"
            :dense="isDense"
            :rules="[]"
            bottom-slots
            :error="$v.model[field.name].$error && !filterMode"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            :clearable="filterMode"
            stack-label
            v-model="model[field.name]"
            :disable="viewMode"
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
            :customDisplay="true"
            :multiple="filterMode ? true : false"
            :dense="isDense"
            :clearable="clearable(field.name)"
            :field="field"
            :excludeModel="field.type.hasFamily && mode === 'update' ? getFamily() : false"
            :initValue="model[field.name]"
            :error="$v.model[field.name].$error && !filterMode"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            @updated="updateCustomSelect('model.' + field.name, ...arguments)"
            :disable="viewMode"
            >
          </custom-select>
          <q-select
            v-if="field.type.name === 'enum'"
            :dense="isDense"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error && !filterMode"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.type.default.text"
            :clearable="filterMode"
            stack-label
            v-model="model[field.name]"
            :options="field.type.array"
            :disable="viewMode"
          />
          <q-select
            v-if="field.type.name === 'array'"
            :dense="isDense"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error && !filterMode"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.type.default.text"
            :clearable="filterMode"
            stack-label
            v-model="model[field.name]"
            :options="field.type.array"
          />
          <form-file
            v-if="field.type.name === 'file'"
            :modelField="model"
            :relation="relation"
            :field="field"
            :viewMode="viewMode"
            :filterMode="filterMode"
            :modelName="modelName"
            :quasarData="quasarData"
            @filesAdded="filesAdded"
            @restoreOriginalFile="restoreOriginalFile"
            >
          </form-file>
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
        @restoreOriginalFile="restoreOriginalFile"
        >
      </relation-card>
    </template>
  </form>
</template>

<script>
import CustomSelect from '../form/customSelect'
import FormFile from '../form/formFile'
import { customSelectMixins } from '../../mixins/customSelectMixins'
import RelationCard from '../relation/relationCard'
import { FormMixins } from '../../mixins/formMixins'
import { FileMethods } from '../../mixins/fileMixin'

export default {
  name: 'ModelForm',
  mixins: [customSelectMixins, FormMixins, FileMethods],
  props: ['mode', 'modelName', 'model', 'relation', 'source', 'quasarData', 'step', 'batchMode', 'batchSource', 'dense'],
  components: { RelationCard, CustomSelect, FormFile },
  data () {
    return {
      relationName: null
    }
  },
  watch: {
    '$v.model.$anyError' () {
      this.$emit('dirtiness', { step: this.step.title, dirty: this.$v.model.$anyError })
    }
  },
  computed: {
    isDense () {
      if (this.dense !== 'undefined' || this.$q.platform.is.mobile) return true
      return false
    },
    viewMode () {
      return this.mode === 'display'
    },
    filterMode () {
      return this.mode === 'filter'
    }
  },
  methods: {
    clearable (field) {
      return this.filterMode || this.quasarData.rules[field].includes('nullable')
    },
    validateFromLaravel (rules, field) {
      let validations = {}
      for (let rule of rules) {
        if (typeof rule !== 'string') continue
        if (rule === 'required') {
          const { required } = require('vuelidate/lib/validators')
          validations = { ...validations, required }
        } else if (rule === 'unique') {
          if (this.mode === 'clone' && this.source) {
            let sourceValue = this.source[field].trim()
            const unique = (value) => value.trim() !== sourceValue
            validations = { ...validations, unique }
          }
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
          model[field] = this.validateFromLaravel(this.quasarData.rules[field], field)
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
