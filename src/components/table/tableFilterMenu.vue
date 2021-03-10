<template>
  <q-menu class="custom-table filter">
    <div class="q-pa-md bg-primary q-col-gutter-sm">
      <q-option-group
        dark
        class="row justify-between text-white text-bold"
        v-model="options"
        :options="[
          {label: 'Buscar', value: 'has'},
          {label: 'Únicos', value: 'uniques'},
          {label: 'Duplicados', value: 'clones'},
        ]"
        color="white"
        inline
        dense
      />
      <q-option-group
        dark
        class="row justify-between text-white text-bold"
        v-model="options"
        :options="[
          {label: 'Sí', value: 'some'},
          {label: 'No', value: 'empty'},
          {label: 'Seleccionar', value: 'in'}
        ]"
        color="white"
        inline
        dense
      />
    </div>
    <q-input
      v-model="text"
      class="q-px-md q-pb-md"
      debounce="800"
      v-if="!['empty', 'some', 'clones', 'uniques', 'select'].includes(options)"
      :disable="['empty', 'some', 'clones', 'uniques'].includes(options)"
      dense
      >
    </q-input>
    <div class="q-pa-md" v-if="options === 'in'">
      <div class="q-gutter-md text-center">
        <q-btn-group>
          <q-btn color="primary" size="sm" icon="arrow_downward" @click="filterInSort = 1"></q-btn>
          <q-btn color="primary" size="sm" icon="arrow_upward" @click="filterInSort = 0"></q-btn>
        </q-btn-group>
        <q-btn-group>
          <q-btn color="info" size="sm" label="Todo" @click="filterInSelectAll"></q-btn>
          <q-btn color="info" size="sm" label="Nada" @click="filterInSelectNone"></q-btn>
          <q-btn color="info" size="sm" label="Invertir" @click="filterInInvert"></q-btn>
        </q-btn-group>
      </div>
      <q-option-group
        v-model="filterInSelected"
        :options="filterInOptions"
        dense
        color="primary"
        type="checkbox"
        class="q-mt-md"
        style="max-height: 300px; overflow: auto"
      />
    </div>
  </q-menu>
</template>

<script>
import { searchMethods } from '../../mixins/tableMixin'

export default {
  name: 'TableFilterMenu',
  mixins: [searchMethods],
  props: ['column', 'models'],
  data () {
    return {
      filterInSelected: [],
      filterInSort: 0,
      text: '',
      options: 'has'
    }
  },
  watch: {
    'filterInSelected' () {
      this.$emit('filtersUpdated', { column: this.column.name, text: this.filterInSelected, options: this.options })
    },
    'text' () {
      this.$emit('filtersUpdated', { column: this.column.name, text: this.text, options: this.options })
    },
    'options' () {
      this.$emit('filtersUpdated', { column: this.column.name, text: this.text, options: this.options })
    }
  },
  computed: {
    filterInOptions () {
      let values = []
      let options = []
      for (let model of this.models) {
        let value = this.getItem(model, this.column.name, this.column)
        if (Array.isArray(value)) {
          for (let item of value) {
            if (typeof item === 'object') {
              if (!values.includes(item.label)) {
                values.push(item.label)
                let object = { label: item.label, value: item.label }
                options.push(object)
              }
            } else {
              if (!values.includes(item)) {
                values.push(item)
                let object = { label: item, value: item }
                options.push(object)
              }
            }
          }
        } else if (typeof value === 'object') {
          if (!values.includes(value.label)) {
            values.push(value.label)
            let object = { label: value.label, value: value.label }
            options.push(object)
          }
        } else if (!values.includes(value)) {
          values.push(value)
          let object = { label: value, value: value }
          options.push(object)
        }
      }
      let sorted = options.sort(function (a, b) {
        return a - b
      })
      return this.filterInSort ? sorted.reverse() : sorted
    }
  },
  methods: {
    filterInSelectAll () {
      this.filterInSelected = this.filterInOptions.map(i => { return i.label })
    },
    filterInSelectNone () {
      this.filterInSelected = []
    },
    filterInInvert () {
      let newOptions = []
      for (let option of this.filterInOptions) {
        if (!this.filterInSelected.includes(option.label)) newOptions.push(option.label)
      }
      this.filterInSelected = newOptions
    }
  },
  mounted () {
    console.log('Filter Menu Mounted')
  },
  created () {
    console.log('Filter Menu Created')
  }
}
</script>
