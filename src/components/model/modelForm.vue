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
            @updated="updateCustomSelect('model.' + field.name, ...arguments)"
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
        >
      </relation-card>
    </template>
  </form>
</template>

<script>
import CustomSelect from '../form/customSelect'
import { customSelectMixins } from '../../mixins/customSelectMixins'
import RelationCard from '../relation/relationCard'

export default {
  name: 'ModelForm',
  mixins: [customSelectMixins],
  props: ['mode', 'modelName', 'model', 'quasarData', 'step', 'batchMode', 'batchSource'],
  components: { RelationCard, CustomSelect },
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
  methods: {
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
