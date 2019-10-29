<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="modelsReady"
      >
      <template slot="body-cell-actions" slot-scope="item" :item="item">
        <q-btn-dropdown
          icon="insert_photo"
          :color="!item.item.mailing_designs_count ? 'grey' : 'info'"
          label="Clinicas"
          unelevated
          size="sm"
          :disable="!item.item.mailing_designs_count"
          >
          <div class="column q-gutter-sm q-py-sm">
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Generar Listado Buzoneo" @click="showGenerateClinicMailing(item.item)"></q-btn>
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Asignar Productos y Servicios" @click="showGenerateProductsAndServices(item.item)"></q-btn>
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Generar CSV Indesign" @click="showGenerateCSV(item.item)"></q-btn>
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Subir Datos de Buzoneo" @click="showMailingDataUploader(item.item)"></q-btn>
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Subir AAFF de Buzoneo" @click="showMailingAAFFUploader(item.item)"></q-btn>
          </div>
        </q-btn-dropdown>
      </template>
    </model-table>
    <q-dialog v-model="confirm.state" v-if="['generateClinicMailing', 'generateProductsAndServices'].includes(confirm.action)" persistent>
      <q-card>
        <q-card-section class="bg-primary text-white text-center">
          <span class="text-h6">Selecciona los diseños</span>
        </q-card-section>
        <q-card-section>
          <div class="q-mt-md text-subtitle2 text-center">Total: {{ mailingDesignSelected.length }} </div>
        </q-card-section>
        <q-card-section>
          <q-btn class="full-width" outline color="info" @click="mailingDesignSelected = mailingDesignOptions" :disable="mailingDesignSelected === mailingDesignOptions" label="Todas"></q-btn>
        </q-card-section>
        <q-card-section class="row items-center full-width">
          <div class="col">
            <custom-select
              :all="mailingDesignSelected.length === mailingDesignOptions.length"
              v-if="mailingDesignOptions.length"
              :dense="true"
              multiple
              counter
              :hide-bottom-space="true"
              :field="{name: 'mailing_designs', type: { model: 'mailing_designs', default: { text: 'Selecciona los diseños'} }}"
              :sourceOptions="mailingDesignOptions"
              :clearable='true'
              :initValue="mailingDesignSelected"
              @updated="updateCustomSelect('mailingDesignSelected', $event)"
              >
            </custom-select>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="positive" v-close-popup @click="startAction" :disable="!mailingDesignSelected.length"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm.state" v-if="confirm.action === 'generateCSV'" persistent>
      <q-card>
        <q-card-section class="bg-primary text-white text-center">
          <span class="text-h6">Selecciona los diseños</span>
        </q-card-section>
        <q-card-section>
          <div class="q-mt-md text-subtitle2 text-center">Total: {{ mailingDesignSelected.length }} </div>
        </q-card-section>
        <q-card-section>
          <q-btn class="full-width" outline color="info" @click="mailingDesignSelected = mailingDesignOptions" :disable="mailingDesignSelected === mailingDesignOptions" label="Todas"></q-btn>
        </q-card-section>
        <q-card-section class="row items-center full-width">
          <div class="col">
            <custom-select
              :all="mailingDesignSelected.length === mailingDesignOptions.length"
              v-if="mailingDesignOptions.length"
              :dense="true"
              multiple
              counter
              :hide-bottom-space="true"
              :field="{name: 'mailing_designs', type: { model: 'mailing_designs', default: { text: 'Selecciona los diseños'} }}"
              :sourceOptions="mailingDesignOptions"
              :clearable='true'
              :initValue="mailingDesignSelected"
              @updated="updateCustomSelect('mailingDesignSelected', $event)"
              >
            </custom-select>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-toggle
              v-model="confirm.options.rename"
              label="Rename File"
              color="info"
              keep-color
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="positive" v-close-popup @click="startAction" :disable="!mailingDesignSelected.length"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm.state" v-if="confirm.action === 'uploadMailingData'" persistent>
      <q-card>
        <q-card-section class="bg-primary text-white text-center">
          <span class="text-h6">Subida Datos Buzoneo</span>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-toggle
              v-model="confirm.options.fake"
              label="Use Mailtrap"
              color="info"
              keep-color
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-uploader
            class="full-width"
            bottom-slots
            :factory="sendFile"
            label="Selecciona un archivo de Datos"
            @uploaded="finishUploading"
            >
          </q-uploader>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm.state" v-if="confirm.action === 'uploadMailingAAFF'" persistent>
      <q-card class="q-pa-none bg-secondary" style="min-width:400px;">
        <q-card-section class="q-ma-none q-pa-none">
          <q-uploader
            float-label="Multi Upload"
            multiple
            class="full-width"
            style="min-height:300px"
            label="Add Files to upload"
            :factory="uploadAAFF"
            @added="uploadMultiFilesAdded($event, 'clinic_mailings', 'base_af')"
            :batch="true"
            @uploading="sendMultiFiles"
            @factory-failed="failedMethod"
            @removed="removeFiles"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <multi-async-action-bars
      v-if="multiAsyncAction.show"
      :opened="multiAsyncAction.show"
      :items="multiAsyncAction.items"
      :headerText="multiAsyncAction.headerText"
      :keyField="multiAsyncAction.keyField"
      :mode="multiAsyncAction.mode"
      :model="multiAsyncAction.model"
      v-on:Finished="clearMultiUpload"
      >
    </multi-async-action-bars>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'
import { customSelectMixins } from '../mixins/customSelectMixins'
import CustomSelect from '../components/form/customSelect'
import { multiAsyncActionBarsMixins } from '../mixins/multiAsyncActionBarsMixins'
import MultiAsyncActionBars from '../components/loaders/multiAsyncActionBars'

export default {
  name: 'mailings',
  mixins: [ ModelsFetcher, multiAsyncActionBarsMixins, customSelectMixins ],
  components: { CustomSelect, MultiAsyncActionBars },
  data () {
    return {
      modelName: 'mailings',
      modelsNeeded: {
        mailings: {
          full: true,
          withCount: ['mailing_designs', 'sanitary_codes'],
          appends: ['design_clinics']
        },
        clinics: {
          refresh: true,
          withCount: ['siblings'],
          appends: ['share_siblings']
        }
      },
      confirm: {
        state: false,
        id: null,
        index: null,
        item: null,
        action: null,
        options: {}
      },
      mailingDesignOptions: [],
      mailingDesignSelected: []
    }
  },
  methods: {
    startAction () {
      this[this.confirm.action]()
    },
    showGenerateClinicMailing (mailing) {
      this.confirm.item = mailing
      this.confirm.action = 'generateClinicMailing'
      this.confirm.options = { fake: true, rename: true }
      this.mailingDesignOptions = mailing.mailing_designs
      this.confirm.state = true
    },
    generateClinicMailing () {
      console.log('Creating Clinic Mailings')
      for (let mailingDesign of this.mailingDesignSelected) {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'mailing_designs/' + mailingDesign.id + '/clinicMailingGenerator'
        actionPayload.method = 'POST'
        actionPayload.params = {
          'mailing': this.confirm.item.id,
          'ids': this.confirm.item.design_clinics[mailingDesign.id],
          'fake': this.confirm.fake
        }
        mailingDesign.actionPayload = actionPayload
      }
      this.multiAsyncAction.items = this.mailingDesignSelected
      this.multiAsyncAction.headerText = 'Generating ' + this.confirm.item.name + ' Clinic Mailing'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    showGenerateProductsAndServices (mailing) {
      this.confirm.item = mailing
      this.confirm.action = 'generateProductsAndServices'
      this.mailingDesignOptions = mailing.mailing_designs
      this.confirm.state = true
    },
    generateProductsAndServices () {
      console.log('generateProductsAndServices')
      for (let mailingDesign of this.mailingDesignSelected) {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'mailing_designs/' + mailingDesign.id + '/ProductAndServicesGenerator'
        actionPayload.method = 'POST'
        actionPayload.params = {
          'mailing': this.confirm.item.id,
          'ids': this.confirm.item.design_clinics[mailingDesign.id],
          'fake': this.confirm.fake
        }
        mailingDesign.actionPayload = actionPayload
      }
      this.multiAsyncAction.items = this.mailingDesignSelected
      this.multiAsyncAction.headerText = 'Generating ' + this.confirm.item.name + ' Products & Services'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    showGenerateCSV (mailing) {
      this.confirm.item = mailing
      this.confirm.action = 'generateCSV'
      this.confirm.options = { fake: true, rename: true }
      this.mailingDesignOptions = mailing.mailing_designs
      this.confirm.state = true
    },
    generateCSV () {
      console.log('Generating Indesign CSV')
      let defItems = []
      for (let mailingDesign of this.mailingDesignSelected) {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'mailing_designs/' + mailingDesign.id + '/IndesignCSVGenerator'
        actionPayload.method = 'POST'
        actionPayload.responseType = 'blob'
        actionPayload.download = true
        actionPayload.params = {
          'mailing': this.confirm.item.id,
          'ids': this.confirm.item.design_clinics[mailingDesign.id]
        }
        mailingDesign.actionPayload = actionPayload
        if (this.confirm.options.rename) {
          let newMailingDesign = JSON.parse(JSON.stringify(mailingDesign))
          let actionPayload = {}
          actionPayload.url = this.$store.state.App.dataWarehouse + 'mailing_designs/' + mailingDesign.id + '/IndesignRenameGenerator'
          actionPayload.method = 'POST'
          actionPayload.download = true
          actionPayload.responseType = 'blob'
          actionPayload.params = {
            'mailing': this.confirm.item.id,
            'ids': this.confirm.item.design_clinics[mailingDesign.id]
          }
          newMailingDesign.actionPayload = actionPayload
          defItems.push(newMailingDesign)
        }
        defItems.push(mailingDesign)
      }
      this.multiAsyncAction.items = defItems
      this.multiAsyncAction.headerText = 'Generating ' + this.confirm.item.name + ' CSVs'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    showMailingDataUploader (mailing) {
      this.confirm.item = mailing
      this.confirm.action = 'uploadMailingData'
      this.mailingDesignOptions = mailing.mailing_designs
      this.confirm.state = true
    },
    uploadMailingData () {
    },
    showMailingAAFFUploader (mailing) {
      this.confirm.item = mailing
      this.confirm.action = 'uploadMailingAAFF'
      this.mailingDesignOptions = mailing.mailing_designs
      this.confirm.state = true
    },
    uploadMailingAAFF () {
    },
    uploadFilesAdded (files) {
      // this.$emit('filesAdded', { files: files, field: field })
    },
    sendFile (files) {
      console.log('Here')
      let url = this.$store.state.App.dataWarehouse + 'mailings/' + this.confirm.item.id + '/mailinigDataUploader'
      console.log(url)
      console.log(files)
      return new Promise((resolve, reject) => {
        resolve({
          url: url,
          headers: [
            { name: 'Authorization', value: 'Bearer ' + this.$store.state.Auth.token },
            { name: 'X-Requested-With', value: 'XMLHttpRequest' }
          ],
          fieldName: 'file'
        })
      })
    },
    finishUploading (field, info) {
      this.$store.dispatch('Notify/displayMessage', { message: 'Data Uploaded Successfully', position: 'top', type: 'positive' })
      this.model[field.name] = null
    },
    uploadMultiFilesAdded (files, relation, field) {
      // console.log('uploadMultiFilesAdded')
      let defItems = []
      for (let file of files) {
        // console.log(file)
        let hashPos = file.name.indexOf('#')
        let clinicId = parseInt(file.name.substring(hashPos + 1, hashPos + 5))
        // console.log(clinicId)
        let clinic = this.$store.state.Model.models.clinics.items.filter((i) => { return i.id === clinicId })[0]
        let clinicIds = [clinic.id]
        if (clinic.siblings_count && !clinic.share_siblings) for (let sibling of clinic.siblings) clinicIds.push(sibling.id)
        for (let clinicId of clinicIds) {
          let object = {}
          console.log(clinicId)
          let clinicMailing = JSON.parse(JSON.stringify(this.confirm.item.clinic_mailings.filter((i) => { return i.clinic_id === clinicId })[0]))
          console.log(clinicMailing)
          let actionPayload = {}
          actionPayload.url = this.$store.state.App.dataWarehouse + 'clinic_mailings/' + clinicMailing.id + '/saveAF'
          actionPayload.method = 'POST'
          actionPayload.responseType = 'blob'
          actionPayload.download = true
          actionPayload.params = {
          }
          object.model = { file: file }
          object.actionPayload = actionPayload
          defItems.push(object)
        }
      }
      this.multiAsyncAction.items = defItems
      this.multiAsyncAction.headerText = 'Uploading ' + this.confirm.item.name + ' AAFF'
      this.multiAsyncAction.mode = 'updateModel'
      this.multiAsyncAction.model.name = 'clinic_mailings'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    removeFiles (files) {
      for (let i = this.multiUpload.items.length - 1; i >= 0; i--) {
        if (this.multiUpload.items[i].file.name === files[0].name) this.multiUpload.items.splice(i, 1)
      }
    },
    failedMethod () {
      console.log('failedMethod')
      // this.sendMultiFiles()
      // this.closeRelationForm()
    },
    uploadAAFF (files) {
      return new Promise((resolve, reject) => {
        reject(files)
      })
    },
    sendMultiFiles () {
      console.log('Send Multi Files')
      this.multiAsyncAction.items.map(i => {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + this.relatedTo + '/' + this.model.id + '/' + this.relationData.name
        actionPayload.method = 'POST'
        actionPayload.params = {}
        i.actionPayload = actionPayload
        i.model[this.relationData.getForeignKeyName] = this.model.id
      })
      this.multiAsyncAction.show = true
    },
    clearConfirm () {
      this.confirm = {
        state: false,
        id: null,
        index: null,
        item: null,
        options: {},
        action: null
      }
      this.mailingDesignSelected = []
    }
  }
}
</script>

<style>
</style>
