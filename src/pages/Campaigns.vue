<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="tableModels"
      :permissions="permissions"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-open" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="item.item" color="positive"></q-icon>
        <q-icon name="check_circle" v-else color="negative"></q-icon>
      </template>
      <template slot="body-cell-active" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="item.item" color="positive"></q-icon>
        <q-icon name="check_circle" v-else color="negative"></q-icon>
      </template>
      <template slot="body-cell-actions" slot-scope="item" :item="item">
        <q-btn-dropdown
          icon="insert_photo"
          :color="!item.item.campaign_posters_count ? 'grey' : 'info'"
          label="Distribución"
          unelevated
          size="sm"
          :disable="!item.item.campaign_posters_count"
          >
          <div class="column q-gutter-sm q-py-sm">
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Generar PDFs" @click="generateCLinicsDistributionPDF(item.item)"></q-btn>
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Rehacer Fachadas" @click="generateCLinicDistributionFacades(item.item)" :disable="true"></q-btn>
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Lanzar Distribución" @click="showLauncher(item.item)"></q-btn>
          </div>
        </q-btn-dropdown>
      </template>
    </model-table>
    <q-dialog v-model="confirm.state" persistent>
      <q-card>
        <q-card-section class="bg-primary text-white text-center">
          <span class="text-h6">Selecciona las clínicas</span>
        </q-card-section>
        <q-card-section>
          <div class="q-mt-md text-subtitle2 text-center">Total: {{ clinicsSelected.length }} </div>
        </q-card-section>
        <q-card-section>
          <q-btn class="full-width" outline color="info" @click="clinicsSelected = clinicOptions" :disable="clinicsSelected === clinicOptions" label="Todas"></q-btn>
        </q-card-section>
        <q-card-section class="row items-center">
          <custom-select
            :all="clinicsSelected.length === clinicOptions.length"
            v-if="clinicOptions.length"
            :dense="true"
            multiple
            counter
            :max="true"
            :hide-bottom-space="true"
            :field="{name: 'clinics', type: { model: 'clinics', default: { text: 'Selecciona las clínicas'} }}"
            :sourceOptions="clinicOptions"
            :clearable='true'
            :initValue="clinicsSelected"
            @updated="updateCustomSelect('clinicsSelected', $event)"
            >
          </custom-select>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-toggle
              v-model="confirm.fake"
              label="Use Mailtrap"
              color="info"
              keep-color
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="positive" v-close-popup @click="launchDistribution()" :disable="!clinicsSelected.length"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <multi-async-action-bars
      v-if="multiAsyncAction.show"
      :opened="multiAsyncAction.show"
      :items="multiAsyncAction.items"
      headerText="Generando Distribuciones de Fachadas"
      keyField="nickname"
      v-on:Finished="clearMultiUpload"
      >
    </multi-async-action-bars>
  </q-page>
</template>

<script>
import { Helpers } from '../mixins/helpers'
import { ModelsFetcher } from '../mixins/modelMixin'
import CustomSelect from '../components/form/customSelect'
import MultiAsyncActionBars from '../components/loaders/multiAsyncActionBars'

export default {
  name: 'CampaignsPage',
  mixins: [ ModelsFetcher, Helpers ],
  components: { CustomSelect, MultiAsyncActionBars },
  data () {
    return {
      modelName: 'campaigns',
      modelsNeeded: {
        campaigns: {
          with: ['parent', 'children'],
          refresh: true,
          withCount: ['campaign_posters', 'campaign_poster_priorities', 'sanitary_codes', 'campaign_facades'],
          orderBy: 'starts_at',
          orderDesc: true,
          cache: false,
          where: false
        },
        clinics: {
          scoped: false,
          refresh: true,
          cache: false,
          with: ['poster_distributions', 'campaign_facades'],
          appends: ['clinic_distributions_by_campaign']
        },
        clinic_posters: {
          scoped: false,
          refresh: true,
          with: ['clinic_poster_priorities']
        }
      },
      tableModels: {
        poster_models: {
          scoped: false,
          refresh: false,
          cache: false
        },
        posters: {
          scoped: false,
          refresh: false,
          cache: false
        },
        languages: {
          scoped: false,
          refresh: false,
          cache: false
        }
      },
      modelSelected: null,
      confirm: {
        state: false,
        id: null,
        index: null,
        item: null,
        fake: true
      },
      clinicOptions: [],
      clinicsSelected: [],
      multiAsyncAction: {
        show: false,
        items: [],
        success: [],
        failed: []
      }
    }
  },
  computed: {
    postersNeeded () {
      let seed = this.$store.state.Model.models.clinic_posters.items
      let grouped = {}
      for (let poster of seed) {
        if (!grouped[poster.poster_id]) {
          this.$set(grouped, poster.poster_id, {})
          this.$set(grouped[poster.poster_id], poster.type, {})
          for (let priority of poster.clinic_poster_priorities) {
            this.$set(grouped[poster.poster_id][poster.type], priority.campaign_id, [])
            grouped[poster.poster_id][poster.type][priority.campaign_id].push(priority.priority)
          }
          // grouped[poster.poster_id][poster.type].push(poster.clinic_poster_priorities)
        } else if (!grouped[poster.poster_id][poster.type]) {
          this.$set(grouped[poster.poster_id], poster.type, {})
          for (let priority of poster.clinic_poster_priorities) {
            this.$set(grouped[poster.poster_id][poster.type], priority.campaign_id, [])
            grouped[poster.poster_id][poster.type][priority.campaign_id].push(priority.priority)
          }
        } else {
          for (let priority of poster.clinic_poster_priorities) {
            if (!grouped[poster.poster_id][poster.type][priority.campaign_id]) {
              this.$set(grouped[poster.poster_id][poster.type], priority.campaign_id, [])
              grouped[poster.poster_id][poster.type][priority.campaign_id].push(priority.priority)
            } else {
              if (!grouped[poster.poster_id][poster.type][priority.campaign_id].includes(priority.priority)) grouped[poster.poster_id][poster.type][priority.campaign_id].push(priority.priority)
            }
          }
        }
      }
      return grouped
    }
  },
  methods: {
    generateCLinicDistributionFacades (campaign) {
      let distributions = []
      // Select All clinics
      let items = this.$store.state.Model.models.clinics.items
      // Select a Bunch of clinics
      // items = this.$store.state.Model.models.clinics.items.slice(0, 10) // Last Index 218
      // Select By Clinic IDs
      // let items = this.$store.state.Model.models.clinics.items.filter(i => { return i.id > 199 && i.id < 216 })
      // items = this.$store.state.Model.models.clinics.items.filter(i => { return [1].includes(i.id) })
      // Filter if the clinic has no Distributions
      // items = items.filter(i => { return i.poster_distributions.length })
      items = items.filter(i => {
        if (i.ends_at < campaign.starts_at && i.deleted_at) return false
        let clinicStart = new Date(i.starts_at)
        let campaignEnd = new Date(campaign.ends_at)
        if (clinicStart > campaignEnd) return false
        if (typeof i.clinic_distributions_by_campaign === 'object') {
          if (i.clinic_distributions_by_campaign.hasOwnProperty('')) return true
        }
      })
      for (let clinic of items) {
        if (clinic.poster_distributions.length) {
          // console.log(clinic)
          if (!clinic.poster_distributions) continue
          for (let dist of clinic.poster_distributions) {
            let actionPayload = {}
            actionPayload.url = this.$store.state.App.dataWarehouse + 'poster_distributions/' + dist.id + '/compose'
            actionPayload.method = 'GET'
            actionPayload.params = {
              'campaign': campaign.id,
              'force': true
            }
            dist.actionPayload = actionPayload
            distributions.push(dist)
          }
        }
      }
      this.multiAsyncAction.items = distributions
      this.multiUploadFiles({
        items: this.multiAsyncAction.items
      })
    },
    generateCLinicsDistributionPDF (campaign) {
      // Select All clinics
      let items = this.$store.state.Model.models.clinics.items
      // Select a Bunch of clinics
      // let items = this.$store.state.Model.models.clinics.items.slice(0, 10) // Last Index 218
      // Select By Clinic IDs
      // let items = this.$store.state.Model.models.clinics.items.filter(i => { return i.id > 199 && i.id < 216 })
      // items = this.$store.state.Model.models.clinics.items.filter(i => { return [1].includes(i.id) })
      // Filter if the clinic has no Distributions
      // items = items.filter(i => { return i.poster_distributions.length })
      items = items.filter(i => {
        if (i.ends_at < campaign.starts_at && i.deleted_at) return false
        let clinicStart = new Date(i.starts_at)
        let campaignEnd = new Date(campaign.ends_at)
        // console.log(i.starts_at)
        // console.log(campaign.ends_at)
        // console.log(clinicStart > campaignEnd)
        if (clinicStart > campaignEnd) return false
        if (typeof i.clinic_distributions_by_campaign === 'object') {
          if (i.clinic_distributions_by_campaign.hasOwnProperty('')) return true
        }
      })
      // if (items.length) {
      //   console.log(items)
      //   return false
      // }
      items.map(i => {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'clinics/' + i.id + '/posterDistributionByCampaing'
        // actionPayload.url = this.$store.state.App.dataWarehouse + 'clinics/' + i.id + '/posterDistribution'
        actionPayload.method = 'POST'
        actionPayload.params = {
          'campaign': campaign.id,
          'force': true
        }
        i.actionPayload = actionPayload
      })
      this.multiAsyncAction.items = items
      this.multiUploadFiles({
        items: this.multiAsyncAction.items
      })
    },
    // Multi Async Actions Methods
    async multiUploadFiles (payload) {
      // console.log('Multi Async Actions Launched')
      // console.log(payload)
      for (let item of payload.items) {
        this.$set(item, 'phase', 'waiting')
      }
      this.multiAsyncAction.show = true
      let success = []
      let failed = []
      let round = 0
      while ((success.length + failed.length) < payload.items.length) {
        let item = payload.items[round]
        payload.items[round].phase = 'uploading'
        await this.sendAction(item)
          .then((response) => {
            this.$emit('multiUploadFileSuccess', { index: round })
            success.push(item)
            this.multiAsyncAction.success.push(item)
            payload.items[round].phase = 'success'
            // console.log('Success')
            // console.log('Success: ' + success.length)
            // console.log('Items: ' + payload.items.length)
            round++
          }).catch(() => {
            // this.$emit('multiUploadFileFailed', { index: round })
            failed.push(item)
            this.multiAsyncAction.failed.push(item)
            payload.items[round].phase = 'failed'
            // console.log('Failed')
            // console.log('Failed: ' + failed.length)
            // console.log('Items: ' + payload.items.length)
            round++
          })
      }
      return true
    },
    sendAction (payload) {
      // console.log('Send File')
      // console.log(payload)
      return new Promise((resolve, reject) => {
        this.$axios({
          url: payload.actionPayload.url,
          method: payload.actionPayload.method,
          params: payload.actionPayload.params
        }).then((response) => {
          // this.$store.commit('Model/addRelationItems', { name: this.relatedTo, relation: payload.relation, items: response.model, parentIndex: this.model.__index })
          this.$store.dispatch('Notify/displayMessage', { message: 'Action Completed', position: 'top', type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Notify/displayMessage', { message: 'Action Failed', position: 'top', type: 'negative' })
          // this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    sendMultiFiles () {
      this.multiUploadFiles({
        relation: this.openRelation,
        items: this.multiUpload.items,
        parentIndex: this.model.__index
      })
      // this.closeRelationForm()
    },
    showMultiUpload (payload) {
      for (let item of payload.items) {
        this.$set(item, 'phase', 'waiting')
      }
      payload.items[0].phase = 'uploading'
      this.multiUpload.items = payload.items
      this.multiUpload.show = true
      // console.log(this.multiUpload.items)
    },
    multiUploadFileSuccess (payload) {
      this.multiUpload.items[payload.index].phase = 'success'
      if (payload.index < this.multiUpload.items.length - 1) {
        this.multiUpload.items[payload.index + 1].phase = 'uploading'
      }
    },
    multiUploadFileFailed (payload) {
      this.multiUpload.items[payload.index].done = 'failed'
      if (payload.index < this.multiUpload.items.length - 1) {
        this.multiUpload.items[payload.index + 1].phase = 'uploading'
      }
    },
    clearMultiUpload () {
      this.multiAsyncAction.show = false
      this.multiAsyncAction.items = []
      this.multiAsyncAction.failed = []
      this.multiAsyncAction.success = []
    },
    clearConfirm () {
      this.confirm = {
        state: false,
        id: null,
        index: null,
        item: null,
        fake: true
      }
      this.clinicsSelected = []
    },
    showLauncher (campaign) {
      // console.log(campaign)
      this.confirm.item = campaign
      this.clinicOptions = []
      // Select All clinics
      let items = this.$store.state.Model.models.clinics.items
      // Select a Bunch of clinics
      // items = this.$store.state.Model.models.clinics.items.slice(0, 10) // Last Index 218
      // Select By Clinic IDs
      // let items = this.$store.state.Model.models.clinics.items.filter(i => { return i.id > 199 && i.id < 216 })
      // items = this.$store.state.Model.models.clinics.items.filter(i => { return [1].includes(i.id) })
      // Filter if the clinic has no Distributions
      // items = items.filter(i => { return i.poster_distributions.length })
      items = items.filter(i => {
        if (!i.campaign_facades.length) return false
        // if (i.ends_at < campaign.starts_at && i.deleted_at) return false
        // let clinicStart = new Date(i.starts_at)
        // let campaignEnd = new Date(campaign.ends_at)
        // if (clinicStart > campaignEnd) return false
        for (let pdf of i.campaign_facades) {
          if (pdf.campaign_id === campaign.id) return true
        }
        return false
      })
      this.clinicOptions = items
      this.confirm.state = true
    },
    launchDistribution () {
      for (let clinic of this.clinicsSelected) {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'clinics/' + clinic.id + '/posterDistributionLauncher'
        actionPayload.method = 'POST'
        actionPayload.params = {
          'campaign': this.confirm.item.id,
          'fake': this.confirm.fake
        }
        clinic.actionPayload = actionPayload
        this.multiAsyncAction.items.push(clinic)
      }
      this.multiUploadFiles({
        items: this.multiAsyncAction.items
      })
      this.clearConfirm()
    }
  }
}
</script>

<style>
</style>
