<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div :class="['col', 'items-start', 'q-col-gutter-md', 'full-width', {'row': !showTable}]">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card
            :style="{order: showTable === 'clinics' ? 1 : 1+1}"
            v-if="!showTable || showTable === 'clinics'"
            >
            <q-img
              :src="$store.state.App.publicSources + '/img/clinics-card-header.jpg'"
              style="max-height: 200px"
              basic
              :ratio="4/3"
              v-if="!showTable"
              >
              <div class="absolute-bottom text-h6 bg-primary">
                Clínicas
              </div>
            </q-img>

            <q-card-section v-else class="bg-primary text-h6 text-white">
              <div>Cartelería</div>
            </q-card-section>

            <q-list separator>
              <q-item clickable @click="toggleTable('clinics', 'open')">
                <q-item-section avatar>
                  <q-icon color="positive" name="lock_open" />
                </q-item-section>

                <q-item-section>
                  <q-item-label caption>Locales / Centros de Coste</q-item-label>
                  <q-item-label class="text-h4 text-primary"><strong>{{ clinics.open.length }}</strong> / {{ clinics.uniques.length }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable @click="toggleTable('clinics', 'closed')">
                <q-item-section avatar>
                  <q-icon color="red" name="lock" />
                </q-item-section>

                <q-item-section>
                  <q-item-label caption>Cerradas</q-item-label>
                  <q-item-label class="text-h5 text-primary text-bold">{{ clinics.closed.length }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable @click="toggleTable('clinics', 'scheduled')">
                <q-item-section avatar>
                  <q-icon color="primary" name="add_comment" />
                </q-item-section>

                <q-item-section>
                  <q-item-label caption>Aperturas Previstas</q-item-label>
                  <q-item-label class="text-h5 text-primary text-bold">{{ clinics.scheduled.length }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable @click="toggleTable('clinics', 'nextOpening')">
                <q-item-section avatar>
                  <q-icon color="warning" name="new_releases" />
                </q-item-section>

                <q-item-section>
                  <q-item-label caption>Próxima Apertura</q-item-label>
                  <q-item-label class="text-h6 text-primary text-bold">{{ clinics.nextOpening[0].nickname }}</q-item-label>
                  <q-item-label class="text-primary text-bold">
                    {{ new Date(clinics.nextOpening[0].starts_at).toLocaleDateString('es-ES', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="view_list" />
                </q-item-section>
                <q-item-section>
                  <div class="row">
                    <div class="col-12 q-mb-md">
                      <q-item-label class="text-h6 text-primary text-bold">Clínicas por Nº de Carteles</q-item-label>
                    </div>
                    <div class="col-4">
                      <template v-for="(number, index) in clinicByPosterCount.clinics">
                        <div class="row items-center no-wrap" :key="index" v-if="index !== 'total' && index < 4">
                          <q-chip square clickable class="bg-grey-3" @click.stop="toggleTable('clinics', 'clinicByPosters.clinics.' + index, false, 'clinic_posters')">
                            <q-avatar color="primary" text-color="white">{{ index }}</q-avatar>
                            <strong>{{ clinicByPosterCount.clinics[index].length }}</strong>
                          </q-chip>
                          <q-circular-progress
                            show-value
                            font-size="12px"
                            :value="Math.round((clinicByPosterCount.clinics[index].length*100) / clinicByPosterCount.total)"
                            size="md"
                            :thickness="0.22"
                            color="primary"
                            track-color="grey-4"
                            >
                            {{ Math.round((clinicByPosterCount.clinics[index].length*100) / clinicByPosterCount.total) }}%
                          </q-circular-progress>
                        </div>
                      </template>
                    </div>
                    <div class="col-4">
                      <template v-for="(number, index) in clinicByPosterCount.clinics">
                        <div class="row items-center no-wrap" :key="index" v-if="index !== 'total' && index > 3 && index < 7">
                          <q-chip square clickable class="bg-grey-3" @click.stop="toggleTable('clinics', 'clinicByPosters.clinics.' + index, false, 'clinic_posters')">
                            <q-avatar color="primary" text-color="white">{{ index }}</q-avatar>
                            <strong>{{ clinicByPosterCount.clinics[index].length }}</strong>
                          </q-chip>
                          <q-circular-progress
                            show-value
                            font-size="12px"
                            :value="Math.round((clinicByPosterCount.clinics[index].length*100) / clinicByPosterCount.total)"
                            size="md"
                            :thickness="0.22"
                            color="primary"
                            track-color="grey-4"
                            >
                            {{ Math.round((clinicByPosterCount.clinics[index].length*100) / clinicByPosterCount.total) }}%
                          </q-circular-progress>
                        </div>
                      </template>
                    </div>
                    <div class="col-4">
                      <template v-for="(number, index) in clinicByPosterCount.clinics">
                        <div class="row items-center no-wrap" :key="index" v-if="index !== 'total' && index > 6">
                          <q-chip square clickable class="bg-grey-3" @click.stop="toggleTable('clinics', 'clinicByPosters.clinics.' + index, false, 'clinic_posters')">
                            <q-avatar color="primary" text-color="white">{{ index }}</q-avatar>
                            <strong>{{ clinicByPosterCount.clinics[index].length }}</strong>
                          </q-chip>
                          <q-circular-progress
                            show-value
                            font-size="12px"
                            :value="Math.round((clinicByPosterCount.clinics[index].length*100) / clinicByPosterCount.total)"
                            size="md"
                            :thickness="0.22"
                            color="primary"
                            track-color="grey-4"
                            >
                            {{ Math.round((clinicByPosterCount.clinics[index].length*100) / clinicByPosterCount.total) }}%
                          </q-circular-progress>
                        </div>
                      </template>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card
            :style="{order: showTable === 'clinic_posters' ? 1 : 1+1}"
            v-if="!showTable || showTable === 'clinic_posters'"
            >
            <q-img
              :src="$store.state.App.publicSources + '/img/poster-card-header.jpg'"
              basic
              style="max-height: 200px"
              :ratio="4/3"
              v-if="!showTable"
              >
              <div class="absolute-bottom text-h6 bg-primary">
                Cartelería
              </div>
            </q-img>
            <q-card-section v-else class="bg-primary text-h6 text-white">
              <div>Cartelería</div>
            </q-card-section>

            <q-list separator>
              <q-item clickable @click="toggleTable('clinic_posters', 'faces', true)">
                <q-item-section avatar>
                  <q-icon color="primary" name="photo_library" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h4 text-primary text-bold">
                    {{ clinic_posters.faces_count }}
                  </q-item-label>
                  <p caption class="text-primary q-my-none"><strong>Total Carteles (Caras)</strong></p>
                  <q-item-label class="text-h5 text-grey-8 no-wrap q-mt-sm">
                    {{ clinic_posters.faces_normal }} / {{ clinic_posters.faces_frosted }}
                  </q-item-label>
                  <p caption class="text-grey-8 q-my-none">Normales / Vinilos</p>
                </q-item-section>

                <q-item-section class="row no-wrap">
                  <template v-for="(posters, priority) in clinic_posters.faces">
                    <div class="row items-center no-wrap" :key="priority" v-if="clinic_posters.faces[priority].total">
                      <q-chip square clickable class="bg-grey-3" @click.stop="toggleTable('clinic_posters', 'faces.' + priority)">
                        <q-avatar :color="priority === '0' ? 'red' : ('primary-dark-' + (10 - parseInt(priority)))" text-color="white">{{ priority }}</q-avatar>
                        <strong>{{ clinic_posters.faces[priority].total }}</strong> / {{ clinic_posters.faces[priority].frosted.length }}
                      </q-chip>
                      <q-circular-progress
                        show-value
                        font-size="12px"
                        :value="Math.round((clinic_posters.faces[priority].total*100) / clinic_posters.faces_count)"
                        size="md"
                        :thickness="0.22"
                        :color="priority === '0' ? 'red' : ('primary-dark-' + (10 - parseInt(priority)))"
                        track-color="grey-4"
                        >
                        {{ Math.round((clinic_posters.faces[priority].total*100) / clinic_posters.faces_count) }}%
                      </q-circular-progress>
                    </div>
                  </template>
                </q-item-section>
              </q-item>

              <q-item clickable @click="toggleTable('clinic_posters', 'translights', true)">
                <q-item-section avatar>
                  <q-icon color="primary" name="crop_original" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h4 text-primary text-bold">
                    {{ clinic_posters.translights_count }}
                  </q-item-label>
                  <p caption class="text-primary q-my-none"><strong>Total Translights (Caras)</strong></p>
                  <q-item-label class="text-h5 text-grey-8 no-wrap q-mt-sm">
                    {{ clinic_posters.translights_normal }} / {{ clinic_posters.translights_frosted }}
                  </q-item-label>
                  <p caption class="text-grey-8 q-my-none">Normales / Vinilos</p>
                </q-item-section>

                <q-item-section class="row no-wrap">
                  <template v-for="(posters, priority) in clinic_posters.translights">
                    <div class="row items-center no-wrap" :key="priority" v-if="clinic_posters.translights[priority].total">
                      <q-chip square clickable class="bg-grey-3" @click.stop="toggleTable('clinic_posters', 'translights.' + priority)">
                        <q-avatar :color="priority === '0' ? 'red' : ('primary-dark-' + (10 - parseInt(priority)))" text-color="white">{{ priority }}</q-avatar>
                        <strong>{{ clinic_posters.translights[priority].total }}</strong> / {{ clinic_posters.translights[priority].frosted.length }}
                      </q-chip>
                      <q-circular-progress
                        show-value
                        font-size="12px"
                        :value="Math.round((clinic_posters.translights[priority].total*100) / clinic_posters.translights_count)"
                        size="md"
                        :thickness="0.22"
                        :color="priority === '0' ? 'red' : ('primary-dark-' + (10 - parseInt(priority)))"
                        track-color="grey-4"
                        >
                        {{ Math.round((clinic_posters.translights[priority].total*100) / clinic_posters.translights_count) }}%
                      </q-circular-progress>
                    </div>
                  </template>
                </q-item-section>
              </q-item>

              <q-item clickable @click="toggleTable('clinic_posters', 'foams', true)">
                <q-item-section avatar>
                  <q-icon color="primary" name="photo_album" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h4 text-primary text-bold">
                    {{ clinic_posters.foams_count }}
                  </q-item-label>
                  <p caption class="text-primary q-my-none"><strong>Total foams (Caras)</strong></p>
                  <q-item-label class="text-h5 text-grey-8 no-wrap q-mt-sm">
                    {{ clinic_posters.foams_normal }} / {{ clinic_posters.foams_frosted }}
                  </q-item-label>
                  <p caption class="text-grey-8 q-my-none">Normales / Vinilos</p>
                </q-item-section>

                <q-item-section class="row no-wrap">
                  <template v-for="(posters, priority) in clinic_posters.foams">
                    <div class="row items-center no-wrap" :key="priority" v-if="clinic_posters.foams[priority].total">
                      <q-chip square clickable class="bg-grey-3" @click.stop="toggleTable('clinic_posters', 'foams.' + priority)">
                        <q-avatar :color="priority === '0' ? 'red' : ('primary-dark-' + (10 - parseInt(priority)))" text-color="white">{{ priority }}</q-avatar>
                        <strong>{{ clinic_posters.foams[priority].total }}</strong> / {{ clinic_posters.foams[priority].frosted.length }}
                      </q-chip>
                      <q-circular-progress
                        show-value
                        font-size="12px"
                        :value="Math.round((clinic_posters.foams[priority].total*100) / clinic_posters.foams_count)"
                        size="md"
                        :thickness="0.22"
                        :color="priority === '0' ? 'red' : ('primary-dark-' + (10 - parseInt(priority)))"
                        track-color="grey-4"
                        >
                        {{ Math.round((clinic_posters.foams[priority].total*100) / clinic_posters.foams_count) }}%
                      </q-circular-progress>
                    </div>
                  </template>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card
            :style="{order: showTable === 'campaigns' ? 1 : 1+1}"
            v-if="!showTable || showTable === 'campaigns'"
            >
            <q-img
              :src="$store.state.App.publicSources + '/img/campaigns-card-header.jpg'"
              style="max-height: 200px"
              basic
              :ratio="4/3"
              v-if="!showTable"
              >
              <div class="absolute-bottom text-h6 bg-primary">
                Campañas
              </div>
            </q-img>

            <q-card-section v-else class="bg-primary text-h6 text-white">
              <div>Campañas</div>
            </q-card-section>

            <q-list separator>
              <q-item clickable @click="toggleTable('campaigns', 'open')">
                <q-item-section avatar>
                  <q-icon color="positive" name="lock_open" />
                </q-item-section>

                <q-item-section v-if="campaigns.open.length === 1">
                  <q-list separator>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Campaña activa</q-item-label>
                        <q-item-label class="text-h6 text-primary"><strong>{{ campaigns.open[0].name }}</strong></q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="campaigns.open[0].parent">
                      <q-item-section>
                        <q-item-label caption>Depende de</q-item-label>
                        <q-item-label class="text-h6 text-accent"><strong>{{ campaigns.open[0].parent.name }}</strong></q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-h6 text-accent"><strong>Prioridades Cartelería</strong></q-item-label>
                        <template v-for="(priority, index) in campaigns.open[0].campaign_poster_priorities">
                            <q-chip square class="bg-grey-3" :key="index">
                              <q-avatar :color="'primary-dark-' + (10 - parseInt(priority.priority))" text-color="white">{{ priority.priority }}</q-avatar>
                              <strong>{{ priority.poster_model_name }}</strong>
                            </q-chip>
                        </template>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-item-section>
              </q-item>

              <q-item clickable @click="toggleTable('campaigns', 'total')">
                <q-item-section avatar>
                  <q-icon color="positive" name="lock_open" />
                </q-item-section>

                <q-item-section>
                  <q-item-label caption>Campañas Totales</q-item-label>
                  <q-item-label class="text-h4 text-primary"><strong>{{ campaigns.total.length }}</strong></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div class="col-xs-12">
          <q-card v-if="showTable">
            <q-btn color="info" class="full-width" label="Cerrar" @click="closeTable"></q-btn>
          </q-card>
        </div>
      </div>
      <div class="col-8" v-if="showTable">
        <q-card v-if="showTable">
          <model-table
            :sticky="true"
            :virtualScroll="true"
            :modelName="showTable"
            tableView="marketingUserHome"
            :editAferCreate="true"
            :dense="true"
            hideHeaderButtons
            :sourceModel="sourceModel"
            v-if="modelsReady"
            >
          </model-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'MarketingUserHome',
  mixins: [ModelsFetcher],
  data () {
    return {
      // modelName: 'clinics',
      // show: null,
      modelsNeeded: {
        clinics: {
          refresh: true,
          withTrashed: true,
          with: ['clinic_posters.poster'],
          orderBy: 'city',
          appends: ['open', 'active']
        },
        campaigns: {
          with: ['parent', 'children', 'campaign_poster_priorities'],
          refresh: true,
          orderBy: 'starts_at',
          orderDesc: true
        },
        clinic_posters: {
        },
        clinic_poster_priorities: {
        },
        posters: {
        }
      },
      showTable: false,
      tables: {}
    }
  },
  computed: {
    campaigns () {
      let models = { total: [], active: [], open: [] }
      if (!this.$store.state.Model.models.campaigns.items.length) return models
      this.$store.state.Model.models.campaigns.items.forEach((i) => {
        models.total.push(i)
        if (i.open) models.open.push(i)
        if (i.active) models.active.push(i)
      })
      return models
    },
    clinics () {
      let clinics = { total: [], open: [], scheduled: [], closed: [], nextOpening: null, uniques: [] }
      if (!this.$store.state.Model.models.clinics.items.length) return clinics
      this.$store.state.Model.models.clinics.items.forEach((i) => {
        clinics.total.push(i)
        if (i.open) {
          if (!i.parent_id) clinics.open.push(i)
          if (!clinics.uniques.includes(i.clinic_cloud_id)) clinics.uniques.push(i.clinic_cloud_id)
        } else if (!i.open && !i.parent_id && i.ends_at) clinics.closed.push(i)
        else if (!i.open && !i.parent_id && !i.ends_at) clinics.scheduled.push(i)
      })
      let nextOpening = clinics.scheduled.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
      clinics.nextOpening = [nextOpening[0]]
      return clinics
    },
    sourceModel () {
      if (!this.showTable) return []
      let modelName = this.tables[this.showTable].model ? this.tables[this.showTable].model : this.showTable
      if (this.tables[this.showTable].filter.indexOf('.') > -1) {
        let words = this.tables[this.showTable].filter.split('.')
        let model = this[modelName][words[0]]
        for (let i = 1; i < words.length; i++) {
          model = model[words[i]]
        }
        if (Array.isArray(model)) return model
        else if (typeof model === 'object') {
          // console.log('Here')
          let modelToReturn = []
          for (let sub in model) {
            if (Array.isArray(model[sub])) modelToReturn = modelToReturn.concat(model[sub])
          }
          return modelToReturn
        }
      } else if (this.tables[this.showTable].object) {
        let model = []
        for (let group in this[modelName][this.tables[this.showTable].filter]) {
          if (Array.isArray(this[modelName][this.tables[this.showTable].filter][group])) model = model.concat(this[modelName][this.tables[this.showTable].filter][group])
          else if (typeof this[modelName][this.tables[this.showTable].filter][group] === 'object') {
            let object = this[modelName][this.tables[this.showTable].filter][group]
            for (let sub in object) {
              if (Array.isArray(object[sub])) model = model.concat(object[sub])
            }
          }
        }
        return model
      }
      return this[modelName][this.tables[this.showTable].filter]
    },
    posters () {
      return this.$store.state.Model.models.posters.items
    },
    clinic_poster_priorities () {
      let priorities = { active: [], '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [], '8': [] }
      this.$store.state.Model.models.clinic_poster_priorities.items.forEach((i) => {
        if (!i.ends_at) {
          priorities.active.push(i)
          if (i.priority === 1) priorities['1'].push(i)
          else if (i.priority === 2) priorities['2'].push(i)
          else if (i.priority === 3) priorities['3'].push(i)
          else if (i.priority === 4) priorities['4'].push(i)
          else if (i.priority === 5) priorities['5'].push(i)
          else if (i.priority === 6) priorities['6'].push(i)
          else if (i.priority === 7) priorities['7'].push(i)
          else if (i.priority === 8) priorities['8'].push(i)
        }
      })
      return priorities
    },
    clinic_posters () {
      if (!this.clinics.total.length) return []
      let translightIds = []
      this.posters.forEach((i) => { if (i.material === 'Translight') translightIds.push(i.id) })
      let priorities = {
        '1': { frosted: [], normal: [], total: 0 },
        '2': { frosted: [], normal: [], total: 0 },
        '3': { frosted: [], normal: [], total: 0 },
        '4': { frosted: [], normal: [], total: 0 },
        '5': { frosted: [], normal: [], total: 0 },
        '6': { frosted: [], normal: [], total: 0 },
        '7': { frosted: [], normal: [], total: 0 },
        '8': { frosted: [], normal: [], total: 0 },
        '0': { frosted: [], normal: [], total: 0 }
      }
      let posters = {
        'faces': JSON.parse(JSON.stringify(priorities)),
        'faces_count': 0,
        'faces_frosted': 0,
        'faces_normal': 0,
        'foams': JSON.parse(JSON.stringify(priorities)),
        'foams_count': 0,
        'foams_frosted': 0,
        'foams_normal': 0,
        'translights': JSON.parse(JSON.stringify(priorities)),
        'translights_count': 0,
        'translights_frosted': 0,
        'translights_normal': 0,
        clinicByPosters: { clinics: {}, total: 0 }
      }
      this.clinics.total.forEach(i => {
        if (!i.active) return
        if (!i.clinic_posters) return
        i['clinic_posters_count'] = 0
        i.clinic_posters.forEach(o => {
          // let odd = i.clinic_posters.length % 2
          // i['clinic_posters_count'] = odd ? i.clinic_posters.length : i.clinic_posters.length / 2
          if (!o.ends_at) {
            i['clinic_posters_count']++
            o['clinic'] = i
            let clinicPosterPriority = this.clinic_poster_priorities.active.filter((u) => { return u.clinic_poster_id === o.id })
            o['default_priority'] = clinicPosterPriority.length ? clinicPosterPriority[0].priority : '0'
            // o['default_priority'] = this.clinic_poster_priorities.active.filter((u) => { return u.clinic_poster_id === o.id })[0].priority
            let frosted = o.type.indexOf('O') > -1
            // console.log(o['priority'])
            switch (o.default_priority) {
              case 1:
                if (frosted) posters.faces['1'].frosted.push(o)
                else posters.faces['1'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['1'].frosted.push(o) : posters.translights['1'].normal.push(o)
                } else frosted ? posters.foams['1'].frosted.push(o) : posters.foams['1'].normal.push(o)
                break
              case 2:
                if (frosted) posters.faces['2'].frosted.push(o)
                else posters.faces['2'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['2'].frosted.push(o) : posters.translights['2'].normal.push(o)
                } else frosted ? posters.foams['2'].frosted.push(o) : posters.foams['2'].normal.push(o)
                break
              case 3:
                if (frosted) posters.faces['3'].frosted.push(o)
                else posters.faces['3'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['3'].frosted.push(o) : posters.translights['3'].normal.push(o)
                } else frosted ? posters.foams['3'].frosted.push(o) : posters.foams['3'].normal.push(o)
                break
              case 4:
                if (frosted) posters.faces['4'].frosted.push(o)
                else posters.faces['4'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['4'].frosted.push(o) : posters.translights['4'].normal.push(o)
                } else frosted ? posters.foams['4'].frosted.push(o) : posters.foams['4'].normal.push(o)
                break
              case 5:
                if (frosted) posters.faces['5'].frosted.push(o)
                else posters.faces['5'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['5'].frosted.push(o) : posters.translights['5'].normal.push(o)
                } else frosted ? posters.foams['5'].frosted.push(o) : posters.foams['5'].normal.push(o)
                break
              case 6:
                if (frosted) posters.faces['6'].frosted.push(o)
                else posters.faces['6'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['6'].frosted.push(o) : posters.translights['6'].normal.push(o)
                } else frosted ? posters.foams['6'].frosted.push(o) : posters.foams['6'].normal.push(o)
                break
              case 7:
                if (frosted) posters.faces['7'].frosted.push(o)
                else posters.faces['7'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['7'].frosted.push(o) : posters.translights['7'].normal.push(o)
                } else frosted ? posters.foams['7'].frosted.push(o) : posters.foams['7'].normal.push(o)
                break
              case 8:
                if (frosted) posters.faces['8'].frosted.push(o)
                else posters.faces['8'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['8'].frosted.push(o) : posters.translights['8'].normal.push(o)
                } else frosted ? posters.foams['8'].frosted.push(o) : posters.foams['8'].normal.push(o)
                break
              case '0':
                if (frosted) posters.faces['0'].frosted.push(o)
                else posters.faces['0'].normal.push(o)
                if (translightIds.includes(o.poster_id)) {
                  frosted ? posters.translights['0'].frosted.push(o) : posters.translights['0'].normal.push(o)
                } else frosted ? posters.foams['0'].frosted.push(o) : posters.foams['0'].normal.push(o)
                break
            }
            // posters.faces.push(o)
            // if (translightIds.includes(o.poster_id)) posters.translights.push(o)
            // else posters.foams.push(o)
          }
        })
        // console.log(i.clinic_posters_count)
        let odd = i.clinic_posters_count % 2
        if (!odd) i.clinic_posters_count = i.clinic_posters_count / 2
      })
      for (let priority in posters.faces) {
        posters.faces_count += posters.faces[priority].frosted.length
        posters.faces_count += posters.faces[priority].normal.length
        posters.faces_frosted += posters.faces[priority].frosted.length
        posters.faces_normal += posters.faces[priority].normal.length
        posters.faces[priority].total += posters.faces[priority].frosted.length
        posters.faces[priority].total += posters.faces[priority].normal.length

        posters.foams_count += posters.foams[priority].frosted.length
        posters.foams_count += posters.foams[priority].normal.length
        posters.foams_frosted += posters.foams[priority].frosted.length
        posters.foams_normal += posters.foams[priority].normal.length
        posters.foams[priority].total += posters.foams[priority].frosted.length
        posters.foams[priority].total += posters.foams[priority].normal.length

        posters.translights_count += posters.translights[priority].frosted.length
        posters.translights_count += posters.translights[priority].normal.length
        posters.translights_frosted += posters.translights[priority].frosted.length
        posters.translights_normal += posters.translights[priority].normal.length
        posters.translights[priority].total += posters.translights[priority].frosted.length
        posters.translights[priority].total += posters.translights[priority].normal.length
      }
      for (let clinic of this.clinics.open) {
        if (!clinic.clinic_posters_count) continue
        if (!posters.clinicByPosters.clinics[clinic.clinic_posters_count]) this.$set(posters.clinicByPosters.clinics, clinic.clinic_posters_count, [])
        posters.clinicByPosters.clinics[clinic.clinic_posters_count].push(clinic)
        posters.clinicByPosters.total++
      }
      return posters
    },
    clinicByPosterCount () {
      if (this.clinic_posters) {
        if (this.clinic_posters.clinicByPosters) return this.clinic_posters.clinicByPosters
      }
      return {}
    }
  },
  methods: {
    closeTable () {
      this.showTable = false
    },
    toggleTable (table, filter, object = false, tableModel = null) {
      if (this.showTable !== table) {
        console.log('Destoying Table')
        this.showTable = false
        if (!this.tables[table]) {
          this.$set(this.tables, table, {})
          this.$set(this.tables[table], 'filter', filter)
          this.$set(this.tables[table], 'object', object)
          this.$set(this.tables[table], 'model', tableModel)
        } else if (this.tables[table].filter !== filter) {
          this.tables[table].filter = filter
          this.tables[table].object = object
          this.tables[table].model = tableModel
        }
        this.showTable = table
      } else if (this.tables[table].filter === filter) {
        this.showTable = false
      } else {
        this.$set(this.tables[table], 'object', object)
        this.$set(this.tables[table], 'model', tableModel)
        this.tables[table].filter = filter
      }
    }
  },
  created () {
    // console.log('created')
    this.fetching = true
    this.getModelsNeeded().then((size) => {
      this.modelsFetched = size
      this.fetching = false
      this.$q.loading.hide()
    }).catch((response) => {
      this.fetching = false
      this.$q.loading.hide()
    })
  }
}
</script>
<style lang="stylus" scoped>
  .first {
    order: 1
  }
  .second {
    order: 2
  }
</style>
