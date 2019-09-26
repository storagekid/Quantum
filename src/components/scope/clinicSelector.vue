<template>
  <q-card id="clinic-selector" class="bg-white relative-position" style="overflow: visible">
    <q-card-section class="text-center bg-secondary text-primary">
      Ámbito (Clínicas)
    </q-card-section>
    <q-separator />
    <q-card-section>
      <form>
        <custom-select
          :dense="true"
          :multiple="true"
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
          :hide-bottom-space="true"
          :field="{name: 'states', type: { model: 'states', default: { text: 'Selecciona una CCAA'} }}"
          :sourceOptions="states"
          :initValue="stateSelected"
          @updated="updateCustomSelect('stateSelected', $event)"
          >
        </custom-select>
        <custom-select
          :dense="true"
          :clearable="true"
          :multiple="true"
          :hide-bottom-space="true"
          :field="{name: 'counties', type: { model: 'counties', default: { text: 'Selecciona una Provincia'} }}"
          :sourceOptions="counties"
          :initValue="countySelected"
          @updated="updateCustomSelect('countySelected', $event)"
          >
        </custom-select>
        <custom-select
          :dense="true"
          :clearable="true"
          :multiple="true"
          :hide-bottom-space="true"
          :field="{name: 'clinics', type: { model: 'clinics', default: { text: 'Selecciona una Clínica'} }}"
          :sourceOptions="clinics"
          :initValue="clinicSelected"
          @updated="updateCustomSelect('clinicSelected', $event)"
          >
        </custom-select>
        <q-btn color="primary" label="Aceptar" class="q-mt-md full-width" @click="setScope"/>
      </form>
    </q-card-section>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
import CustomSelect from '../form/customSelect'
import { Helpers } from '../../mixins/helpers'

export default {
  name: 'ClinicSelector',
  mixins: [Helpers],
  components: { CustomSelect },
  data () {
    return {
      visible: false,
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
    countries () {
      return this.$store.state.Model.models.countries.items
    },
    states () {
      return this.$store.state.Model.models.states.items.filter(i => { return this.countriesIDs.includes(i.country_id) })
    },
    counties () {
      return this.$store.state.Model.models.counties.items.filter(i => { return this.statesIDs.includes(i.state_id) })
    },
    clinics () {
      return this.$store.state.Model.models.clinics.items.filter(i => { return this.countiesIDs.includes(i.county_id) })
    }
  },
  methods: {
    setScope () {
      let countries = []
      let states = []
      let counties = []
      let clinics = []
      if (this.countrySelected.length) {
        countries = this.countrySelected
      } else {
        countries = this.countries
      }
      if (this.stateSelected.length) {
        states = this.stateSelected
      } else {
        states = this.states
      }
      if (this.countySelected.length) {
        counties = this.countySelected
      } else {
        counties = this.counties
      }
      if (this.clinicSelected.length) {
        clinics = this.clinicSelected
      } else {
        clinics = this.clinics
      }
      let scope = { countries: countries, states: states, counties: counties, clinics: clinics }
      if (this.$store.state.Scope.mode !== 'clinic') this.$store.commit('Scope/setScopeMode', 'clinic')
      this.$store.commit('Scope/setScope', scope)
      this.$q.loading.show({
        delay: 400
      })
      this.$store.dispatch('Model/updateScopedModels')
        .then(() => {
          this.$q.loading.hide()
          this.$emit('ClinicScopeSelected')
        }).catch(() => {
          this.$store.dispatch('Model/cleanScopedModels', scope).then(() => {
            this.$store.dispatch('Notify/displayMessage', { message: 'Too Many Clinics Selected', position: 'top', type: 'warning' })
            this.$store.dispatch('Notify/displayMessage', { message: 'Please select less than 10 clinics to retrieve models related', position: 'top', type: 'info' })
          })
          this.$q.loading.hide()
          this.$emit('ClinicScopeSelected')
        })
    },
    initialScope () {
      // console.log('initialScope')
      if (this.$store.state.Scope.clinic.countries.selected.length) {
        this.countrySelected = this.$store.state.Scope.clinic.countries.selected
      }
      if (this.$store.state.Scope.clinic.states.selected.length) {
        this.stateSelected = this.$store.state.Scope.clinic.states.selected
      }
      if (this.$store.state.Scope.clinic.counties.selected.length) {
        this.countySelected = this.$store.state.Scope.clinic.counties.selected
      }
      if (this.$store.state.Scope.clinic.clinics.selected.length) {
        // console.log('Clinics.Selected')
        this.clinicSelected = this.$store.state.Scope.clinic.clinics.selected
      }
    }
  },
  created () {
    // console.log(this.$router.currentRoute.name)
    if (this.$store.state.Scope.clinic.clinics.selected.length === 1 && this.$router.currentRoute.name === 'login') {
      // console.log('1 Clinic')
      if (localStorage.lastPage) {
        this.$router.push({
          name: localStorage.lastPage
        })
      } else {
        this.$router.push({ name: this.$store.state.App.homePage })
      }
    }
    this.initialScope()
  }
}
</script>

<style>
</style>
