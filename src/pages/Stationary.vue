<template>
  <q-page class="q-pa-md">
    <div class="row justify-center q-gutter-lg">
      <template v-if="stationaryReady">
        <div class="col-10">
          <div class="text-primary text-h5 text-center q-mb-md">Materiales Clínica</div>
          <div class="row q-col-gutter-lg justify-center" v-if="stationaryReady">
            <div
              v-for="storeable in stationaryGrouped.storeable"
              :key="storeable.id"
              class="col-xs-12 col-sm-4 col-md-3 col-lg-2"
              @click="shoppingCartToggle(storeable, 'storeables')"
              >
              <orderable-product
                :orderable="storeable"
                category="storeables"
                >
              </orderable-product>
            </div>
          </div>
          <div v-if="can('Marketing', 'create')" class="text-center q-gutter-md q-mt-md">
            <q-btn
              v-if="stationaryGrouped.storeable.length !== stationaryGrouped.clinicStationaryCompleted"
              color="primary"
              label="Generar Materiales"
              class=""
              @click="generateStationary(false)"
              >
            </q-btn>
            <q-btn
              v-if="can('Marketing', 'edit')"
              color="warning-dark"
              label="Regenerar Materiales"
              class=""
              @click="generateStationary(true)"
              >
            </q-btn>
          </div>
        </div>
      </template>
      <div class="col-10 q-gutter-md">
        <div class="text-primary text-h5 text-center q-mb-md">Materiales Genéricos</div>
        <div class="row q-col-gutter-lg justify-center">
          <div
            v-for="clinicProduct in stationaryGrouped.unstoreable"
            :key="clinicProduct.id"
            class="col-xs-12 col-sm-2"
            @click="shoppingCartToggle(clinicProduct, 'unstoreables')"
            >
            <orderable-product
              :orderable="clinicProduct"
              category="unstoreables"
              >
            </orderable-product>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'
import { PageMixins } from '../mixins/pageMixins'
import { StationaryMixins } from '../mixins/stationaryMixins'
import OrderableProduct from '../components/products/orderableProduct'

export default {
  name: 'stationary',
  mixins: [ModelsFetcher, PageMixins, StationaryMixins],
  components: { OrderableProduct },
  data () {
    return {
      modelName: 'products',
      modelsNeeded: {
        products: {
          refresh: true,
          orderBy: 'description',
          full: true
        }
      }
    }
  },
  computed: {
  },
  methods: {
    generateStationary (force = false) {
      this.$q.loading.show()
      let actionPayload = {}
      actionPayload.url = this.$store.state.App.dataWarehouse + 'clinics/' + this.scopeClinic.id + '/generateStationaries'
      actionPayload.method = 'POST'
      actionPayload.params = {
        view: 'stationary',
        force: force
      }
      this.$axios({
        url: actionPayload.url,
        method: actionPayload.method,
        params: actionPayload.params
      }).then((response) => {
        this.$q.loading.hide()
        this.clinic = response.data.model
        this.$store.commit('Model/updateModelItems', { name: 'clinics', item: response.data.model })
        this.$store.dispatch('Notify/displayMessage', { message: 'Stationaries Generated Successfuly', position: 'top', type: 'positive' })
      }).catch((response) => {
        this.$q.loading.hide()
        this.$store.dispatch('Notify/displayMessage', { message: 'Action Failed', position: 'top', type: 'negative' })
      })
      return true
    }
  },
  created () {
    this.$store.commit('ShoppingCart/setCategory', { name: 'unstoreables', model: 'products', headerText: 'Papelería Corporativa', itemKey: 'description' })
    this.$store.commit('ShoppingCart/setCategory', { name: 'storeables', model: 'products', headerText: 'Papelería Corporativa (Clínica)', itemKey: 'description' })
  }
}
</script>

<style lang="stylus">
</style>
