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
      <q-list>
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
    <model-form
      dense
      :mode="'filter'"
      :modelName="modelName"
      :model="filters.values"
      :quasarData="$store.state.Model.models[modelName].quasarData"
      :step="$store.state.Model.models[modelName].quasarData.updateLayout[0]"
      v-on:fieldChanged="updateAndCheck"
      >
    </model-form>
  </div>
</template>

<script>
import ModelForm from './modelForm'
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'ModelFilterMenu',
  components: { ModelForm },
  mixins: [ ModelsFetcher ],
  props: ['modelName', 'filters'],
  data () {
    return {}
  },
  methods: {
    sendFilters () {
      this.$emit('filtersUpdate')
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
  }
}
</script>
