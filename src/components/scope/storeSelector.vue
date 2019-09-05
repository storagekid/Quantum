<template>
  <q-card id="store-selector" class="bg-white relative-position">
    <q-card-section class="text-center bg-secondary text-primary">
      Ámbito (Locales)
    </q-card-section>
    <q-separator />
    <q-card-section>
      <form>
        <q-select
          filter
          multiple
          chips
          clearable
          :display-value="countriesText"
          v-model="countrySelected"
          float-label="Selecciona un País"
          :options="countries"
        />
        <q-select
          filter
          multiple
          chips
          clearable
          :display-value="storesText"
          v-model="storeSelected"
          float-label="Selecciona un Local"
          :options="stores"
        />
        <q-btn color="primary" label="Aceptar" class="q-mt-md full-width" @click="setStoreScope"/>
      </form>
    </q-card-section>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      visible: false,
      countrySelected: [],
      storeSelected: []
    }
  },
  computed: {
    countriesText () {
      return `${this.countrySelected.length > 0 ? this.countrySelected.length : this.countries.length} ${this.countrySelected.length > 1 || !this.countrySelected.length ? 'seleccionados' : 'seleccionado'}`
    },
    storesText () {
      return `${this.storeSelected.length > 0 ? this.storeSelected.length : this.stores.length} ${this.storeSelected.length > 1 || !this.storeSelected.length ? 'seleccionados' : 'seleccionado'}`
    },
    countries () {
      let countries = this.$store.state.Scope.store.countries.items
      return countries
    },
    stores () {
      let stores = this.$store.state.Scope.store.stores.items
      if (this.countrySelected.length) {
        let vm = this
        stores = stores.filter(store => vm.countrySelected.indexOf(store.country_id) !== -1)
      }
      return stores
    }
  },
  methods: {
    setStoreScope () {
      let countries = []
      let stores = []
      if (this.countrySelected.length) {
        countries = this.countrySelected
      } else {
        this.countries.forEach(country => { countries.push(country.id) }, countries)
      }
      if (this.storeSelected.length) {
        stores = this.storeSelected
      } else {
        this.stores.forEach(store => { if (countries.indexOf(store.country_id) !== -1) { stores.push(store.id) } }, countries, stores)
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
        })
    },
    initialScope () {
      if (this.$store.state.Scope.store.stores.selected) {
        this.storeSelected = this.$store.state.Scope.store.stores.selected
      }
      if (this.$store.state.Scope.store.countries.selected) {
        this.countrySelected = this.$store.state.Scope.store.countries.selected
      }
    }
  },
  created () {
  },
  mounted () {
    this.initialScope()
  }
}
</script>

<style>
</style>
