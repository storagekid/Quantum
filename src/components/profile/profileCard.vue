<template>
  <router-link to="/profile-home">
    <q-img :ratio="1" :src="profileAvatar">
      <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
        {{$store.state.User.profile.full_name}}
        <div class="text-caption">{{$store.state.User.profile.job_type_name}}</div>
      </div>
    </q-img>
  </router-link>
</template>

<script>
export default {
  name: 'ProfileCard',
  data () {
    return {}
  },
  computed: {
    profileAvatar () {
      if (this.$store.state.User.profile.avatar) if (this.$store.state.User.profile.avatar.thumbnail) return this.$store.state.App.publicSources + '/' + this.$store.state.User.profile.avatar.thumbnail
      return require('../../assets/profile.png')
    }
  }
}
</script>

<style>
</style>
