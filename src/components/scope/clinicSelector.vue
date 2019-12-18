<template>
  <q-card>
    <q-card-section>
      <clinic-scope-component
        :storeScope="initialScope"
        @ClinicScopeSelected="updateScopeSelected"
        >
      </clinic-scope-component>
    </q-card-section>
    <q-card-section>
      <q-btn color="primary" label="Aceptar" class="full-width" @click="setScope" :disable="!scopeSelected.clinics.length">
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import ClinicScopeComponent from './clinicScopeComponent'
// import { customSelectMixins } from '../../mixins/customSelectMixins'

export default {
  name: 'ClinicSelector',
  // mixins: [customSelectMixins],
  components: { ClinicScopeComponent },
  data () {
    return {
      scopeSelected: { countries: [], states: [], counties: [], clinics: [] }
      // visible: false,
      // clinicSelected: [],
      // countrySelected: [],
      // countySelected: [],
      // stateSelected: []
    }
  },
  watch: {
    // countriesIDs () {
    //   this.stateSelected = this.stateSelected.filter(i => { return this.countriesIDs.includes(i.country_id) })
    // },
    // statesIDs () {
    //   this.countySelected = this.countySelected.filter(i => { return this.statesIDs.includes(i.state_id) })
    // },
    // countiesIDs () {
    //   this.clinicSelected = this.clinicSelected.filter(i => { return this.countiesIDs.includes(i.county_id) })
    // }
  },
  computed: {
    initialScope () {
      let initialScope = { countries: [], states: [], counties: [], clinics: [] }
      if (this.$store.state.Scope.clinic.countries.selected.length) {
        initialScope.countries = this.$store.state.Scope.clinic.countries.selected
      } else { initialScope.countries = this.$store.state.Scope.clinic.countries.items }
      if (this.$store.state.Scope.clinic.states.selected.length) {
        initialScope.states = this.$store.state.Scope.clinic.states.selected
      } else { initialScope.states = this.$store.state.Scope.clinic.states.items }
      if (this.$store.state.Scope.clinic.counties.selected.length) {
        initialScope.counties = this.$store.state.Scope.clinic.counties.selected
      } else { initialScope.counties = this.$store.state.Scope.clinic.counties.items }
      if (this.$store.state.Scope.clinic.clinics.selected.length) {
        initialScope.clinics = this.$store.state.Scope.clinic.clinics.selected
      } else { initialScope.clinics = this.$store.state.Scope.clinic.clinics.items[0] }
      return initialScope
    }
    // clinicsText () {
    //   return `${this.clinicSelected.length} ${this.clinicSelected.length > 1 || !this.clinicSelected.length ? 'seleccionadas' : 'seleccionada'}`
    // },
    // countiesText () {
    //   return `${this.countySelected.length} ${this.countySelected.length > 1 || !this.countySelected.length ? 'seleccionadas' : 'seleccionada'}`
    // },
    // statesText () {
    //   return `${this.stateSelected.length} ${this.stateSelected.length > 1 || !this.stateSelected.length ? 'seleccionadas' : 'seleccionada'}`
    // },
    // countriesText () {
    //   return `${this.countrySelected.length} ${this.countrySelected.length > 1 || !this.countrySelected.length ? 'seleccionados' : 'seleccionado'}`
    // },
    // countriesIDs () {
    //   return this.countrySelected.map(i => { return i.id })
    // },
    // statesIDs () {
    //   return this.stateSelected.map(i => { return i.id })
    // },
    // countiesIDs () {
    //   return this.countySelected.map(i => { return i.id })
    // },
    // countries () {
    //   return this.$store.state.Model.models.countries.items
    // },
    // states () {
    //   return this.countrySelected.length
    //     ? this.$store.state.Model.models.states.items.filter(i => { return this.countriesIDs.includes(i.country_id) })
    //     : this.$store.state.Model.models.states.items
    // },
    // counties () {
    //   return this.stateSelected.length
    //     ? this.$store.state.Model.models.counties.items.filter(i => { return this.statesIDs.includes(i.state_id) })
    //     : this.$store.state.Model.models.counties.items
    // },
    // clinics () {
    //   return this.countySelected.length
    //     ? this.$store.state.Model.models.clinics.items.filter(i => { return this.countiesIDs.includes(i.county_id) })
    //     : this.$store.state.Model.models.clinics.items
    // }
  },
  methods: {
    updateScopeSelected (e) {
      this.scopeSelected = { countries: e.countries, states: e.states, counties: e.counties, clinics: e.clinics }
    },
    setScope (e) {
      let scope = this.scopeSelected
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
    }
    // setScope () {
    //   let countries = []
    //   let states = []
    //   let counties = []
    //   let clinics = []
    //   if (this.countrySelected.length) {
    //     countries = this.countrySelected
    //   } else {
    //     countries = this.countries
    //   }
    //   if (this.stateSelected.length) {
    //     states = this.stateSelected
    //   } else {
    //     states = this.states
    //   }
    //   if (this.countySelected.length) {
    //     counties = this.countySelected
    //   } else {
    //     counties = this.counties
    //   }
    //   if (this.clinicSelected.length) {
    //     clinics = this.clinicSelected
    //   } else {
    //     clinics = this.clinics
    //   }
    //   let scope = { countries: countries, states: states, counties: counties, clinics: clinics }
    //   if (this.$store.state.Scope.mode !== 'clinic') this.$store.commit('Scope/setScopeMode', 'clinic')
    //   this.$store.commit('Scope/setScope', scope)
    //   this.$q.loading.show({
    //     delay: 400
    //   })
    //   this.$store.dispatch('Model/updateScopedModels')
    //     .then(() => {
    //       this.$q.loading.hide()
    //       this.$emit('ClinicScopeSelected')
    //     }).catch(() => {
    //       this.$store.dispatch('Model/cleanScopedModels', scope).then(() => {
    //         this.$store.dispatch('Notify/displayMessage', { message: 'Too Many Clinics Selected', position: 'top', type: 'warning' })
    //         this.$store.dispatch('Notify/displayMessage', { message: 'Please select less than 10 clinics to retrieve models related', position: 'top', type: 'info' })
    //       })
    //       this.$q.loading.hide()
    //       this.$emit('ClinicScopeSelected')
    //     })
    // },
    // initialScope () {
    //   let initialScope = { countries: [], states: [], counties: [], clinics: [] }
    //   if (this.$store.state.Scope.clinic.countries.selected.length) {
    //     initialScope.countries = this.$store.state.Scope.clinic.countries.selected
    //   } else { initialScope.countries = this.$store.state.Scope.clinic.countries.items }
    //   if (this.$store.state.Scope.clinic.states.selected.length) {
    //     initialScope.states = this.$store.state.Scope.clinic.states.selected
    //   } else { initialScope.states = this.$store.state.Scope.clinic.states.items }
    //   if (this.$store.state.Scope.clinic.counties.selected.length) {
    //     initialScope.counties = this.$store.state.Scope.clinic.counties.selected
    //   } else { initialScope.counties = this.$store.state.Scope.clinic.counties.items }
    //   if (this.$store.state.Scope.clinic.clinics.selected.length) {
    //     initialScope.clinics = this.$store.state.Scope.clinic.clinics.selected
    //   } else { initialScope.clinics = this.$store.state.Scope.clinic.clinics.items[0] }
    //   return initialScope
    // }
  },
  created () {
    // console.log(this.$router.currentRoute.name)
    if (this.$store.state.Scope.clinic.clinics.selected.length === 1 && this.$router.currentRoute.name === 'login') {
      // console.log('1 Clinic')
      if (localStorage.lastPage) {
        this.$router.push({
          name: this.$q.localStorage.getItem('lastPage')
        })
      } else {
        this.$router.push({ name: this.$store.state.App.homePage })
      }
    }
    // this.initialScope()
  }
}
</script>

<style>
</style>
