<template>
  <div>
    <q-btn dense glossy color="secondary" text-color="primary" icon="shopping_cart" :loading="loading">
        <transition
          appear
          enter-active-class="animated bounceIn"
          leave-active-class="animated bounceOut"
          >
          <q-badge floating color="warning" class="shadow-1 text-primary-dark-12 text-bold" :key="$store.getters['ShoppingCart/Items'].total">
            {{$store.getters['ShoppingCart/Items'].total}}
          </q-badge>
        </transition>
      <q-menu :no-parent-event="loading">
        <q-card>
          <q-card-section class="text-center bg-secondary text-primary q-pa-sm">
            <div class="text-h5 text-bold q-ma-none">{{scopeFullClinic.city}}</div>
            <div class="text-caption">{{scopeFullClinic.real_address.address_line_1}}</div>
          </q-card-section>
          <template v-for="(category, key, index) in shoppingCart">
            <q-card-section :key="category.id" v-if="category.items.length">
              <div class="text-subtitle1 text-primary text-center text-bold">
                {{ category.headerText }}
              </div>
              <q-list separator>
                <template v-for="item in category.items">
                  <shopping-cart-item
                    :key="item.id"
                    :item="item"
                    :category="category"
                    >
                  </shopping-cart-item>
                </template>
              </q-list>
            </q-card-section>
            <q-separator color="primary" inset :key="'S' + category.id" v-if="index < (Object.keys(shoppingCart).length - 1) && Object.keys(shoppingCart).length > 1"/>
          </template>
          <q-card-actions class="bg-primary" align="between">
            <div class="text-h6 q-px-sm text-white">Total: {{$store.getters['ShoppingCart/Items'].total}}</div>
            <div class="q-gutter-md">
              <q-btn size="sm" color="warning-dark" text-color="white" @click="emptyShoppingCart">Vaciar</q-btn>
              <q-btn size="sm" color="secondary" text-color="primary">Detalles</q-btn>
              <q-btn size="sm" color="white" text-color="primary" @click="placeOrder" v-close-popup>Hacer Pedido</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { StationaryMixins } from '../../mixins/stationaryMixins'
import ShoppingCartItem from './shoppingCartItem'

export default {
  name: 'shopping-cart-menu',
  mixins: [StationaryMixins],
  components: { ShoppingCartItem },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    emptyShoppingCart () {
      this.$store.commit('ShoppingCart/cleanShoppingCart', { categories: null })
    },
    placeOrder () {
      return new Promise((resolve, reject) => {
        this.loading = true
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'shopping_bags/placeOrder'
        actionPayload.method = 'POST'
        actionPayload.params = {
          shoppingCart: this.shoppingCart,
          clinicId: this.scopeFullClinic ? this.scopeFullClinic.id : null,
          storeId: this.scopeFullStore ? this.scopeFullStore.id : null
        }
        this.$axios({
          url: actionPayload.url,
          method: actionPayload.method,
          data: actionPayload.params
        }).then((response) => {
          this.loading = false
          if (!this.$store.state.Model.models['orders']) this.$store.commit('Model/setModel', { name: 'orders', options: {}, cached: false })
          this.$store.commit('Model/addModelItems', { name: 'orders', items: response.data.model })
          this.$store.dispatch('Notify/displayMessage', { message: 'Order Completed', position: 'top', type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.loading = false
          this.$store.dispatch('Notify/displayMessage', { message: 'Action Failed', position: 'top', type: 'negative' })
          reject(response)
        })
      })
    }
  }
}
</script>
