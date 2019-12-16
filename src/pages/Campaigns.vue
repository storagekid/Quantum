<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="modelsReady"
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
          >
          <div class="column q-gutter-sm q-py-sm">
            <template v-if="item.item.campaign_posters_count || can('Marketing','create')">
              <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Generar PDFs" @click="showGenerateClinicDistributionPDF(item.item)"></q-btn>
              <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Rehacer Fachadas" @click="showGenerateCLinicDistributionFacades(item.item)" :disable="false"></q-btn>
              <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Lanzar Distribución" @click="showCampaignDistributionLauncher(item.item)"></q-btn>
            </template>
            <q-btn flat v-close-popup size="sm" icon="cloud_download" color="primary" label="Descargar Fachadas" @click="showDownloadCampaignPDFs(item.item)"></q-btn>
            <q-btn flat v-close-popup size="sm" icon="cloud_download" color="primary" label="Descargar legales" @click="showDownloadLegals(item.item)"></q-btn>
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
        <!-- <q-card-section>
          <q-btn class="full-width" outline color="info" @click="clinicsSelected = clinicOptions" :disable="clinicsSelected === clinicOptions" label="Todas"></q-btn>
        </q-card-section> -->
        <q-card-section>
          <clinic-scope-component
            :sourceClinics="clinicOptionsIds"
            @ClinicScopeSelected="updateScopeSelected"
            >
          </clinic-scope-component>
        </q-card-section>
        <!-- <q-card-section class="row items-center">
          <custom-select
            :all="clinicsSelected.length === clinicOptions.length"
            v-if="clinicOptions.length"
            :dense="true"
            multiple
            counter
            :hide-bottom-space="true"
            :field="{name: 'clinics', type: { model: 'clinics', default: { text: 'Selecciona las clínicas'} }}"
            :sourceOptions="clinicOptions"
            :clearable='true'
            :initValue="clinicsSelected"
            @updated="updateCustomSelect('clinicsSelected', $event)"
            >
          </custom-select>
        </q-card-section> -->
        <q-card-section>
          <div class="q-pa-xs">
            <q-toggle
              v-model="confirm.fake"
              label="Use Mailtrap"
              color="info"
              keep-color
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup @click="clearConfirm"/>
          <q-btn label="Confirmar" color="positive" v-close-popup @click="startAction" :disable="!clinicsSelected.length"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <multi-async-action-bars
      v-if="multiAsyncAction.show"
      :opened="multiAsyncAction.show"
      :items="multiAsyncAction.items"
      :headerText="multiAsyncAction.headerText"
      :keyField="multiAsyncAction.keyField"
      v-on:Finished="clearMultiUpload"
      >
    </multi-async-action-bars>
  </q-page>
</template>

<script>
import { PageMixins } from '../mixins/pageMixins'
import { ModelsFetcher } from '../mixins/modelMixin'
import { FileMethods } from '../mixins/fileMixin'
import { customSelectMixins } from '../mixins/customSelectMixins'
// import CustomSelect from '../components/form/customSelect'
import ClinicScopeComponent from '../components/scope/clinicScopeComponent'
import { multiAsyncActionBarsMixins } from '../mixins/multiAsyncActionBarsMixins'
import MultiAsyncActionBars from '../components/loaders/multiAsyncActionBars'

export default {
  name: 'CampaignsPage',
  mixins: [ PageMixins, ModelsFetcher, FileMethods, customSelectMixins, multiAsyncActionBarsMixins ],
  components: { MultiAsyncActionBars, ClinicScopeComponent },
  data () {
    return {
      modelName: 'campaigns',
      modelsNeeded: {
        campaigns: {
          with: ['parent', 'children'],
          refresh: true,
          withCount: ['campaign_posters', 'campaign_poster_priorities', 'sanitary_codes', 'campaign_facades'],
          orderBy: 'starts_at',
          orderDesc: true
        },
        clinics: {
          refresh: true,
          withTrashed: true,
          with: ['poster_distributions', 'campaign_facades'],
          appends: ['clinic_distributions_by_campaign']
        },
        clinic_posters: {
          refresh: true,
          with: ['clinic_poster_priorities']
        },
        poster_models: {
        },
        posters: {
        },
        languages: {
        }
      },
      modelSelected: null,
      confirm: {
        state: false,
        id: null,
        index: null,
        item: null,
        fake: true,
        action: null
      },
      clinicOptions: [],
      clinicOptionsIds: [],
      clinicsByScope: {},
      countriesSelected: [],
      statesSelected: [],
      countiesSelected: [],
      clinicsSelected: []
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
    updateScopeSelected (e) {
      this.clinicsSelected = this.clinicOptions.filter(i => e.clinicsIDs.includes(i.id))
    },
    showDownloadCampaignPDFs (campaign) {
      this.confirm.item = campaign
      this.confirm.action = 'downloadCampaignPDFs'
      this.clinicOptions = []
      let items = JSON.parse(JSON.stringify(this.$store.state.Model.models.clinics.items))
      items = items.filter(i => {
        let index = i.campaign_facades.findIndex(o => o.campaign_id === campaign.id)
        if (index > -1) {
          this.clinicOptionsIds.push(i.id)
          return true
        }
      })
      // console.log(items.length)
      this.clinicOptions = items
      this.confirm.state = true
    },
    downloadCampaignPDFs () {
      let fileIds = []
      this.clinicsSelected.map(i => {
        i.campaign_facades.forEach(o => {
          if (o.campaign_id === this.confirm.item.id) fileIds.push(o.facades_file_id)
        })
      })
      this.downloadFile(fileIds)
      this.clearConfirm()
    },
    showDownloadLegals (campaign) {
      this.confirm.item = campaign
      this.confirm.action = 'downloadLegals'
      let items = this.$store.state.Model.models.languages.items
      this.clinicOptions = items
      this.confirm.state = true
    },
    downloadLegals () {
      for (let clinic of this.clinicsSelected) {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'legals/downloadCSV'
        actionPayload.method = 'GET'
        actionPayload.responseType = 'blob'
        actionPayload.params = {
          'campaign_id': this.confirm.item.id,
          'language_id': clinic.id
        }
        clinic.actionPayload = actionPayload
      }
      this.multiAsyncAction.items = this.clinicsSelected
      this.multiAsyncAction.headerText = 'Downloading Legals CSVs'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    startAction () {
      this[this.confirm.action]()
    },
    showGenerateCLinicDistributionFacades (campaign) {
      this.confirm.item = campaign
      this.confirm.action = 'generateClinicDistributionFacades'
      let items = this.$store.state.Model.models.clinics.items
      items = items.filter(i => {
        if (i.ends_at < campaign.starts_at && i.deleted_at) return false
        let clinicStart = new Date(i.starts_at)
        let campaignEnd = new Date(campaign.ends_at)
        if (clinicStart > campaignEnd || !campaignEnd) return false
        if (typeof i.clinic_distributions_by_campaign === 'object') {
          if (i.clinic_distributions_by_campaign.hasOwnProperty('')) return true
        }
      })
      this.clinicOptions = items
      this.confirm.state = true
    },
    generateClinicDistributionFacades () {
      let campaign = this.confirm.item
      let distributions = []
      for (let clinic of this.clinicsSelected) {
        if (clinic.poster_distributions.length) {
          let campaignFound = []
          let noCampaign = []
          for (let dist of clinic.poster_distributions) {
            if (dist.campaign_id === campaign.id) campaignFound.push(dist)
            else noCampaign.push(dist)
          }
          let defDists = []
          if (campaignFound.length) defDists = campaignFound
          else {
            let endDate = []
            let noEndDate = []
            for (let dist of noCampaign) {
              if (dist.starts_at < campaign.ends_at || (dist.starts_at >= campaign.starts_at && !campaign.ends_at)) {
                if (!dist.ends_at) noEndDate.push(dist)
                else if (dist.ends_at >= campaign.ends_at) endDate.push(dist)
              }
              if (endDate.length) defDists = endDate
              else defDists = noEndDate
            }
          }
          for (let dist of defDists) {
            let actionPayload = {}
            actionPayload.url = this.$store.state.App.dataWarehouse + 'poster_distributions/' + dist.id + '/complete'
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
      this.multiAsyncAction.headerText = 'Generating ' + campaign.name + ' Facades'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    showGenerateClinicDistributionPDF (campaign) {
      // console.log('showGenerateClinicDistributionPDF')
      this.confirm.item = campaign
      this.confirm.action = 'generateClinicsDistributionPDF'
      this.clinicOptions = []
      let items = JSON.parse(JSON.stringify(this.$store.state.Model.models.clinics.items))
      items = items.filter(i => {
        if (i.ends_at < campaign.starts_at && i.deleted_at) return false
        // console.log('Here')
        let clinicStart = new Date(i.starts_at)
        let campaignEnd = campaign.ends_at ? new Date(campaign.ends_at) : null
        if (campaignEnd && clinicStart > campaignEnd) return false
        // console.log('There')
        if (typeof i.clinic_distributions_by_campaign === 'object') {
          if (i.clinic_distributions_by_campaign.hasOwnProperty('')) return true
        }
      })
      items.map(i => {
        this.clinicOptionsIds.push(i.id)
        let actionPayload = {}
        // console.log('HERE')
        actionPayload.url = this.$store.state.App.dataWarehouse + 'clinics/' + i.id + '/posterDistributionByCampaing'
        actionPayload.method = 'POST'
        actionPayload.params = {
          'campaign': campaign.id,
          'force': true
        }
        i.actionPayload = actionPayload
      })
      this.clinicOptions = items
      this.confirm.state = true
    },
    generateClinicsDistributionPDF () {
      let campaign = this.confirm.item
      this.multiAsyncAction.items = this.clinicsSelected
      this.multiAsyncAction.headerText = 'Generating ' + campaign.name + ' PDFs'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    showCampaignDistributionLauncher (campaign) {
      // console.log(campaign)
      this.confirm.item = campaign
      this.confirm.action = 'campaignDistributionLauncher'
      let items = this.$store.state.Model.models.clinics.items
      items = items.filter(i => {
        if (!i.campaign_facades.length) return false
        for (let pdf of i.campaign_facades) {
          if (pdf.campaign_id === campaign.id) return true
        }
        return false
      })
      this.clinicOptions = items
      this.confirm.state = true
    },
    campaignDistributionLauncher () {
      let campaign = this.confirm.item
      for (let clinic of this.clinicsSelected) {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + 'clinics/' + clinic.id + '/posterDistributionLauncher'
        actionPayload.method = 'POST'
        actionPayload.params = {
          'campaign': this.confirm.item.id,
          'fake': this.confirm.fake
        }
        clinic.actionPayload = actionPayload
      }
      this.multiAsyncAction.items = this.clinicsSelected
      this.multiAsyncAction.headerText = 'Sending ' + campaign.name + ' Distribution PDFs'
      this.multiAsyncAction.show = true
      this.clearConfirm()
    },
    clearConfirm () {
      this.confirm = {
        state: false,
        id: null,
        index: null,
        item: null,
        fake: true,
        action: null
      }
      this.clinicOptionsIds = []
      this.clinicsSelected = []
    }
  }
}
</script>

<style>
</style>
