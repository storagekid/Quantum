<template>
  <q-uploader
    v-if="field.type.name === 'file'"
    class="full-width"
    bottom-slots
    url=""
    :factory="sendFile(field, ...arguments)"
    :label="field.label"
    :hide-upload-button="true"
    :hide-upload-progress="true"
    @added="uploadFilesAdded($event, field.name)"
    @uploaded="finishUploading(field, ...arguments)"
    :disable="viewMode"
    >
    <template v-slot:header="scope" v-if="hasFile">
      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
        <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
          <q-tooltip>Clear All</q-tooltip>
        </q-btn>
        <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
          <q-tooltip>Remove Uploaded Files</q-tooltip>
        </q-btn>
        <q-spinner-gears v-if="scope.isUploading" class="q-uploader__spinner" />
        <div class="col">
          <div class="q-uploader__title">
            <q-img style="max-height: 100px" contain :src="fileUrl"></q-img>
          </div>
          <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
        </div>
        <q-btn v-if="scope.canAddFiles" type="a" icon="refresh" round dense flat>
          <q-uploader-add-trigger />
          <q-tooltip>Pick Files</q-tooltip>
        </q-btn>
        <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
          <q-tooltip>Upload Files</q-tooltip>
        </q-btn>

        <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
          <q-tooltip>Abort Upload</q-tooltip>
        </q-btn>
      </div>
    </template>
  </q-uploader>
</template>

<script>
export default {
  name: 'FormFile',
  props: ['field', 'modelField', 'viewMode', 'filterMode', 'modelName', 'quasarData'],
  data () {
    return {}
  },
  computed: {
    hasFile () {
      return (this.modelField[this.fileFieldName])
    },
    fileFieldName () {
      return this.field.name.substr(0, this.field.name.indexOf('_file_id'))
    },
    fileUrl () {
      return this.$store.state.App.publicSources + '/' + this.modelField[this.fileFieldName].thumbnail
    }
  },
  methods: {
    uploadFilesAdded (files, field) {
      this.$emit('filesAdded', { files: files, field: field })
    },
    sendFile (files, field) {
      return (files) => {
        // console.log(field)
        // console.log(files)
        let name = this.modelField.name + ' ' + this.fileFieldName
        let dir = this.modelName + '/' + this.modelField.id
        return new Promise((resolve, reject) => {
          resolve({
            url: this.$store.state.App.dataWarehouse + 'files',
            headers: [
              { name: 'Authorization', value: 'Bearer ' + this.$store.state.Auth.token },
              { name: 'X-Requested-With', value: 'XMLHttpRequest' }
            ],
            fieldName: 'file',
            formFields: [
              { name: 'fieldName', value: this.field.name },
              { name: 'nameSpace', value: this.quasarData.nameSpace },
              { name: 'modelId', value: this.modelField.id },
              { name: 'fileName', value: name },
              { name: 'fileDir', value: dir },
              { name: 'thumbnail', value: field.type.thumbnail ? field.type.thumbnail : true }
            ]
          })
        })
      }
    },
    finishUploading (field, info) {
      this.$store.dispatch('Notify/displayMessage', { message: 'File Saved', position: 'top', type: 'positive' })
      // this.model[field.name] = null
    }
    // getThumbnail () {
    //   let url = this.$store.state.App.publicSources + '/' + this.batchSource[this.fileFieldName].thumbnail
    //   return url
    // }
  }
}
</script>
