<template>
  <div v-if="model" class="q-gutter-md">
    <q-card>
      <q-card-section class="bg-primary q-pa-xs">
        <div class="text-h6 text-white text-center">{{ model.nickname }}</div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section class="bg-secondary q-pa-xs">
        <div class="text-h6 text-primary text-center">Posters</div>
      </q-card-section>
      <q-card-section class="">
        <q-select
          icon="subject"
          bottom-slots
          name="campaign-select"
          label="Selecciona una Campaña"
          stack-label
          multiple
          v-model="campaign"
          :options="campaignOptions"
        />
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <template v-for="(campaignModel, index) in campaignOptions">
          <q-card v-if="selectedIds.includes(campaignModel.value) && ($store.state.Model.models['campaigns'].viewsFetched.includes(campaignModel.value) || campaignModel.value === '')" :key="'Campaign' + index">
              <q-card-section class="bg-accent q-pa-xs">
                <div class="text-subtitle text-white text-center">{{ campaignModel.label }}</div>
              </q-card-section>
              <q-card-section v-if="Object.keys(model).length">
                  <template v-if="model.posters[campaignModel.value]">
                    <div class="row justify-center items-start q-gutter-md">
                      <q-card v-for="(poster, index) in model.posters[campaignModel.value]" :key="index + 'poster'" class="col-md-auto">
                        <q-card-section class="bg-secondary q-pa-xs">
                          <div class="text-caption text-primary text-center">{{poster.clinic_poster.poster.name + ' ' + poster.clinic_poster.poster.material}}</div>
                        </q-card-section>
                        <q-card-section class="flex justify-center">
                          <div
                            v-if="campaignModel.value === ''"
                            :style="{
                              'width': poster.clinic_poster.poster.width / 10 + 'px',
                              'height': poster.clinic_poster.poster.height / 10 + 'px',
                              'opacity': poster.priority === 1 ? 1 : poster.priority === 2 ? 0.9 : poster.priority === 3 ? 0.8 : poster.priority === 4 ? 0.7 : poster.priority === 5 ? 0.6 : 0.5
                            }"
                            class="poster q-ma-none flex column justify-center text-center"
                            >
                            <span class="text-h6">{{ poster.priority }}</span>
                            <span class="text-h6">{{ poster.clinic_poster.type }}</span>
                          </div>
                          <q-img
                            v-else
                            :src="getPosterImage(campaignModel.value, poster.clinic_poster.poster_id, poster.clinic_poster.type, poster.priority)"
                            :style="{
                              'min-width': poster.clinic_poster.poster.width / 5 + 'px',
                              'min-height': poster.clinic_poster.poster.height / 5 + 'px',
                            }
                            ">
                            <div class="absolute-bottom text-overline text-center q-pa-xs">
                              {{ getPosterModel(campaignModel.value, poster.priority) }}
                            </div>
                            <template v-slot:loading>
                              <div
                                :style="{
                                  'width': poster.clinic_poster.poster.width / 10 + 'px',
                                  'height': poster.clinic_poster.poster.height / 10 + 'px',
                                  'opacity': poster.priority === 1 ? 1 : poster.priority === 2 ? 0.9 : poster.priority === 3 ? 0.8 : poster.priority === 4 ? 0.7 : poster.priority === 5 ? 0.6 : 0.5
                                }"
                                class="poster q-ma-none flex column justify-center text-center"
                                >
                                <span class="text-h6">{{ poster.priority }}</span>
                              </div>
                            </template>
                          </q-img>
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>
                  <template v-else>
                    <q-banner class="bg-warning text-white full-width q-my-sm">
                      {{ getNoDistributionText(campaignModel.value) }}
                    </q-banner>
                    <div class="row justify-center items-start q-gutter-md">
                      <q-card v-for="(poster, index) in model.posters['']" :key="index + 'poster'" class="col-md-auto">
                        <q-card-section class="bg-secondary q-pa-xs">
                          <div class="text-caption text-primary text-center">{{poster.clinic_poster_name}}</div>
                        </q-card-section>
                        <q-card-section class="flex justify-center">
                          <q-img
                            :src="getPosterImage(campaignModel.id, poster.clinic_poster.poster_id, poster.clinic_poster.type, poster.priority)"
                            :style="{
                              'min-width': poster.clinic_poster.poster.width / 5 + 'px',
                              'min-height': poster.clinic_poster.poster.height / 5 + 'px',
                            }
                            ">
                            <div class="absolute-bottom text-overline text-center q-pa-xs">
                              {{ getPosterModel(campaignModel.id, poster.priority) }}
                            </div>
                            <template v-slot:loading>
                              <div
                                :style="{
                                  'width': poster.clinic_poster.poster.width / 10 + 'px',
                                  'height': poster.clinic_poster.poster.height / 10 + 'px',
                                  'opacity': poster.priority === 1 ? 1 : poster.priority === 2 ? 0.9 : poster.priority === 3 ? 0.8 : poster.priority === 4 ? 0.7 : poster.priority === 5 ? 0.6 : 0.5
                                }"
                                class="poster q-ma-none flex column justify-center text-center"
                                >
                                <span class="text-h6">{{ poster.priority }}</span>
                              </div>
                            </template>
                          </q-img>
                        </q-card-section>
                      </q-card>
                    </div>
                  </template>
              </q-card-section>
          </q-card>
        </template>
      </q-card-section>
      <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script>
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'ClinicView',
  mixins: [ModelsFetcher],
  props: ['id'],
  data () {
    return {
      modelsNeeded: {
        campaigns: {
          scoped: false,
          full: true,
          refresh: false,
          cache: false,
          where: false
        }
      },
      campaign: [{ label: 'Distribución Genérica / Sin Campaña', value: '' }],
      visible: false,
      ready: true
      // model: {}
    }
  },
  watch: {
    campaign () {
      if (!this.campaign.length) return
      this.ready = false
      this.visible = true
      let viewsReady = 0
      for (let item of this.campaign) {
        if (item.value === '') {
          viewsReady++
          if (viewsReady === this.campaign.length) {
            this.ready = true
            this.visible = false
          }
        } else if (this.$store.state.Model.models['campaigns'].viewsFetched.includes(item.value)) {
          viewsReady++
          if (viewsReady === this.campaign.length) {
            this.ready = true
            this.visible = false
          }
        } else {
          this.$store.dispatch('Model/getModelView', { model: 'campaigns', id: item.value })
            .then((data) => {
              viewsReady++
              if (viewsReady === this.campaign.length) {
                this.ready = true
                this.visible = false
              }
            })
        }
      }
    }
  },
  computed: {
    model () {
      return this.$store.state.Model.models['clinics'].items.filter(i => { return i.id === this.id })[0]
    },
    selectedIds () {
      let ids = []
      for (let campaign of this.campaign) {
        ids.push(campaign.value)
      }
      return ids
    },
    campaignOptions () {
      let options = []
      let nooptions = { label: 'Distribución Genérica / Sin Campaña', value: '' }
      options.push(nooptions)
      for (let item of this.$store.state.Model.models.campaigns.items) {
        // let option = {}
        // for (let key in item) {
        //   this.$set(option, key, item[key])
        // }
        options.push(item)
      }
      return options
    },
    posters () {
      if (this.model) {
        return this.model.posters
        // let posters = {}
        // for (let poster of this.model.posters['']) {
        //   let item = {}
        //   item['width'] = poster.clinic_poster.poster.width
        //   item['height'] = poster.clinic_poster.poster.height
        //   item['priority'] = poster.priority
        // }
        // return posters
      }
      return {}
    }
  },
  methods: {
    getNoDistributionText (campaign) {
      return campaign === '' ? 'No existe una distribución genérica para esta clínica' : 'No existe una distribución específica para esta campaña, carteles de campaña basados en la distribución genérica'
    },
    getPosterModel (campaignId, priority) {
      let campaign
      let model
      for (let item of this.$store.state.Model.models.campaigns.items) {
        if (item.id === campaignId) {
          campaign = item
          break
        }
      }
      for (let item of campaign.campaign_poster_priorities) {
        if (item.priority === priority) {
          model = item.poster_model_name
        }
      }
      return model
    },
    getPosterImage (campaignId, poster, type, priority, clinic) {
      let campaign = null
      let model = null
      let image = null
      type === 'Int' ? type = [type, 'Ext'] : type = [type]
      // type = [type]
      // let options = []
      let levelFound = 5
      for (let item of this.$store.state.Model.models.campaigns.items) {
        if (item.id === campaignId) {
          campaign = item
          break
        }
      }
      for (let item of campaign.campaign_poster_priorities) {
        if (item.priority === priority) {
          model = item.poster_model_id
        }
      }
      for (let item of campaign.campaign_posters) {
        if (item.poster_model_id === model && item.poster_id === poster && type.includes(item.type) && item.language_id === this.model.language_id) {
          // options.push(item)
          if (item.clinic_id && item.clinic_id === this.model.id) {
            image = item.thumbnail64
            break
          } else if (item.county_id && item.county_id === this.model.county_id && levelFound > 2) {
            image = item.thumbnail64
            levelFound = 2
          } else if (item.state_id && item.state_id === this.model.county.state_id && levelFound > 3) {
            image = item.thumbnail64
            levelFound = 3
          } else if (!item.clinic_id && !item.county_id && !item.state_id && levelFound > 4) {
            image = item.thumbnail64
          }
        }
      }
      return image
    }
  },
  created () {
    // this.$store.dispatch('Model/getModelView', { model: 'clinics', id: this.id }).then(() => { return true })
    // this.$store.dispatch('Model/getModelView', { model: 'clinics', id: this.id }).then((data) => { this.model = data.model })
  }
}
</script>

<style lang="stylus">
// @import '~quasar-variables'
 .poster {
   background-color: $primary;
   border: 1px dashed $primary;
   color: white;
 }
</style>
