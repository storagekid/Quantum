<template>
  <div>
    <q-uploader
      v-show="!hasFile"
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
      ref="uploader"
      >
    </q-uploader>
    <q-card class="my-card" v-if="hasFile" @mouseover="setHoverImage" @mouseleave="imageHover = null">
      <q-img :src="fileUrl" v-if="fileFormat === 'image'">
        <div class="absolute-bottom" v-if="imageHoverMatch">
          <div class="text-subtitle2">{{ fileName }}</div>
          <q-btn-group>
            <q-btn icon="refresh" @click="pickFile"></q-btn>
            <q-btn icon="delete" @click="removeFileGate(field)"></q-btn>
          </q-btn-group>
        </div>
      </q-img>
      <q-pdfviewer
        v-if="fileFormat === 'pdf'"
        v-model="hasFile"
        :src="fileUrl"
        type="html5"
      />
      <q-inner-loading :showing="loadingVisible">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </q-card>
    <q-dialog v-model="warning.state" persistent="">
      <remove-file-confirm
        :fileName="fileName"
        @confirmed="removeFileController"
        @canceled="closeRemoveWarning"
        >
      </remove-file-confirm>
    </q-dialog>
  </div>
</template>

<script>
import { FileMethods } from '../../mixins/fileMixin'
import RemoveFileConfirm from '../file/removeFileConfirm'

export default {
  name: 'FormFile',
  props: ['field', 'modelField', 'relation', 'viewMode', 'filterMode', 'modelName', 'quasarData'],
  mixins: [ FileMethods ],
  components: { RemoveFileConfirm },
  data () {
    return {
      imageHover: null,
      filePicked: false,
      loadingVisible: false,
      warning: {
        state: false
      }
    }
  },
  watch: {
    'modelField.base_af_file_id' () {
      // console.log('File Changed')
    }
  },
  computed: {
    imageHoverMatch () {
      if (this.filePicked) return this.imageHover === this.modelField[this.field.name].name
      return this.imageHover === this.modelField[this.fileFieldName].id
    },
    uploaderRefName () {
      return 'modelName-File-' + this.modelField.id + '-uploader'
    },
    hasFile () {
      if (this.modelField[this.fileFieldName] || this.filePicked) return true
      return false
    },
    hasOriginalFile () {
      if (this.modelField[this.fileFieldName]) return true
      return false
    },
    fileType () {
      if (this.filePicked) return 'picker'
      else if (this.hasFile) return 'file'
      return null
    },
    fileFieldName () {
      return this.field.name.substr(0, this.field.name.indexOf('_file_id'))
    },
    fileName () {
      if (!this.fileType) return null
      return this.fileType === 'file' ? this.modelField[this.fileFieldName].name : this.modelField[this.field.name].name
    },
    fileFormat () {
      if (this.fileType === 'picker') {
        if (this.modelField[this.field.name].type === 'application/pdf') return 'pdf'
        if (this.modelField[this.field.name].type === 'application/zip') return 'zip'
        if (this.modelField[this.field.name].type === 'image/jpeg') return 'image'
        if (this.modelField[this.field.name].type === 'image/png') return 'image'
      }
      return 'image'
    },
    fileUrl () {
      if (this.fileType === 'picker') return URL.createObjectURL(this.modelField[this.field.name])
      return this.$store.state.App.publicSources + '/' + this.modelField[this.fileFieldName].thumbnail
    },
    fileInModel () {
      return this.modelField['base_af_file_id']
    }
  },
  methods: {
    setHoverImage () {
      if (this.filePicked) this.imageHover = this.modelField[this.field.name].name
      else this.imageHover = this.modelField[this.fileFieldName].id
    },
    pickFile () {
      this.$refs.uploader.pickFiles()
      // this.$refs[this.uploaderRefName].pickFiles()
    },
    closeRemoveWarning () {
      this.warning.state = false
    },
    showRemoveWarning () {
      // this.$store.commit('App/showWarning', { action: 'sendRemoveFile' })
      this.warning.state = true
    },
    removeFileController () {
      let payload = {
        fileId: this.modelField[this.fileFieldName].id,
        parentName: this.relation ? this.relation.name : null,
        parentId: this.relation ? this.relation.id : null,
        modelName: this.modelName,
        modelId: this.modelField.id,
        fieldName: this.field.name,
        fileFieldName: this.fileFieldName
      }
      if (this.relation) this.sendRemoveRelationFile(payload)
      else this.sendRemoveModelFile(payload)
      this.loadingVisible = true
      this.closeRemoveWarning()
    },
    sendRemoveRelationFile (payload) {
      // console.log('Removing Relation File')
      this.removeRelationFile(payload)
        .then(() => {
          this.restoreOriginalFile()
          this.loadingVisible = false
        }).catch(() => {
          this.loadingVisible = false
        })
    },
    sendRemoveModelFile (payload) {
      // console.log('Removing File')
      this.removeModelFile(payload)
        .then(() => {
          this.restoreOriginalFile()
          this.loadingVisible = false
        }).catch(() => {
          this.loadingVisible = false
        })
    },
    removeFileGate (field) {
      if (this.filePicked) {
        this.restoreOriginalFile()
      } else {
        this.showRemoveWarning()
      }
      this.filePicked = false
    },
    restoreOriginalFile () {
      this.$emit('restoreOriginalFile', { field: this.field.name, fileFieldName: this.fileFieldName })
    },
    uploadFilesAdded (files, field) {
      this.$emit('filesAdded', { files: files, field: field })
      this.filePicked = true
      this.$refs.uploader.reset()
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
