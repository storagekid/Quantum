<template>
  <q-list
    dense
    class="bg-white text-accent"
    >
    <template v-for="item in menu.filtered_items">
      <menu-item :item="item" :key="item.id" :parentGroups="[]" menuName="admin-menu">
      </menu-item>
    </template>
    <!-- <q-item dark dense :to="{name: 'clinics'}" :exact="true" clickable v-ripple class="bg-warning">
      <q-item-section avatar>
      <q-avatar text-color="white" icon="keyboard_backspace" font-size=".5em" rounded></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label style="font-weight: bold">
          {{$t('menus.main.adminArea.title')}}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense :to="{name: 'admin-dashboard'}" :exact="true">
      <q-item-section avatar>
        <q-avatar text-color="accent" icon="dashboard" font-size=".5em" rounded></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label style="font-weight: bold">
          {{$t('menus.main.adminDashboard.title')}}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense :to="{name: 'users'}" :exact="true">
      <q-item-section avatar>
        <q-avatar text-color="accent" icon="person" font-size=".5em" rounded></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label style="font-weight: bold">
          {{$t('menus.main.users.title')}}
        </q-item-label>
        <q-item-label caption>
          {{$t('menus.main.users.subtitle')}}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense :to="{name: 'groups'}" :exact="true">
      <q-item-section avatar>
        <q-avatar text-color="accent" icon="people" font-size=".5em" rounded></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label style="font-weight: bold">
          {{$t('menus.main.groups.title')}}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense :to="{name: 'menus'}" :exact="true">
      <q-item-section avatar>
        <q-avatar text-color="accent" icon="menu" font-size=".5em" rounded></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label style="font-weight: bold">
          {{$t('menus.main.menus.title')}}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense :to="{name: 'menu-items'}" :exact="true">
      <q-item-section avatar>
        <q-avatar text-color="accent" icon="menu_book" font-size=".5em" rounded></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label style="font-weight: bold">
          {{$t('menus.main.menu_items.title')}}
        </q-item-label>
      </q-item-section>
    </q-item> -->
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
