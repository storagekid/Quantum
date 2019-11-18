<template>
  <marketing-user-home></marketing-user-home>
</template>

<script>
import MarketingUserHome from './Homes/MarketingUserHome'

export default {
  name: 'Home',
  components: { MarketingUserHome },
  data () {
    return {
    }
  },
  beforeRouteEnter (to, from, next) {
    // console.log('beforeRouteEnter')
    next(vm => {
      // vm.getModelsNeeded()
      let homes = []
      for (let group of vm.$store.state.User.groups) {
        let groupName = group.name.charAt(0).toUpperCase() + group.name.slice(1)
        let roleName = group.role.role.charAt(0).toUpperCase() + group.role.role.slice(1)
        let pageName = groupName + roleName + 'Home'
        homes.push(pageName)
      }
      // console.log(homes)
      for (let home of homes) {
        let matches = vm.$router.resolve({ name: home })
        // console.log(matches.resolved.matched.length)
        if (matches.resolved.matched.length) {
          vm.$router.push({ name: home }).catch(err => {
            return err
            // console.log(err)
          })
        }
      }
    })
  },
  updated () {
    let homes = []
    for (let group of this.$store.state.User.groups) {
      let groupName = group.name.charAt(0).toUpperCase() + group.name.slice(1)
      let roleName = group.role.role.charAt(0).toUpperCase() + group.role.role.slice(1)
      let pageName = groupName + roleName + 'Home'
      homes.push(pageName)
    }
    // console.log(homes)
    for (let home of homes) {
      let matches = this.$router.resolve({ name: home })
      // console.log(matches.resolved.matched.length)
      if (matches.resolved.matched.length) {
        this.$router.push({ name: home }).catch(err => {
          return err
          // console.log(err)
        })
      }
    }
  }
}
</script>

<style>
</style>
