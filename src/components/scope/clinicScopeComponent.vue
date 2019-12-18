<template>
  <q-card flat  id="clinic-selector" class="bg-white relative-position" style="overflow: visible">
    <q-card-section class="text-center bg-secondary text-primary q-py-sm">
      Ámbito (Clínicas)
    </q-card-section>
    <q-separator />
    <q-card-section>
        <custom-select
          :dense="true"
          :multiple="true"
          :customDisplay="countrySelected.length > 5 ? countriesText : false"
          :clearable="true"
          :hide-bottom-space="true"
          :field="{name: 'countries', type: { model: 'countries', default: { text: 'Selecciona un País'} }}"
          :sourceOptions="countries"
          :initValue="countrySelected"
          @updated="updateCustomSelect('countrySelected', $event)"
          >
        </custom-select>
        <custom-select
          :dense="true"
          :clearable="true"
          :multiple="true"
          :customDisplay="stateSelected.length > 5 ? statesText : false"
          :hide-bottom-space="true"
          :field="{name: 'states', type: { model: 'states', default: { text: 'Selecciona una CCAA'} }}"
          :sourceOptions="states"
          :initValue="stateSelected"
          :disable="!countrySelected.length"
          @updated="updateCustomSelect('stateSelected', $event)"
          >
        </custom-select>
        <custom-select
          :dense="true"
          :clearable="true"
          :multiple="true"
          :customDisplay="countySelected.length > 5 ? countiesText : false"
          :hide-bottom-space="true"
          :field="{name: 'counties', type: { model: 'counties', default: { text: 'Selecciona una Provincia'} }}"
          :sourceOptions="counties"
          :initValue="countySelected"
          :disable="!stateSelected.length"
          @updated="updateCustomSelect('countySelected', $event)"
          >
        </custom-select>
        <custom-select
          :dense="true"
          :clearable="true"
          :multiple="true"
          :customDisplay="clinicSelected.length > 5 ? clinicsText : false"
          :hide-bottom-space="true"
          :field="{name: 'clinics', type: { model: 'clinics', default: { text: 'Selecciona una Clínica'} }}"
          :sourceOptions="clinics"
          :initValue="clinicSelected"
          :disable="!countySelected.length"
          @updated="updateCustomSelect('clinicSelected', $event)"
          >
        </custom-select>
        <!-- <q-btn color="primary" label="Aceptar" class="q-mt-md full-width" @click="setScope"/> -->
    </q-card-section>
  </q-card>
</template>

<script>
import CustomSelect from '../form/customSelect'
import { customSelectMixins } from '../../mixins/customSelectMixins'

export default {
  name: 'ClinicScopeComponent',
  props: ['sourceClinics', 'storeScope'],
  mixins: [customSelectMixins],
  components: { CustomSelect },
  data () {
    return {
      visible: false,
      countriesSource: [],
      statesSource: [],
      countiesSource: [],
      clinicsSource: [],
      clinicSelected: [],
      countrySelected: [],
      countySelected: [],
      stateSelected: []
    }
  },
  watch: {
    countriesIDs () {
      this.stateSelected = this.stateSelected.filter(i => { return this.countriesIDs.includes(i.country_id) })
    },
    statesIDs () {
      this.countySelected = this.countySelected.filter(i => { return this.statesIDs.includes(i.state_id) })
    },
    countiesIDs () {
      this.clinicSelected = this.clinicSelected.filter(i => { return this.countiesIDs.includes(i.county_id) })
    },
    clinicSelected () {
      this.setScope()
    }
  },
  computed: {
    clinicsText () {
      return `${this.clinicSelected.length} ${this.clinicSelected.length > 1 || !this.clinicSelected.length ? 'seleccionadas' : 'seleccionada'}`
    },
    countiesText () {
      return `${this.countySelected.length} ${this.countySelected.length > 1 || !this.countySelected.length ? 'seleccionadas' : 'seleccionada'}`
    },
    statesText () {
      return `${this.stateSelected.length} ${this.stateSelected.length > 1 || !this.stateSelected.length ? 'seleccionadas' : 'seleccionada'}`
    },
    countriesText () {
      return `${this.countrySelected.length} ${this.countrySelected.length > 1 || !this.countrySelected.length ? 'seleccionados' : 'seleccionado'}`
    },
    countriesIDs () {
      return this.countrySelected.map(i => { return i.id })
    },
    statesIDs () {
      return this.stateSelected.map(i => { return i.id })
    },
    countiesIDs () {
      return this.countySelected.map(i => { return i.id })
    },
    clinicsIDs () {
      return this.clinicSelected.map(i => { return i.id })
    },
    countries () {
      return this.countriesSource
    },
    states () {
      return this.countrySelected.length
        ? this.statesSource.filter(i => { return this.countriesIDs.includes(i.country_id) })
        : this.statesSource
    },
    counties () {
      return this.stateSelected.length
        ? this.countiesSource.filter(i => { return this.statesIDs.includes(i.state_id) })
        : this.countiesSource
    },
    clinics () {
      return this.countySelected.length
        ? this.clinicsSource.filter(i => { return this.countiesIDs.includes(i.county_id) })
        : this.clinicsSource
    }
  },
  methods: {
    setScope () {
      let scope = {
        countries: this.countrySelected,
        states: this.stateSelected,
        counties: this.countySelected,
        clinics: this.clinicSelected,
        countriesIDs: this.countriesIDs,
        statesIDs: this.statesIDs,
        countiesIDs: this.countiesIDs,
        clinicsIDs: this.clinicsIDs
      }
      this.$emit('ClinicScopeSelected', scope)
    },
    initialScope () {
      if (this.countriesSource.length === 1) this.countrySelected = this.countriesSource
      if (this.statesSource.length === 1) this.stateSelected = this.statesSource
      if (this.countiesSource.length === 1) this.countySelected = this.countiesSource
      if (this.clinicsSource.length === 1) this.clinicSelected = this.clinicsSource
    }
  },
  created () {
    if (this.sourceClinics) {
      let clinics = this.$store.state.Scope.clinic.clinics.items.filter((i) => this.sourceClinics.includes(i.id))
      for (let clinic of clinics) {
        if (!this.countriesSource.find(i => i.id === clinic.county.state.country_id)) this.countriesSource.push(clinic.county.state.country)
        if (!this.statesSource.find(i => i.id === clinic.county.state_id)) this.statesSource.push(clinic.county.state)
        if (!this.countiesSource.find(i => i.id === clinic.county_id)) this.countiesSource.push(clinic.county)
      }
      this.clinicsSource = clinics
    } else {
      this.countriesSource = this.$store.state.Scope.clinic.countries.items
      this.statesSource = this.$store.state.Scope.clinic.states.items
      this.countiesSource = this.$store.state.Scope.clinic.counties.items
      this.clinicsSource = this.$store.state.Scope.clinic.clinics.items
    }
    if (this.storeScope) {
      this.countrySelected = Array.isArray(this.storeScope.countries) ? this.storeScope.countries : [this.storeScope.countries]
      this.stateSelected = Array.isArray(this.storeScope.states) ? this.storeScope.states : [this.storeScope.states]
      this.countySelected = Array.isArray(this.storeScope.counties) ? this.storeScope.counties : [this.storeScope.counties]
      this.clinicSelected = Array.isArray(this.storeScope.clinics) ? this.storeScope.clinics : [this.storeScope.clinics]
    }
    this.initialScope()
  }
}
</script>

<style>
</style>
