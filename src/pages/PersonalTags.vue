<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn
        color="info"
        label="Invertir Selección"
        icon="flip"
        @click="flipSelection"
        >
      </q-btn>
      <q-btn
        color="primary"
        label="Descargar"
        icon="cloud_download"
        @click="downloadTags"
        :disabled="!selected.length"
        :loading="btnLoaders.downloadTags"
        >
      </q-btn>
      <q-btn
        color="primary"
        label="Compartir"
        icon="share"
        @click="downloadTags"
        :disabled="!selected.length"
        :loading="btnLoaders.shareTags"
        >
      </q-btn>
    </div>
    <div class="row q-gutter-md q-mt-lg justify-center">
      <template v-for="person in model">
        <q-card
          v-for="schedule in person.clinic_schedules"
          :key="person.id + schedule.id"
          :class="{'personal-tag': true}"
          @click="toggleSelected(schedule.id)"
          >
          <q-card-section :class="{'selected': selected.includes(schedule.id)}">
            <div class="name">{{ person.full_name }}</div>
            <div class="job">{{ schedule.job_type.name }}</div>
          </q-card-section>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'
import { FileMethods } from '../mixins/fileMixin'

export default {
  name: 'personal-tags',
  mixins: [ModelsFetcher, FileMethods],
  data () {
    return {
      modelName: 'profiles',
      modelsNeeded: {
        profiles: {
          scoped: true,
          refresh: true,
          with: ['clinic_schedules']
        }
      },
      selected: [],
      btnLoaders: {
        downloadTags: false,
        shareTags: false
      }
    }
  },
  computed: {
    ready () {
      if (this.$store.state.Scope.clinic.clinics.selected.length === 1) {
        if (this.$store.state.Model.models['profiles']) {
          if (this.$store.state.Model.models['profiles'].items) return true
        }
      }
      return false
    },
    model () {
      if (this.ready) {
        return this.$store.state.Model.models['profiles'].items
      }
      return []
    },
    schedules () {
      let items = []
      for (let model of this.model) {
        model.clinic_schedules.map(i => { items.push(i.id) })
      }
      return items
    }
  },
  methods: {
    flipSelection () {
      if (!this.selected) this.selected = this.schedules
      else if (this.selected.length === this.schedules.length) this.selected = []
      else {
        let items = this.schedules.filter(i => { return !this.selected.includes(i) })
        this.selected = items
      }
    },
    toggleSelected (id) {
      if (this.selected.includes(id)) this.selected.splice(this.selected.indexOf(id), 1)
      else this.selected.push(id)
    },
    // CORDOVA FILE RELATED
    readBinaryFile (fileEntry) {
      let vm = this
      fileEntry.file(function (file) {
        var reader = new FileReader()
        reader.onloadend = function () {
          // console.log('Successful file write: ' + this.result)
          //   this.displayFileData(fileEntry.fullPath + ': ' + this.result)
          var blob = new Blob([new Uint8Array(this.result)], { type: 'image/png' })
          vm.displayImage(blob)
        }
        reader.readAsArrayBuffer(file)
      })
    },
    readFile (fileEntry) {
      fileEntry.file(function (file) {
        var reader = new FileReader()
        reader.onloadend = function () {
          // console.log('Successful file read: ' + this.result)
        //   displayFileData(fileEntry.fullPath + ': ' + this.result)
        }
        reader.readAsText(file)
      })
    },
    displayImage (blob) {
    // Displays image if result is a valid DOM string for an image.
      var elem = document.getElementById('imageSource')
      // Note: Use window.URL.revokeObjectURL when finished with image.
      elem.src = window.URL.createObjectURL(blob)
      // console.log('HERE')
    },
    saveFile (dirEntry, fileData, fileName) {
      let vm = this
      dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
        vm.writeFile(fileEntry, fileData)
      })
    },
    createDirectory (rootDirEntry) {
      let vm = this
      rootDirEntry.getDirectory('NewDirInRoot', { create: true }, function (dirEntry) {
        dirEntry.getDirectory('images', { create: true }, function (subDirEntry) {
          vm.createFile(subDirEntry, 'fileInNewSubDir.txt')
        })
      })
    },
    createFile (dirEntry, fileName, isAppend) {
      let vm = this
      // Creates a new file or returns the file if it already exists.
      dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
        vm.writeFile(fileEntry, null, isAppend)
      })
    },
    writeFile (fileEntry, dataObj, isAppend) {
      // console.log('Write File Function')
      let vm = this
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function () {
          // console.log('Successful file write...')
          // console.log('Type: ' + dataObj.type)
          if (dataObj.type === 'image/png') {
            // console.log('HERE')
            vm.readBinaryFile(fileEntry)
          } else {
            // console.log('Trying to Read not Image File')
            // vm.readFile(fileEntry)
          }
        }
        fileWriter.onerror = function (e) {
          // console.log('Failed file write: ' + e.toString())
        }
        if (!dataObj) {
          // console.log('Object NULL')
          dataObj = new Blob(['some file data'], { type: 'text/plain' })
        }
        fileWriter.write(dataObj)
      })
    },
    getSampleFile (dirEntry) {
      let vm = this
      var xhr = new XMLHttpRequest()
      xhr.open('GET', 'http://192.168.2.180:2200/img/logo_mi.png', true)
      xhr.responseType = 'blob'
      xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://192.168.2.180')
      xhr.onload = function () {
        if (this.status === 200) {
          var blob = new Blob([this.response], { type: 'image/png' })
          vm.saveFile(dirEntry, blob, 'downloadedImage.png')
        }
      }
      xhr.send()
    },
    // END CORDOVA FILE
    downloadTags () {
      // let ids = this.selected.map(profile => { return profile.id })
      // console.log(ids)
      this.btnLoaders.downloadTags = true
      this.$axios({
        url: this.$store.state.App.dataWarehouse + 'clinic_schedules/download-tags',
        method: 'POST',
        params: {
          clinic_schedules: this.selected
        },
        responseType: 'blob'
      }).then((response) => {
        this.btnLoaders.downloadTags = false
        this.selected = []
        // console.log(response)
        let vm = this
        if (this.$q.platform.is.mobile) {
          this.$store.dispatch('Notify/displayMessage', { message: 'Trying again...', position: 'top', type: 'negative' })
          // Temporary approach
          //   window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
          //     console.log('file system open: ' + fs.name)
          //     var blob = new Blob([response.data], { type: 'application/pdf' })
          //     vm.saveFile(fs.root, blob, 'identificadores.pdf')
          //   })
          // Persist File Approach
          window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
            // console.log('file system open: ' + dirEntry.name)
            // console.log('Dir: ' + cordova.file.externalDataDirectory)
            // vm.getSampleFile(dirEntry)
            // vm.createDirectory(dirEntry)
            var blob = new Blob([response.data], { type: 'application/pdf' })
            vm.saveFile(dirEntry, blob, 'identificadores.pdf')
          })
        } else {
          this.triggerDownload(response)
        }
      }).catch(() => {
        this.btnLoaders.downloadTags = false
        // console.log(error)
      })
    }
  }
}
</script>

<style lang="stylus">
  .personal-tag {
    display: inline-block;
    width: 300px;
    text-align: center;
    &:hover {
      background-color: $secondary;
      color: primary;
    }
    .q-card__section {
      padding: 0;
      padding-top: 12px;
      padding-bottom: 12px;
      border: 0 solid $primary !important;
      &.selected {
        background-color: $primary;
        color: white;
        border-color: white !important;
      }
    }
    .name {
      font-size: 16px;
      border-top: 3px solid;
      padding-top: 10px;
      border-color: inherit;
    }
    .job {
      border-bottom: 3px solid;
      border-color: inherit;
      font-size: 12px;
      line-height 10px;
      padding-bottom: 10px;
    }
  }
</style>
