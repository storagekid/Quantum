<template>
  <q-page padding>
    <!-- content -->
  </q-page>
</template>

<script>
export default {
  name: 'Logout',
  created () {
    this.$store.dispatch('Auth/logOut')
    // this.$store.commit('App/ClearCachePages')
    this.$router.push({ name: 'login' })
  }
}
</script>

<style>
</style>
