<template>
  <div>Profile id:{{model.name}} Show Component</div>
</template>

<script>
export default {
  name: 'ProfileShow',
  data () {
    return {}
  },
  computed: {
    model () {
      return this.$store.state.Model.models.profiles.items.filter(item => { return item.id === parseInt(this.$route.params.id) })[0]
    }
  }
}
</script>

<style>
</style>
