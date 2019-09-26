<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
        >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-btn flat class="gt-sm">
          Dentix
        </q-btn>

        <q-space />

        <q-btn
          flat
          dense
          round
          @click="$router.push({name:'logout'})"
        >
          <q-icon name="exit_to_app" />
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      :width="200"
      v-model="leftDrawerOpen"
      content-class="bg-accent text-accent shadow-5"
      >
      <div class="flex column justify-center" style="min-height: 50px">
        <language-menu styles="margin: 0" btn-classes="q-pa-sm"></language-menu>
      </div>
      <admin-menu></admin-menu>
    </q-drawer>

    <q-page-container class="main-background">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import AdminMenu from '../components/menu/adminMenu'
import LanguageMenu from '../components/menu/languageMenu'

export default {
  components: { AdminMenu, LanguageMenu },
  name: 'AdminLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  }
}
</script>

<style>
</style>
