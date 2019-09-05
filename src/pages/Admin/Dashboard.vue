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
          // this.$emit('logged', response)
          // this.visible = false
        })
        .catch((response) => {
          // console.log(response)
          this.visible = false
          // if (response) {
          //   this.$store.dispatch('Response/responseErrorManager', response)
          // } else {
          //   this.$store.dispatch('Response/responseNoResponse')
          // }
        })
    }
  }
}
</script>

<style>
</style>
