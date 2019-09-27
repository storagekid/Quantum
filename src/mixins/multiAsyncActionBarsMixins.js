export const multiAsyncActionBarsMixins = {
  data () {
    return {
      multiAsyncAction: {
        show: false,
        items: [],
        success: [],
        failed: []
      }
    }
  },
  methods: {
    clearMultiUpload () {
      this.multiAsyncAction.show = false
      this.multiAsyncAction.items = []
      this.multiAsyncAction.failed = []
      this.multiAsyncAction.success = []
    }
  }
}
