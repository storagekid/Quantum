<template>
  <q-page :class="[pageContainerClasses]">
    <model-table
      :sticky="true"
      :virtualScroll="true"
      :modelName="modelName"
      :getModelView="true"
      :modelsNeeded="modelsNeeded"
      :editAferCreate="true"
      :dense="true"
      v-show="!show"
      v-on:show="toggleShow"
      v-if="modelsReady"
      startFilter="&&Activa!="
      >
      <template slot="body-cell-addresses" slot-scope="item" :item="item">
        <div v-for="(address, index) in item.item" :key="index">
            <span class="text-bold text-italic text-caption">{{ address.type }} -</span> {{ address.address_line_1 }} {{ address.address_line_2 !== 'NULL' ? address.address_line_2 : '' }}
        </div>
      </template>
      <template slot="body-cell-phones" slot-scope="item" :item="item">
        <div v-for="(phone, index) in item.item" :key="index">
            <span class="text-bold text-italic text-caption">{{ phone.type }} -</span> {{ phone.number }}
        </div>
      </template>
      <template slot="body-cell-clinic_siblings" slot-scope="item" :item="item">
        <div v-for="(sibling, index) in item.item" :key="index">
            <span class="text-bold text-italic text-caption">{{ $store.state.Model.models.clinics.items.filter(i => { return i.id === sibling.sibling_id })[0].label }}</span>
            <span class="text-bold text-italic text-caption text-red"> - {{ sibling.type }}</span>
        </div>
      </template>
    </model-table>
    <clinic-view v-if="show" :id="show"></clinic-view>
  </q-page>
</template>

<script>

import { PageMixins } from '../mixins/pageMixins'
import { ModelsFetcher } from '../mixins/modelMixin'
import ClinicView from '../components/clinic/ClinicView'

export default {
  name: 'ClinicsPage',
  mixins: [ModelsFetcher, PageMixins],
  components: { ClinicView },
  data () {
    return {
      modelName: 'clinics',
      show: null,
      modelsNeeded: {
        clinics: {
          full: true,
          refresh: true,
          withTrashed: true,
          orderBy: 'city',
          appends: ['open']
        }
      }
    }
  },
  methods: {
    toggleShow (payload) {
      this.show = payload
    }
  }
}
</script>

<style>
</style>
