<template>
  <router-link to="/profile-home">
    <q-img :src="require('../../assets/profile.png')">
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
  }
}
</script>

<style>
</style>
