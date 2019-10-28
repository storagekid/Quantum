export const multiAsyncActionBarsMixins = {
  data () {
    return {
      multiAsyncAction: {
        show: false,
        headerText: 'Multiaction Send',
        keyField: 'id',
        mode: null,
        model: {
          name: null,
          persist: false,
          id: null,
          index: false
        },
        relation: {
          name: null,
          persist: false,
          id: null,
          index: false
        },
        items: [],
        success: [],
        failed: []
      }
    }
  },
  methods: {
    clearMultiUpload () {
      this.multiAsyncAction.show = false
      this.multiAsyncAction.mode = null
      this.multiAsyncAction.model = {
        name: null,
        persist: false,
        id: null,
        index: false
      }
      this.multiAsyncAction.relation = {
        name: null,
        persist: false,
        id: null,
        index: false
      }
      this.multiAsyncAction.items = []
      this.multiAsyncAction.failed = []
      this.multiAsyncAction.success = []
    }
  }
}
