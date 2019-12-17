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
          v-if="$store.getters['User/isRoot']"
          @click="downloadLog"
        >
          <q-icon name="cloud_download" />
        </q-btn>
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
      :breakpoint="1400"
      v-model="leftDrawerOpen"
      content-class="bg-accent text-accent shadow-5"
      >
      <profile-card></profile-card>
      <language-menu styles="margin: 0" btn-classes="q-pa-xs"></language-menu>
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
import { FileMethods } from '../mixins/fileMixin'

export default {
  components: { ScopeTopBar, ProfileCard, MainMenu, LanguageMenu },
  mixins: [FileMethods],
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop && this.$q.screen.lt.lg
    }
  },
  methods: {
    downloadLog () {
      const url = window.URL.createObjectURL(new Blob([this.$store.state.App.logs.dev]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'log.json') // or any other extension
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style>
</style>
