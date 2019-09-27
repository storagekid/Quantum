<template>
  <q-page padding>
  </q-page>
</template>

<script>
export default {
  name: 'Logout',
  created () {
    this.$store.dispatch('Auth/logOut')
    this.$router.push({ name: 'login' })
  }
}
</script>

<style>
</style>
