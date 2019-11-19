<template>
  <q-card id="store-selector" class="bg-white relative-position">
    <q-card-section class="text-center bg-secondary text-primary">
      Ámbito (Locales)
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
          :field="{name: 'stores', type: { model: 'stores', default: { text: 'Selecciona una Clínica'} }}"
          :sourceOptions="stores"
          :initValue="storeSelected"
          @updated="updateCustomSelect('storeSelected', $event)"
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
import { customSelectMixins } from '../../mixins/customSelectMixins'

export default {
  name: 'StoreSelector',
  mixins: [customSelectMixins],
  components: { CustomSelect },
  data () {
    return {
      visible: false,
      countrySelected: [],
      storeSelected: []
    }
  },
  watch: {
    countriesIDs () {
      this.storeSelected = this.storeSelected.filter(i => { return this.countriesIDs.includes(i.country_id) })
    }
  },
  computed: {
    countriesText () {
      return `${this.countrySelected.length} ${this.countrySelected.length > 1 || !this.countrySelected.length ? 'seleccionados' : 'seleccionado'}`
    },
    clinicsText () {
      return `${this.storeSelected.length} ${this.storeSelected.length > 1 || !this.storeSelected.length ? 'seleccionadas' : 'seleccionada'}`
    },
    countriesIDs () {
      return this.countrySelected.map(i => { return i.id })
    },
    countries () {
      return this.$store.state.Model.models.countries.items
    },
    stores () {
      return this.$store.state.Model.models.stores.items.filter(i => { return this.countriesIDs.includes(i.country_id) })
    }
  },
  methods: {
    setScope () {
      let countries = []
      let stores = []
      if (this.countrySelected.length) {
        countries = this.countrySelected
      } else {
        countries = this.countries
      }
      if (this.storeSelected.length) {
        stores = this.storeSelected
      } else {
        stores = this.stores
      }
      let scope = { countries: countries, stores: stores }
      if (this.$store.state.Scope.mode !== 'store') this.$store.commit('Scope/setScopeMode', 'store')
      this.$store.commit('Scope/setScope', scope)
      this.$q.loading.show({
        delay: 400
      })
      this.$store.dispatch('Model/updateScopedModels')
        .then(() => {
          this.$q.loading.hide()
          this.$emit('StoreScopeSelected')
        }).catch(() => {
          this.$store.dispatch('Model/cleanScopedModels', scope).then(() => {
            this.$store.dispatch('Notify/displayMessage', { message: 'Too Many Stores Selected', position: 'top', type: 'warning' })
            this.$store.dispatch('Notify/displayMessage', { message: 'Please select less than 10 stores to retrieve models related', position: 'top', type: 'info' })
          })
          this.$q.loading.hide()
          this.$emit('StoreScopeSelected')
        })
    },
    initialScope () {
      // console.log('initialScope')
      if (this.$store.state.Scope.store.countries.selected.length) {
        this.countrySelected = this.$store.state.Scope.store.countries.selected
      }
      if (this.$store.state.Scope.store.stores.selected.length) {
        // console.log('Clinics.Selected')
        this.storeSelected = this.$store.state.Scope.store.stores.selected
      }
    }
  },
  created () {
    // console.log(this.$router.currentRoute.name)
    if (this.$store.state.Scope.store.stores.selected.length === 1 && this.$router.currentRoute.name === 'login') {
      // console.log('1 Clinic')
      if (localStorage.lastPage) {
        this.$router.push({
          name: this.$q.localStorage.getItem('lastPage')
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
