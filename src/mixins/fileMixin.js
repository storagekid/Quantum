export const FileMethods = {
  data () {
    return {
      filePicked: null
    }
  },
  methods: {
    filesAdded (payload) {
      // this.model[payload.field] = payload.files[0]
      this.filePicked = payload.files[0]
      this.$emit('filesAdded', { files: payload.files[0], field: payload.field })
    },
    restoreOriginalFile (payload) {
      this.$emit('restoreOriginalFile', payload)
    },
    uploadFile (payload) {
      return new Promise((resolve, reject) => {
        // console.log(id)
        let url = this.$store.state.App.dataWarehouse + 'files'
        this.$axios({
          'url': url,
          method: 'POST'
        }).then((response) => {
          this.$store.dispatch('Notify/displayMessage', { message: 'File Saved', position: 'top', type: 'positive' }, { root: true })
          resolve()
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject()
        })
      })
    },
    downloadFile (ids) {
      return new Promise((resolve, reject) => {
        // console.log(id)
        let url = this.$store.state.App.dataWarehouse + 'files/downloads'
        this.$axios({
          'url': url,
          method: 'POST',
          responseType: 'blob',
          data: { ids: typeof ids === 'object' ? ids : [ids] }
        }).then((response) => {
          this.triggerDownload(response)
          this.$store.dispatch('Notify/displayMessage', { message: 'File Downloaded', position: 'top', type: 'positive' }, { root: true })
          resolve()
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject()
        })
      })
    },
    triggerDownload (response) {
      let headers = response.headers['content-disposition'].split(';')
      let badname = headers[1].split('=')
      let name = badname[1].slice(1, -1)
      if (headers[2]) {
        let badname2 = headers[2].split('\'\'')
        name = decodeURIComponent(badname2[1])
      }
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name) // or any other extension
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    removeFile (id) {
      console.log('WTF-2')
      console.log(id)
      return new Promise((resolve, reject) => {
        let url = this.$store.state.App.dataWarehouse + 'files/' + id
        this.$axios({
          'url': url,
          method: 'DELETE'
        }).then((response) => {
          this.$store.dispatch('Notify/displayMessage', { message: 'File Deleted', position: 'top', type: 'positive' }, { root: true })
          resolve()
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject()
        })
      })
    },
    removeModelFile (payload) {
      return new Promise((resolve, reject) => {
        this.removeFile(payload.fileId)
          .then(() => {
            this.$store.commit('Model/removeModelFile', {
              modelName: payload.modelName,
              modelId: payload.modelId,
              fieldName: payload.fieldName,
              fileFieldName: payload.fileFieldName
            })
            resolve()
          }).catch(() => {
            this.$store.dispatch('Notify/displayMessage', { message: 'Error on Mutation', position: 'top', type: 'negative' }, { root: true })
            reject()
          })
      })
    },
    removeRelationFile (payload) {
      return new Promise((resolve, reject) => {
        this.removeFile(payload.fileId)
          .then(() => {
            this.$store.commit('Model/removeRelationFile', {
              parentName: payload.parentName,
              parentId: payload.parentId,
              modelName: payload.modelName,
              modelId: payload.modelId,
              fieldName: payload.fieldName,
              fileFieldName: payload.fileFieldName
            })
            resolve()
          }).catch(() => {
            this.$store.dispatch('Notify/displayMessage', { message: 'Error on Mutation', position: 'top', type: 'negative' }, { root: true })
            reject()
          })
      })
    }
  },

  created () {
  }
}
