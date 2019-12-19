export const PageMixins = {
  computed: {
    permissions () {
      return this.$store.getters['User/permissions']
    },
    pageContainerClasses () {
      let classes = []
      if (this.$q.platform.is.desktop) classes.push('q-pa-md')
      else classes.push('q-pa-none')
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
