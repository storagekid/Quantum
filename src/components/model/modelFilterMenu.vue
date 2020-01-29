<template>
  <div id="table-scope" class="row q-gutter-md items-center justify-center">
    <q-btn-dropdown
      split
      size="sm"
      color="primary"
      no-caps
      class="q-mt-none"
      icon="filter_list"
      label="Filtrar"
      @click="sendFilters"
    >
      <q-list v-if="model.starts_at">
        <q-item clickable v-close-popup @click="setMonths(0)">
          <q-item-section avatar>
            <q-icon name="calendar_today" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Este Mes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="setMonths(2)">
          <q-item-section avatar>
            <q-icon name="calendar_today" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Últimos 3 Mese</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="setMonths(5)">
          <q-item-section avatar>
            <q-icon name="calendar_today" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Últimos 6 Mese</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="setMonths(11)">
          <q-item-section avatar>
            <q-icon name="calendar_today" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Último Año</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <template v-if="formModels.length">
      <div v-for="formModel in formModels" :key="'form' + formModel">
        <model-form
          dense
          :mode="'filter'"
          :modelName="formModel"
          :model="model"
          :quasarData="$store.state.Model.models[formModel].quasarData"
          :step="$store.state.Model.models[formModel].quasarData.updateLayout[0]"
          v-on:fieldChanged="updateAndCheck"
          >
        </model-form>
      </div>
    </template>
    <template v-if="selectModels.length">
      <div v-for="(selectModel, index) in selectModels" :key="'select' + index">
        <custom-select
          :dense="true"
          :multiple="selectModel.multi"
          :customDisplay="true"
          :hide-bottom-space="true"
          :field="{name: selectModel.model, type: { model: selectModel.model, default: { text: 'Selecciona un@ ' + selectModel.model } }}"
          :clearable='true'
          :initValue="selects[selectModel.model]"
          @updated="updateCustomSelect('selects.' + selectModel.model, $event)"
          >
        </custom-select>
      </div>
    </template>
  </div>
</template>

<script>
import ModelForm from './modelForm'
import CustomSelect from '../form/customSelect'
import { ModelsFetcher } from '../../mixins/modelMixin'
import { customSelectMixins } from '../../mixins/customSelectMixins'

export default {
  name: 'ModelFilterMenu',
  components: { ModelForm, CustomSelect },
  mixins: [ ModelsFetcher, customSelectMixins ],
  props: ['modelName', 'filters', 'formModels', 'selectModels'],
  data () {
    return {
      model: {},
      selects: {}
    }
  },
  watch: {
    model: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        this.$emit('filtersUpdated', { model: this.modelName, values: newVal })
      }
    },
    selects: {
      deep: true,
      handler (newVal, oldVal) {
        this.$emit('selectsUpdated', { model: this.modelName, values: newVal })
      }
    }
  },
  computed: {
  },
  methods: {
    sendFilters () {
      this.$emit('updateFilters')
    },
    updateAndCheck (payload) {
      this.filters.values[payload.field] = payload.value
    },
    setMonths (count) {
      let date = new Date()
      date.setMonth(date.getMonth() - count)
      this.filters.values['starts_at'] = this.dateString('first', date)
      this.filters.values['ends_at'] = this.dateString('last')
    }
  },
  created () {
    for (let value in this.filters.values) {
      let lastStep = null
      if (value.indexOf('.') > -1) {
        // console.log(value)
        let levels = value.split('.')
        lastStep = levels[levels.length - 1]
        // console.log(lastStep)
        if (lastStep.indexOf('_id') > -1) {
          let check = lastStep.substring(0, lastStep.indexOf('_id'))
          // console.log(check)
          if (check === this.modelName) this.$set(this.model, 'id', this.filters.values[value])
          else if ((check + 's') === this.modelName) this.$set(this.model, 'id', this.filters.values[value])
          else this.$set(this.model, lastStep, this.filters.values[value])
        } else this.$set(this.model, lastStep, this.filters.values[value])
      } else this.$set(this.model, value, this.filters.values[value])
      // console.log(this.filters.values[value])
      // console.log(this.filters.values[value][0].indexOf('#'))
      // console.log(value)
      if (!this.filters.values[value]) continue
      if (this.filters.values[value].length) {
        if (this.filters.values[value][0].indexOf('#') > -1) {
          // console.log('Yes')
          let field = lastStep || value
          this.model[field] = []
        }
      }
    }
    for (let selectModel of this.selectModels) {
      this.$set(this.selects, selectModel.model, selectModel.multi ? [] : null)
    }
  }
}
</script>
