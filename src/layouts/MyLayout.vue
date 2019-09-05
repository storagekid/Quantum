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

        <scope-top-bar></scope-top-bar>

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
      <profile-card></profile-card>
      <language-menu styles="margin: 0" btn-classes="q-pa-sm"></language-menu>
      <main-menu></main-menu>
    </q-drawer>

    <q-page-container class="main-background">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import ScopeTopBar from '../components/scope/scopeTopBar'
import ProfileCard from '../components/profile/profileCard'
import MainMenu from '../components/menu/mainMenu'
import LanguageMenu from '../components/menu/languageMenu'

export default {
  components: { ScopeTopBar, ProfileCard, MainMenu, LanguageMenu },
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  }
}
</script>

<style>
</style>
