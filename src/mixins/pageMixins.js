export const PageMixins = {
  computed: {
    permissions () {
      return this.$store.getters['User/permissions']
    }
  },
  methods: {
    can (action, group) {
      if (this.$store.getters['User/isRoot']) return true
      if (!this.permissions[group]) return false
      else if (!this.permissions[group][action]) return false
      return true
    }
  }
}
