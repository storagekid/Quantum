<template>
    <q-toolbar-title class="text-center">
      <q-btn
        icon="swap_horiz"
        icon-right="domain"
        v-if="$store.state.Scope.store.stores.items.length && (mode === 'clinic')"
        @click="openStoreSelector = true"
      />
      <template v-if="mode === 'store'">
        <q-btn
          @click="openStoreSelector = true"
          :disabled="$store.state.Scope.store.stores.items.length === 1"
        >
          <q-toolbar-title v-if="!storeSelected">{{storeText}}</q-toolbar-title>
          <q-toolbar-title v-else>
            {{storeSelected.name}}
            <span slot="subtitle">
              {{storeSelected.description}}
            </span>
          </q-toolbar-title>
        </q-btn>
      </template>
      <template v-else-if="mode === 'clinic'">
        <q-btn
          @click="openSelector = true"
          :disabled="$store.state.Scope.clinic.clinics.items.length === 1"
          class="q-py-sm"
        >
          <q-toolbar-title v-if="!clinicSelected">{{text}}</q-toolbar-title>
          <q-toolbar-title v-else>
            {{clinicSelected.city}}
            <div class="text-caption">
              {{clinicSelected.address_real_1}}
            </div>
          </q-toolbar-title>
        </q-btn>
      </template>
      <q-btn
        icon="swap_horiz"
        icon-right="store_mall_directory"
        v-if="$store.state.Scope.clinic.clinics.items.length && (mode === 'store')"
        @click="openSelector = true"
      />
      <q-dialog v-model="openStoreSelector">
        <store-selector v-on:StoreScopeSelected="openStoreSelector = false"></store-selector>
      </q-dialog>
      <q-dialog v-model="openSelector">
        <clinic-selector v-on:ClinicScopeSelected="openSelector = false"></clinic-selector>
      </q-dialog>
    </q-toolbar-title>
</template>

<script>
import ClinicSelector from './clinicSelector'
import StoreSelector from './storeSelector'

export default {
  name: 'ScopeTopBar',
  components: { ClinicSelector, StoreSelector },
  data () {
    return {
      openSelector: false,
      openStoreSelector: false
    }
  },
  computed: {
    text () {
      return this.$store.getters['Scope/scopeText']
    },
    clinicSelected () {
      return this.$store.getters['Scope/clinicSelected']
    },
    storeText () {
      return this.$store.getters['Scope/scopeStoreText']
    },
    storeSelected () {
      return this.$store.getters['Scope/storeSelected']
    },
    mode () {
      return this.$store.state.Scope.mode
    }
  }
}
</script>

<style>
</style>
