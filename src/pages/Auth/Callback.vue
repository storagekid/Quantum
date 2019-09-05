<template>
  <q-page padding class="bg-primary">
    <div class="fullscreen row justify-center items-center">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="bg-white">
          <q-card-section class="text-center bg-secondary text-primary">
            Callback
          </q-card-section>
          <q-separator />
          <q-btn color="primary" label="Get User" class="q-mt-md full-width" @click="getUser"/>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  methods: {
    setAxiosHeaders (token) {
      // console.log(token)
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    },
    getUser () {
      this.$axios.get('http://migabinete.test/api/userApi')
    }
  },
  created () {
    // this.$axios.get('http://migabinete.test/api/patata')
    this.$axios.post('http://migabinete.test/oauth/token', {
      grant_type: 'authorization_code',
      client_id: 1,
      client_secret: '2GFazB9qPMqNn6n2M002U9NP5P2dauNttm14JujF',
      redirect_uri: 'http://localhost:8081/auth#/callback',
      code: this.$route.query.code
    }).then((response) => {
      // console.log(response)
      this.setAxiosHeaders(response.data.access_token)
    })
  }
}
</script>

<style>
</style>
