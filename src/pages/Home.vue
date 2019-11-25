<template>
  <div></div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  methods: {
    redirect (object) {
      let homes = []
      for (let group of object.$store.state.User.groups) {
        let groupName = group.name.charAt(0).toUpperCase() + group.name.slice(1)
        let roleName = group.role.role.charAt(0).toUpperCase() + group.role.role.slice(1)
        let pageName = groupName + roleName + 'Home'
        homes.push(pageName)
      }
      for (let home of homes) {
        let matches = object.$router.resolve({ name: home })
        if (matches.resolved.matched.length) {
          object.$router.push({ name: home }).catch(err => {
            return err
          })
        }
      }
      object.$router.push({ name: 'ProfileHome' }).catch(err => { return err })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.redirect(vm)
    })
  },
  updated () {
    this.redirect(this)
  }
}
</script>

<style>
</style>
