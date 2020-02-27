<template>
  <q-item>
    <q-item-section avatar>
      <q-btn-group>
        <q-btn
          dense
          size="sm"
          icon="remove_circle"
          color="warning-dark"
          :disable="!canSubtract"
          @click="shoppingCartTimes(item.id, category.name, -1)"
        />
        <q-btn
          dense
          size="sm"
          icon="add_circle"
          color="primary"
          :disable="!canAdd"
          @click="shoppingCartTimes(item.id, category.name, 1)"
          />
      </q-btn-group>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ item[category.itemKey] }}</q-item-label>
      <q-item-label caption>{{ ' (' + itemQuantity + ' unidades)' }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn dense size="sm" icon="delete" color="negative" @click="shoppingCartToggle(item, category.name)"/>
    </q-item-section>
  </q-item>
</template>

<script>
import { StationaryMixins } from '../../mixins/stationaryMixins'

export default {
  name: 'ShoppingCartItem',
  mixins: [StationaryMixins],
  props: ['item', 'category'],
  data () {
    return {}
  },
  computed: {
    itemQuantity () {
      return this.item.provider.min_quantity * this.category.times[this.item.id]
      // return this.item.provider.default_quantity + (this.item.provider.quantity_steps * (this.category.times[this.item.id] - 1))
    },
    canSubtract () {
      return this.category.times[this.item.id] > 1
    },
    canAdd () {
      return this.item.provider.max_quantity > this.itemQuantity
    }
  }
}
</script>
