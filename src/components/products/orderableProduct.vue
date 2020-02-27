<template>
  <q-card flat bordered :class="[category, 'product', {'selected': selected}]">
    <q-card-section :class="['image-box', 'text-center', 'text-uppercase']" v-if="hasImage">
      <div class="image-container shadow-1">
        <q-img contain class="bg-grey-4" :img-style="{transform: 'rotate(330deg) scale(1.2)', filter: 'grayscale()'}" style="height: 80px" :src="$store.state.App.publicSources + '/' + orderable.clinic_stationary.af.thumbnail">
          <q-tooltip>
            <q-img style="min-width: 300px" :src="$store.state.App.publicSources + '/' + orderable.clinic_stationary.af.thumbnail" />
          </q-tooltip>
        </q-img>
      </div>
    </q-card-section>
    <q-card-section class="product-description text-center text-uppercase q-pa-sm ellipsis">
      {{ orderable.description }}
      <q-tooltip>
        <span class="text-h6">{{ orderable.description }}</span>
      </q-tooltip>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'OrderableProduct',
  props: ['orderable', 'category'],
  data () {
    return {}
  },
  computed: {
    selected () {
      return this.$store.state.ShoppingCart[this.category].ids.includes(this.orderable.id)
    },
    hasImage () {
      if (this.category === 'storeables') {
        if (!this.orderable.clinic_stationary) return false
        if (!this.orderable.clinic_stationary.af) return false
        return true
      } else {
        return false
      }
    },
    image () {
      return ''
    }
  }
}
</script>

<style lang="stylus">
  .product {
    cursor: pointer;
    color: $primary;
    background-color: white;
    border: 1px solid $primary;
    white-space: nowrap
    &:hover {
      background-color: $primary;
      color: white;
      font-weight: bold;
    }
    &.selected {
      background-color: $primary;
      color: white;
      font-weight: bold;
      .image-box {
        background-color: $grey-6
      }
    }
    .image-box {
      background-color: $grey-12
      &:hover {
        background-color: $accent
      }
    }
    .product-description {
      font-size: 0.8em
    }
  }
</style>
