<template>
  <q-list
    dense
    class="q-mt-md bg-white text-accent"
    >
    <template v-for="item in menu.filtered_items">
      <menu-item :item="item" :key="item.id" :parentGroups="[]" menuName="main-menu" :currentRoute="currentRoute" v-on:routeChanged="setCurrentRoute">
      </menu-item>
    </template>
  </q-list>
</template>

<script>
import MenuItem from './menuItem'

export default {
  components: { MenuItem },
  name: 'MainMenu',
  data () {
    return {
      currentRoute: this.$router.currentRoute.name
    }
  },
  computed: {
    menu () {
      return this.$store.state.App.menus.filter((i) => { return i.name === 'main_menu' })[0]
    }
  },
  methods: {
    setCurrentRoute (e) {
      this.currentRoute = e
    }
  },
  beforeUpdate () {
    // console.log('Before Updateing')
  },
  mounted () {
    // console.log(this.$router.currentRoute.name)
    // console.log(this.$router.currentRoute)
  }
}
</script>

<style lang="stylus">
// @import '~quasar-variables'
  .q-item.q-router-link--active, .q-item--active {
    background-color: $primary;
    color: white;
    .q-icon {
      color: white;
    }
    .q-item__label {
      color: white;
    }
  }
  .q-expansion-item {
    .q-expansion-item {
      .q-item__section--avatar {
        align-items: center;
      }
      .q-expansion-item__content {
        * {
          color: $primary;
          // justify-content: flex-end;
        }
        .q-item__section--main {
          font-size: .85em;
          font-style: italic;
        }
        .q-item {
          max-height: 20px;
        }
        .q-avatar__content {
          justify-content: flex-end;
        }
        .q-item.q-router-link--active, .q-item--active {
          background-color: $primary;
          color: white;
          .q-icon {
            color: white;
          }
          .q-item__label {
            color: white;
          }
        }
      }
    }
  }
</style>
