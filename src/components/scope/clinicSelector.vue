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
          :display-value="statesText"
          v-model="stateSelected"
          label="Selecciona una CCAA"
          stack-label
          :options="states"
        >
        <template v-slot:append>
          <q-icon name="clear" @click.stop="stateSelected = []" />
        </template>
        </q-select>
        <q-select
          multiple
          use-input
          input-debounce="0"
          :display-value="countiesText"
          v-model="countySelected"
          label="Selecciona una Provincia"
          stack-label
          :options="counties"
        >
        <template v-slot:append>
          <q-icon name="clear" @click.stop="countySelected = []" />
        </template>
        </q-select>
        <q-select
          multiple
          use-input
          input-debounce="0"
          :display-value="clinicsText"
          v-model="clinicSelected"
          label="Selecciona una Clínica"
          stack-label
          :options="clinics"
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
      if (this.$store.state.Scope.clinic.clinics.selected.length) {
        this.clinicSelected = this.$store.state.Scope.clinic.clinics.selected
      }
      if (this.$store.state.Scope.clinic.counties.selected.length) {
        this.countySelected = this.$store.state.Scope.clinic.counties.selected
      }
      if (this.$store.state.Scope.clinic.states.selected.length) {
        this.stateSelected = this.$store.state.Scope.clinic.states.selected
      }
      if (this.$store.state.Scope.clinic.countries.selected.length) {
        this.countrySelected = this.$store.state.Scope.clinic.countries.selected
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
  },
  mounted () {
    this.initialScope()
  }
}
</script>

<style>
</style>
