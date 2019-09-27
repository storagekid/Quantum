export const customSelectMixins = {
  methods: {
    hideDatePicker (index) {
      let picker = 'qDateProxy-' + index
      // console.log(picker)
      if (this.$refs[picker][0]) this.$refs[picker][0].hide()
      else this.$refs[picker].hide()
    },
    getFamily () {
      let ids = []
      if (this.batchSource.children) {
        this.batchSource.children.map(i => { ids.push(i.id) })
      }
      ids.push(this.model.id)
      return ids
    }
  }
}
