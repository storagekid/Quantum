<template>
  <q-page padding>
    <h1>Admin DashBoard</h1>
    <div class="row">
      <q-btn label="GET USER" @click="fetchUser"></q-btn>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Admin-DashBoard',
  methods: {
    fetchUser () {
      this.$store.dispatch('User/getUser')
        .then((response) => {
          // console.log(response)
        })
        .catch((response) => {
          // console.log(response)
          this.visible = false
        })
    }
  }
}
</script>

<style>
</style>
