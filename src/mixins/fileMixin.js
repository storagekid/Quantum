export const FileDownloadMethods = {
  data () {
    return {
      modelsFetched: 0
    }
  },
  methods: {
    downloadFile (id) {
      return new Promise((resolve, reject) => {
        // console.log(id)
        // this.gridItemLoading = payload.id
        let url = this.$store.state.App.dataWarehouse + 'files/' + id
        this.$axios({
          'url': url,
          method: 'GET',
          responseType: 'blob'
        }).then((response) => {
          // console.log(response.headers)
          // let headers = response.headers['content-disposition'].split(';')
          // let badname = headers[1].split('=')
          // let name = badname[1].slice(1, -1)
          // if (headers[2]) {
          //   let badname2 = headers[2].split('\'\'')
          //   name = decodeURIComponent(badname2[1])
          // }
          // const url = window.URL.createObjectURL(new Blob([response.data]))
          // const link = document.createElement('a')
          // link.href = url
          // link.setAttribute('download', name) // or any other extension
          // document.body.appendChild(link)
          // link.click()
          // document.body.removeChild(link)
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
    }
  },

  created () {
  }
}
