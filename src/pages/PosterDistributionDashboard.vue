<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :permissions="permissions"
      :dense="true"
      wrapperClass="dashboard-table"
      hideHeaderButtons
      tableView="PosterDistributionDashBoard"
      rows="10"
      startFilter="&&Carteles!=&&Distribuciones!=&&Activa=="
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-deleted_at" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="item.item" color="negative"></q-icon>
        <q-icon name="check_circle" v-else color="positive"></q-icon>
      </template>
      <template slot="body-cell-open" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="!item.item" color="negative"></q-icon>
        <q-icon name="check_circle" v-else color="positive"></q-icon>
      </template>
      <template slot="body-cell-clinic_posters" slot-scope="item" :item="item">
        {{ item.item.filter((i) => { return !i.ends_at} ).length }}
      </template>
      <template slot="body-cell-clinic_distributions_by_campaign" slot-scope="item" :item="item">
        <template v-if="item.item">
          <template v-if="Object.keys(item.item).length">
            <div v-for="(distributions, campaign) in item.item" :key="campaign">
              {{ campaign === '' ? 'Por defecto: ' : campaign }} {{ distributions.length }}
            </div>
          </template>
          <div v-else class="text-negative text-italic"> No tiene</div>
        </template>
      </template>
      <template slot="body-cell-actions" slot-scope="item" :item="item" v-if="item.item">
        <q-btn-dropdown
          v-if="item.item.clinic_distributions_by_campaign"
          icon="insert_photo"
          :color="!item.item.clinic_distributions_by_campaign[''] ? 'grey' : 'info'"
          label="Distribución"
          unelevated
          size="sm"
          :disable="!item.item.clinic_distributions_by_campaign['']"
          :loading="confirm.loading === item.item.id"
          @click="confirm.item = computedClinics[item.item.__index]"
          >
          <div class="column q-gutter-sm q-py-sm">
            <q-btn flat v-close-popup size="sm" icon="send" color="primary" label="Generar PDFs" @click="showPDFGenerator(item.item)"></q-btn>
            <q-btn-dropdown
              color="primary"
              flat
              label="Download"
              unelevated
              size="sm"
              v-if="computedClinics[item.item.__index].campaign_facades.length"
              >
              <div class="column q-gutter-sm q-py-sm">
                <template v-for="pdf of computedClinics[item.item.__index].campaign_facades">
                  <q-btn flat v-close-popup size="sm" icon="get_app" color="primary" :label="$store.state.Model.models.campaigns.items.filter((i) => { return i.id === pdf.campaign_id })[0].name" :key="'df-' + pdf.id" @click="downloadPDF(pdf.facades_file_id)"></q-btn>
                </template>
              </div>
            </q-btn-dropdown>
          </div>
        </q-btn-dropdown>
      </template>
    </model-table>
    <q-dialog v-model="confirm.state" persistent>
      <q-card v-if="confirm.item">
        <q-card-section class="bg-primary text-white text-center">
          <span class="text-h6">Selecciona una Campaña</span>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-toggle
              v-model="confirm.options.force"
              label="Force"
              color="info"
              keep-color
            />
            <q-toggle
              v-model="confirm.options.download"
              label="Download"
              color="info"
              keep-color
            />
          </div>
        </q-card-section>
        <q-card-section class="row items-center">
          <custom-select
            v-if="campaignOptions.length"
            :dense="true"
            counter
            :max="true"
            :hide-bottom-space="true"
            :field="{name: 'campaigns', type: { model: 'clinics', default: { text: 'Selecciona una campaña'} }}"
            :sourceOptions="campaignOptions"
            :clearable='true'
            :initValue="confirm.campaignSelected"
            @updated="updateCustomSelect($event,'confirm.campaignSelected')"
            >
          </custom-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="positive" v-close-popup @click="generateClinicDistributionPDF()" :disable="!confirm.campaignSelected"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'
import CustomSelect from '../components/form/customSelect'
import { FileDownloadMethods } from '../mixins/fileMixin'

export default {
  name: 'PosterDistributionDashboard',
  mixins: [ ModelsFetcher, FileDownloadMethods ],
  components: { CustomSelect },
  data () {
    return {
      modelName: 'clinics',
      modelsNeeded: {
        clinics: {
          refresh: true,
          withTrashed: true,
          with: ['clinic_posters', 'campaign_facades'],
          appends: ['clinic_distributions_by_campaign', 'open']
        },
        campaigns: {
          refresh: false,
          withCount: ['campaign_posters']
        }
      },
      confirm: {
        state: false,
        id: null,
        index: null,
        item: null,
        loading: false,
        campaignSelected: null,
        options: {
          force: false,
          download: false
        }
      }
    }
  },
  computed: {
    campaignOptions () {
      return this.$store.state.Model.models.campaigns.items.filter(i => {
        return (i.ends_at > this.confirm.item.starts_at && i.campaign_posters_count && (!this.confirm.item.clinicFacadesByCampaign.includes(i.id) || this.confirm.options.force))
      })
    },
    computedClinics () {
      let clinics = []
      if (this.$store.state.Model.models.clinics) {
        for (let clinic of this.$store.state.Model.models.clinics.items) {
          let defClinic = clinic
          defClinic['clinicFacadesByCampaign'] = []
          if (clinic.campaign_facades.length) {
            clinic.campaign_facades.forEach((i) => { defClinic['clinicFacadesByCampaign'].push(i.campaign_id) })
          }
          clinics.push(defClinic)
        }
      }
      return clinics
    },
    clinicFacadesByCampaign () {
      let ids = []
      if (this.confirm.item) {
        if (this.confirm.item.campaign_facades.length) {
          for (let facade of this.confirm.item.campaign_facades) ids.push(facade.campaign_id)
        }
      }
      return ids
    },
    permissions () {
      let role = this.$store.state.User.groupsInfo['Clinics']
      let object = {
        show: (role !== 'guest'),
        create: ['user', 'editor', 'administrator', 'overseeker', 'root'].includes(role),
        edit: ['administrator', 'editor', 'overseeker', 'root'].includes(role),
        delete: ['overseeker', 'root'].includes(role)
      }
      return object
    }
  },
  methods: {
    downloadPDF (fileId) {
      this.confirm.loading = this.confirm.item.id
      // console.log(this.confirm)
      this.downloadFile(fileId)
        .then(() => {
          this.confirm.loading = false
          this.resetDialog()
        }).catch(() => {
          this.confirm.loading = false
          this.resetDialog()
        })
    },
    updateCustomSelect (payload, object) {
      // console.log(object)
      if (object.indexOf('.') > -1) {
        let words = object.split('.')
        let mainObject = this[words[0]]
        // console.log(mainObject)
        // console.log(words)
        // console.log(words.length)
        for (let i = 1; i < words.length - 1; i++) {
          mainObject = mainObject[words[i]]
        }
        mainObject[words[words.length - 1]] = payload !== null ? payload : null
      } else {
        this[object] = payload !== null ? payload : null
      }
    },
    // findCompleteDists (dists) {
    //   let posters = 0
    //   for (let dist of dists) {
    //     // console.log(dist)
    //     // console.log(JSON.parse(dist.distributions))
    //     // posters += JSON.parse(dist.distributions).posterIds.length
    //   }
    //   return posters > 0
    // },
    groupedBy (array, key) {
      return array.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    },
    showPDFGenerator (clinic) {
      this.confirm.state = true
      // this.confirm.item = this.computedClinics[clinic.__index]
    },
    generateClinicDistributionPDF () {
      this.confirm.loading = this.confirm.item.id
      // console.log(this.confirm.item)
      let payload = {}
      payload.url = this.$store.state.App.dataWarehouse + 'clinics/' + this.confirm.item.id + '/posterDistributionByCampaing'
      payload.method = 'POST'
      payload.params = {
        'campaign': this.confirm.campaignSelected.id,
        'force': this.confirm.options.force
      }
      this.$axios({
        url: payload.url,
        method: payload.method,
        params: payload.params
      }).then((response) => {
        let index = String(this.confirm.item.__index)
        if (this.confirm.options.download) this.downloadPDF(response.data.model.facades_file_id)
        else this.resetDialog()
        this.$store.commit('Model/addRelationItems', { name: 'clinics', relation: 'campaign_facades', items: response.data.model, parentIndex: index })
        this.$store.dispatch('Notify/displayMessage', { message: 'Distribution Complete', position: 'top', type: 'positive' })
      }).catch(() => {
        this.resetDialog()
        this.$store.dispatch('Notify/displayMessage', { message: 'Could NOT Complete. Contact Administrator', position: 'top', type: 'negative' })
      })
    },
    resetDialog () {
      this.confirm = {
        state: false,
        id: null,
        index: null,
        item: null,
        loading: false,
        campaignSelected: null,
        options: {
          force: false,
          download: false
        }
      }
    }
  }
}
</script>

<style>
</style>
