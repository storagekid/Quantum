<template>
  <q-list
    dense
    class="bg-white text-accent"
    >
    <template v-for="item in menu.filtered_items">
      <menu-item :item="item" :key="item.id" :parentGroups="[]" menuName="admin-menu">
      </menu-item>
    </template>
  </q-list>
</template>

<script>
import MenuItem from './menuItem'

export default {
  components: { MenuItem },
  name: 'AdminMenu',
  data () {
    return {}
  },
  computed: {
    menu () {
      return this.$store.state.App.menus.filter((i) => { return i.name === 'admin_menu' })[0]
    }
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
