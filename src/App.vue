<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.dispatch('App/bootApp')
    if (localStorage.settings) {
      let settings = JSON.parse(localStorage.settings)
      if (settings.lang) this.$i18n.locale = settings.lang
      if (this.$q.lang.isoName !== settings.lang) {
        import(`quasar/lang/${settings.lang}`).then(lang => {
          this.$q.lang.set(lang.default)
        })
      }
    }
  }
}
</script>

<style>
</style>
