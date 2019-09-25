<template>
  <q-card id="clinic-selector" class="bg-white relative-position" style="overflow: visible">
    <q-card-section class="text-center bg-secondary text-primary">
      Ámbito (Clínicas)
    </q-card-section>
    <q-separator />
    <q-card-section>
      <form>
        <q-select
          multiple
          :display-value="countriesText"
          v-model="countrySelected"
          label="Selecciona un País"
          stack-label
          :options="countries"
        >
        <template v-slot:append>
          <q-icon name="clear" @click.stop="countrySelected = []" />
        </template>
        </q-select>
        <q-select
          multiple
          use-input
          input-debounce="0"
          @filter="filterState"
          :display-value="statesText"
          v-model="stateSelected"
          label="Selecciona una CCAA"
          stack-label
          :options="stateOptions"
        >
        <template v-slot:append>
          <q-icon name="clear" @click.stop="stateSelected = []" />
        </template>
        </q-select>
        <q-select
          multiple
          use-input
          input-debounce="0"
          @filter="filterCounty"
          :display-value="countiesText"
          v-model="countySelected"
          label="Selecciona una Provincia"
          stack-label
          :options="countyOptions"
        >
        <template v-slot:append>
          <q-icon name="clear" @click.stop="countySelected = []" />
        </template>
        </q-select>
        <q-select
          multiple
          use-input
          input-debounce="0"
          @filter="filterClinic"
          :display-value="clinicsText"
          v-model="clinicSelected"
          label="Selecciona una Clínica"
          stack-label
          :options="clinicOptions"
        >
        <template v-slot:append>
          <q-icon name="clear" @click.stop="clinicSelected = []" />
        </template>
        </q-select>
        <q-btn color="primary" label="Aceptar" class="q-mt-md full-width" @click="setScope"/>
      </form>
    </q-card-section>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
export default {
  name: 'ClinicSelector',
  data () {
    return {
      visible: false,
      clinicSelected: [],
      countrySelected: [],
      countySelected: [],
      stateSelected: [],
      stateOptions: null,
      countyOptions: null,
      clinicOptions: null
    }
  },
  computed: {
    clinicsText () {
      return `${this.clinicSelected.length > 0 ? this.clinicSelected.length : this.clinics.length} ${this.clinicSelected.length > 1 || !this.clinicSelected.length ? 'seleccionadas' : 'seleccionada'}`
    },
    countiesText () {
      return `${this.countySelected.length > 0 ? this.countySelected.length : this.counties.length} ${this.countySelected.length > 1 || !this.countySelected.length ? 'seleccionadas' : 'seleccionada'}`
    },
    statesText () {
      return `${this.stateSelected.length > 0 ? this.stateSelected.length : this.states.length} ${this.stateSelected.length > 1 || !this.stateSelected.length ? 'seleccionadas' : 'seleccionada'}`
    },
    countriesText () {
      return `${this.countrySelected.length > 0 ? this.countrySelected.length : this.countries.length} ${this.countrySelected.length > 1 || !this.countrySelected.length ? 'seleccionados' : 'seleccionado'}`
    },
    countriesIDs () {
      let ids = []
      this.countrySelected.map(i => { ids.push(i.id) })
      return ids
    },
    statesIDs () {
      let ids = []
      this.stateSelected.map(i => { ids.push(i.id) })
      return ids
    },
    countiesIDs () {
      let ids = []
      this.countySelected.map(i => { ids.push(i.id) })
      return ids
    },
    countries () {
      let countries = this.$store.state.Model.models.countries.items
      // let countries = this.countrySelected.length ? this.countrySelected : this.$store.state.Scope.clinic.countries.items
      return countries
    },
    states () {
      let states = this.$store.state.Model.models.states.items
      // let states = this.stateSelected.length ? this.stateSelected : this.$store.state.Scope.clinic.states.items
      if (this.countrySelected.length) {
        let vm = this
        states = states.filter(state => vm.countriesIDs.indexOf(state.country_id) !== -1)
      }
      return states
    },
    counties () {
      let counties = this.$store.state.Model.models.counties.items
      // let counties = this.countySelected.length ? this.countySelected : this.$store.state.Scope.clinic.counties.items
      if (this.stateSelected.length) {
        let vm = this
        counties = counties.filter(county => vm.statesIDs.indexOf(county.state_id) !== -1)
      } else if (this.countrySelected.length) {
        let vm = this
        counties = counties.filter(county => vm.countriesIDs.indexOf(county.state.country_id) !== -1)
      }
      return counties
    },
    clinics () {
      let clinics = this.$store.state.Model.models.clinics.items
      // let clinics = this.clinicSelected.length ? this.clinicSelected : this.$store.state.Scope.clinic.clinics.items
      if (this.countySelected.length) {
        let vm = this
        clinics = clinics.filter(clinic => vm.countiesIDs.indexOf(clinic.county_id) !== -1)
      } else if (this.stateSelected.length) {
        let vm = this
        clinics = clinics.filter(clinic => vm.statesIDs.indexOf(clinic.county.state_id) !== -1)
      } else if (this.countrySelected.length) {
        let vm = this
        clinics = clinics.filter(clinic => vm.countriesIDs.indexOf(clinic.county.state.country_id) !== -1)
      }
      return clinics
    }
  },
  methods: {
    filterState (val, update) {
      if (val === '') {
        update(() => {
          this.stateOptions = this.states
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.stateOptions = this.states.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterCounty (val, update) {
      if (val === '') {
        update(() => {
          this.countyOptions = this.counties
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.countyOptions = this.counties.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterClinic (val, update) {
      if (val === '') {
        update(() => {
          this.clinicOptions = this.clinics
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.clinicOptions = this.clinics.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    setScope () {
      let countries = []
      let states = []
      let counties = []
      let clinics = []
      if (this.countrySelected.length) {
        // countries = this.countrySelected
        this.countrySelected.map(i => { countries.push(i.id) })
      } else {
        this.countries.forEach(country => { countries.push(country.id) }, countries)
      }
      if (this.stateSelected.length) {
        // states = this.stateSelected
        this.stateSelected.map(i => { states.push(i.id) })
      } else {
        this.states.forEach(state => { if (countries.indexOf(state.country_id) !== -1) { states.push(state.id) } }, countries, states)
      }
      if (this.countySelected.length) {
        // counties = this.countySelected
        this.countySelected.map(i => { counties.push(i.id) })
      } else {
        this.counties.forEach(county => { if (states.indexOf(county.state_id) !== -1) { counties.push(county.id) } }, states, counties)
      }
      if (this.clinicSelected.length) {
        // clinics = this.clinicSelected
        this.clinicSelected.map(i => { clinics.push(i.id) })
      } else {
        this.clinics.forEach(clinic => { if (counties.indexOf(clinic.county_id) !== -1) { clinics.push(clinic.id) } }, counties, clinics)
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
      if (this.$store.state.Scope.clinic.clinics.selected.length) {
        this.clinicSelected = this.$store.state.Scope.clinic.clinics.items.filter(i => { return this.$store.state.Scope.clinic.clinics.selected.includes(i.id) })
      }
      if (this.$store.state.Scope.clinic.counties.selected.length) {
        this.countySelected = this.$store.state.Scope.clinic.counties.items.filter(i => { return this.$store.state.Scope.clinic.counties.selected.includes(i.id) })
      }
      if (this.$store.state.Scope.clinic.states.selected.length) {
        this.stateSelected = this.$store.state.Scope.clinic.states.items.filter(i => { return this.$store.state.Scope.clinic.states.selected.includes(i.id) })
      }
      if (this.$store.state.Scope.clinic.countries.selected.length) {
        this.countrySelected = this.$store.state.Scope.clinic.countries.items.filter(i => { return this.$store.state.Scope.clinic.countries.selected.includes(i.id) })
      }
      // if (this.$store.state.Scope.clinic.counties.selected) {
      //   this.countySelected = this.$store.state.Scope.clinic.counties.selected
      // }
      // if (this.$store.state.Scope.clinic.states.selected) {
      //   this.stateSelected = this.$store.state.Scope.clinic.states.selected
      // }
      // if (this.$store.state.Scope.clinic.countries.selected) {
      //   this.countrySelected = this.$store.state.Scope.clinic.countries.selected
      // }
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
  },
  mounted () {
    this.initialScope()
  }
}
</script>

<style>
</style>
