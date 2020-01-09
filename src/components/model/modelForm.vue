<template>
  <form v-if="quasarData">
    <div class="row q-col-gutter-md q-mt-md" v-for="(row, index) in step.fields" :key="'R'+index">
      <template
        v-for="(field, index) in row"
        >
        <div
          v-if="!batchMode || (batchMode && field.batch)"
          :key="'F'+index"
          class="col-xs-12 col-sm-4"
          >
          <q-input
            v-if="field.type.name === 'inputText'"
            icon="subject"
            :label-width="12"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="text"
            :disable="viewMode"
            />
          <q-input
            v-if="field.type.name === 'password'"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="password"
            :disable="viewMode"
            />
          <q-input
            v-if="field.type.name === 'number'"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            stack-label
            suffix=""
            v-model="model[field.name]"
            type="number"
            :step="field.type.step ? field.type.step : 1"
            :disable="viewMode"
            />
          <q-input
            v-if="field.type.name === 'date'"
            mask="####-##-##"
            :rules="[]"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.label"
            stack-label
            v-model="model[field.name]"
            :disable="viewMode"
            >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" color="primary">
                <q-popup-proxy :ref="'qDateProxy-' + index" transition-show="scale" transition-hide="scale">
                  <q-date color="primary" v-model="model[field.name]" @input="hideDatePicker(index)" mask="YYYY-MM-DD"/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <custom-select
            v-if="field.type.name === 'select'"
            :clearable="true"
            :field="field"
            :excludeModel="field.type.hasFamily && mode === 'update' ? getFamily() : false"
            :initValue="model[field.name]"
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            @updated="updateCustomSelect('model.' + field.name, ...arguments)"
            :disable="viewMode"
            >
          </custom-select>
          <q-select
            v-if="field.type.name === 'enum'"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.type.default.text"
            stack-label
            v-model="model[field.name]"
            :options="field.type.array"
            :disable="viewMode"
          />
          <q-select
            v-if="field.type.name === 'array'"
            icon="subject"
            bottom-slots
            :error="$v.model[field.name].$error"
            :error-message="$v.model[field.name].$error ? getErrors($v.model[field.name]) : ''"
            :name="field.name"
            :label="field.type.default.text"
            stack-label
            v-model="model[field.name]"
            :options="field.type.array"
          />
          <q-uploader
            v-if="field.type.name === 'file'"
            class="full-width"
            bottom-slots
            :error="$v.model[field.name].$error"
            url=""
            :factory="sendFile(field, ...arguments)"
            :label="field.label"
            :hide-upload-button="true"
            :hide-upload-progress="true"
            @added="uploadFilesAdded($event, field.name)"
            @uploaded="finishUploading(field, ...arguments)"
            :disable="viewMode"
            >
            <template v-slot:header="scope" v-if="model[field.name] && typeof model[field.name] !== 'object'">
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
                    <q-img style="max-height: 100px" contain :src="getThumbnail(field.name)"></q-img>
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
        </div>
      </template>
    </div>
    <template flat v-for="(relation, index) in step.relations">
      <relation-card
        :key="'Rel'+index"
        :relationData="quasarData.relations[relation]"
        :model="model"
        :relatedTo="modelName"
        :modelData="quasarData"
        :mode="mode"
        :batchMode="batchMode"
        :batchSource="batchSource"
        >
      </relation-card>
    </template>
  </form>
</template>

<script>
import CustomSelect from '../form/customSelect'
import { customSelectMixins } from '../../mixins/customSelectMixins'
import RelationCard from '../relation/relationCard'
import { FormMixins } from '../../mixins/formMixins'
import { FileMethods } from '../../mixins/fileMixin'

export default {
  name: 'ModelForm',
  mixins: [customSelectMixins, FormMixins, FileMethods],
  props: ['mode', 'modelName', 'model', 'quasarData', 'step', 'batchMode', 'batchSource'],
  components: { RelationCard, CustomSelect },
  data () {
    return {
      relationName: null
    }
  },
  watch: {
    '$v.model.$anyError' () {
      this.$emit('dirtiness', { step: this.step.title, dirty: this.$v.model.$anyError })
    }
  },
  computed: {
    viewMode () {
      return this.mode === 'display'
    }
  },
  methods: {
    getThumbnail (field) {
      let name = field.substr(0, field.indexOf('_file_id'))
      let url = this.$store.state.App.publicSources + '/' + this.batchSource[name].thumbnail
      return url
    },
    uploadFilesAdded (files, field) {
      this.$emit('filesAdded', { files: files, field: field })
    },
    sendFile (files, field) {
      return (files) => {
        // console.log(field)
        // console.log(files)
        let name = this.model.name + ' ' + field.name.substring(0, field.name.indexOf('_file_id'))
        let dir = this.modelName + '/' + this.model.id
        return new Promise((resolve, reject) => {
          resolve({
            url: this.$store.state.App.dataWarehouse + 'files',
            headers: [
              { name: 'Authorization', value: 'Bearer ' + this.$store.state.Auth.token },
              { name: 'X-Requested-With', value: 'XMLHttpRequest' }
            ],
            fieldName: 'file',
            formFields: [
              { name: 'fieldName', value: field.name },
              { name: 'nameSpace', value: this.quasarData.nameSpace },
              { name: 'modelId', value: this.model.id },
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
      this.model[field.name] = null
    },
    validateFromLaravel (rules) {
      let validations = {}
      for (let rule of rules) {
        if (typeof rule !== 'string') continue
        if (rule === 'required') {
          const { required } = require('vuelidate/lib/validators')
          validations = { ...validations, required }
        } else if (rule.includes('min:')) {
          const { minLength } = require('vuelidate/lib/validators')
          let minValue = parseInt(rule.substring((rule.indexOf(':') + 1)))
          validations = { ...validations, minLength: minLength(minValue) }
        } else if (rule.includes('max:')) {
          const { maxLength } = require('vuelidate/lib/validators')
          let maxValue = parseInt(rule.substring((rule.indexOf(':') + 1)))
          validations = { ...validations, maxLength: maxLength(maxValue) }
        } else if (rule.includes('same:')) {
          const { sameAs } = require('vuelidate/lib/validators')
          let sameField = rule.substring((rule.indexOf(':') + 1))
          validations = { ...validations, sameAs: sameAs(sameField) }
        }
      }
      return validations
    }
  },
  validations () {
    let model = {}
    if (!this.step) return { model }
    for (let row of this.step.fields) {
      for (let field in row) {
        if (this.batchMode && !row[field].batch) continue
        if (this.quasarData.rules[field]) {
          model[field] = this.validateFromLaravel(this.quasarData.rules[field])
        }
      }
    }
    return { model }
  },
  mounted () {
    this.$v.$touch()
  }
}
</script>

<style>
</style>
