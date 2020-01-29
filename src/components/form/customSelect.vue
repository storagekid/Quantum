<template>
  <q-select
    :dense="dense"
    :multiple="multiple"
    :hide-bottom-space="hideBottomSpace"
    :clearable="clearable"
    bottom-slots
    :disable="disable"
    :counter="counter"
    :max-values="max ? max : sourceOptions ? sourceOptions.length : undefined"
    :error="error"
    :error-message="errorMessage"
    :name="field ? field.name : relation"
    use-input
    :label="field ? field.type.default.text : relation"
    stack-label
    v-model="value"
    :options="filteredOptions"
    @filter="!relation ? filterFn({name: field.type.model}, ...arguments) : filterFn({ name: field ? field.type.model : relation, key: field ? field.type.filterKey : relation, relation: relation }, ...arguments)"
    @filter-abort="abortFilteredOptions"
    @clear="clearSelected"
    >
    <template slot="prepend">
      <q-icon name="subject"></q-icon>
    </template>
    <template v-slot:append v-if="multiple && options">
      <q-btn size="md" color="primary" icon="select_all" flat dense @click="selectAll"></q-btn>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected v-if="customDisplay && value.length > 1">
      <q-chip square size="md" color="secondary" class="">
        <q-avatar icon="bookmark" size="xs" color="primary" text-color="white" />
        {{ customDisplayText }}
      </q-chip>
    </template>
  </q-select>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: ['field', 'initValue', 'model', 'relation', 'error', 'errorMessage', 'relationType', 'clearable', 'dense', 'hideBottomSpace', 'customDisplay', 'multiple', 'sourceOptions', 'all', 'counter', 'max', 'disable', 'excludeModel'],
  data () {
    return {
      options: this.sourceOptions ? this.sourceOptions : null,
      filteredOptions: null,
      value: this.multiple ? this.all ? this.sourceOptions : [] : null
    }
  },
  watch: {
    value () {
      if (this.value !== this.initValue) this.$emit('updated', this.value)
    },
    initValue () {
      this.value = this.multiple ? this.initValue ? Array.isArray(this.initValue) ? this.initValue : [this.initValue] : [] : this.initValue
    },
    all () {
      if (this.all) this.value = this.options
    },
    sourceOptions () {
      this.options = this.sourceOptions
    }
  },
  computed: {
    customDisplayText () {
      let text = ''
      if (this.customDisplay && this.customDisplay !== true) text = this.customDisplay
      else text = `${this.value.length} ${this.value.length > 1 || !this.value.length ? 'seleccionados' : 'seleccionado'}`
      // else text = 'patata'
      return text
    }
  },
  methods: {
    clearSelected () {
      this.value = this.multiple ? [] : ''
    },
    selectAll () {
      this.value = this.filteredOptions ? this.filteredOptions : this.options
    },
    filterFn ({ name, key = null, relation = null }, val, update, abort) {
      // console.log('filtering')
      // console.log(key)
      if (!this.options) {
        // console.log('No Options')
        let filterRelation = this.relation ? { 'key': key, 'relation': relation } : false
        let options
        if (this.relationType) {
          if (this.relationType === 'BelongsToMany') options = this.getOptions(name, false, false, this.relationType)
        } else options = this.getOptions(name, false, filterRelation, this.relationType)
        options.then(() => { update() })
        options.catch((error) => { this.$store.dispatch('Response/responseErrorManager', error.response) })
      } else {
        // console.log('Options Found')
        // console.log(this.options)
        if (val === '') {
          this.filteredOptions = this.options
          update()
        } else {
          const needle = val.toLowerCase()
          this.filteredOptions = this.options.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          update()
        }
      }
    },
    abortFilteredOptions () {
      // console.log('delayed filter aborted')
    },
    getOptions (name, filter = false, filterRelation = false, relationType = false) {
      return new Promise((resolve, reject) => {
        // console.log('getting Opions')
        let models = []
        if (this.$store.state.Model.models[name]) models = this.$store.state.Model.models[name].items
        else if (name === 'clinics') models = this.$store.state.Scope.clinic[name].items
        else if (name === 'stores') models = this.$store.state.Scope.store[name].items
        else if (this.$store.state.Scope[this.$store.state.Scope.mode][name]) models = this.$store.state.Scope[this.$store.state.Scope.mode][name].items
        if (filter && models.length) models = models.filter(model => !this.model[filter].includes(model.id))
        if (filterRelation) {
          let owned = []
          this.model[filterRelation.relation].map(model => owned.push(model[filterRelation.key]))
          models = models.filter(model => !owned.includes(model.id))
        }
        if (!models.length) {
          // console.log('getThem')
          this.$store.dispatch('Model/getModel', {
            'model': name,
            'options': {}
          }).then(() => {
            models = this.$store.state.Model.models[name].items
            if (filterRelation) {
              let owned = []
              this.model[filterRelation.relation].map(model => owned.push(model[filterRelation.key]))
              models = models.filter(model => !owned.includes(model.id))
            }
            this.options = models
            this.filteredOptions = models
            resolve()
          }).catch((error) => {
            reject(error)
          })
        } else {
          if (this.excludeModel) models = models.filter(model => !this.excludeModel.includes(model.id))
          this.options = models
          this.filteredOptions = models
          resolve()
        }
      })
    }
  },
  mounted () {
    this.value = this.multiple ? this.initValue ? Array.isArray(this.initValue) ? this.initValue : [this.initValue] : [] : this.initValue
  }
}
</script>

<style>
</style>
