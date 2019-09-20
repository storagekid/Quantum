<template>
  <q-page class="q-pa-md q-gutter-md">
    <model-table
      ref="clinicPostersTable"
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :permissions="permissions"
      :rows="modelsNeeded.clinic_posters.paginate"
      :dense="true"
      :editAferCreate="true"
      startFilter="&&Activa!=&&Fecha de Baja=="
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      v-on:tableReady="ready = true"
      >
      <template slot="body-cell-clinic.active" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="item.item" color="positive"></q-icon>
        <q-icon name="check_circle" v-else color="negative"></q-icon>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'ClinicPosters',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'clinic_posters',
      modelsNeeded: {
        clinic_posters: {
          scoped: true,
          refresh: true,
          orderBy: 'clinic_id',
          withCount: ['clinic_poster_priorities'],
          full: true
        }
      },
      modelSelected: null,
      ready: false,
      clicked: {},
      adminOptions: {
        showTables: false
      }
    }
  },
  computed: {
    permissions () {
      let role = this.$store.state.User.groupsInfo['Clinics']
      let object = {
        show: (role !== 'guest'),
        create: ['user', 'editor', 'administrator', 'overseeker', 'root'].includes(role),
        edit: ['administrator', 'editor', 'overseeker', 'root'].includes(role),
        delete: ['overseeker', 'root'].includes(role)
      }
      return object
    },
    filteredPosters () {
      if (this.ready) return this.$store.state.Model.models.clinic_posters.items.filter((i) => { return this.$refs.clinicPostersTable.filterIds.includes(i.id) })
      return []
    },
    groupedForTable () {
      if (!this.ready) return
      // console.log('Computing Grouped')
      let grouped = {}
      let languages = []
      let sizes = []
      let priorities = []
      let types = ['Office', 'Ext']
      let counters = {}
      let createClicked = false
      for (let poster of this.filteredPosters) {
        let type = poster.clinic_poster.type === 'Office' ? 'Office' : 'Ext'
        if (!Object.keys(this.clicked).length) createClicked = true
        else if (!this.clicked[poster.priority]) createClicked = true
        if (!grouped[poster.priority]) {
          if (createClicked) {
            this.$set(this.clicked, poster.priority, {})
            this.$set(this.clicked[poster.priority], '26', {})
            this.$set(this.clicked[poster.priority], '149', {})
            this.$set(this.clicked[poster.priority]['26'], poster.clinic_poster.poster.name, {})
            this.$set(this.clicked[poster.priority]['26'][poster.clinic_poster.poster.name], 'Ext', false)
            this.$set(this.clicked[poster.priority]['26'][poster.clinic_poster.poster.name], 'Office', false)
            this.$set(this.clicked[poster.priority]['149'], poster.clinic_poster.poster.name, {})
            this.$set(this.clicked[poster.priority]['149'][poster.clinic_poster.poster.name], 'Ext', false)
            this.$set(this.clicked[poster.priority]['149'][poster.clinic_poster.poster.name], 'Office', false)
          }
          this.$set(counters, poster.priority, {})
          this.$set(counters[poster.priority], 'total', 0)
          this.$set(counters[poster.priority], 'sizes', {})
          this.$set(counters[poster.priority]['sizes'], poster.clinic_poster.poster.name, {})
          this.$set(counters[poster.priority]['sizes'][poster.clinic_poster.poster.name], 'Office', 0)
          this.$set(counters[poster.priority]['sizes'][poster.clinic_poster.poster.name], 'Ext', 0)
          this.$set(counters[poster.priority], 'langs', {})
          this.$set(counters[poster.priority]['langs'], '26', 0)
          this.$set(counters[poster.priority]['langs'], '149', 0)
          this.$set(grouped, poster.priority, {})
          this.$set(grouped[poster.priority], poster.clinic_poster.poster.name, {})
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name], '149', {})
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name], '26', {})
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['149'], 'Office', 0)
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['149'], 'Ext', 0)
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['26'], 'Office', 0)
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['26'], 'Ext', 0)
        } else if (!grouped[poster.priority][poster.clinic_poster.poster.name]) {
          if (createClicked) {
            this.$set(this.clicked[poster.priority]['26'], poster.clinic_poster.poster.name, {})
            this.$set(this.clicked[poster.priority]['26'][poster.clinic_poster.poster.name], 'Ext', false)
            this.$set(this.clicked[poster.priority]['26'][poster.clinic_poster.poster.name], 'Office', false)
            this.$set(this.clicked[poster.priority]['149'], poster.clinic_poster.poster.name, {})
            this.$set(this.clicked[poster.priority]['149'][poster.clinic_poster.poster.name], 'Ext', false)
            this.$set(this.clicked[poster.priority]['149'][poster.clinic_poster.poster.name], 'Office', false)
          }
          this.$set(counters[poster.priority]['sizes'], poster.clinic_poster.poster.name, {})
          this.$set(counters[poster.priority]['sizes'][poster.clinic_poster.poster.name], 'Office', 0)
          this.$set(counters[poster.priority]['sizes'][poster.clinic_poster.poster.name], 'Ext', 0)
          this.$set(grouped[poster.priority], poster.clinic_poster.poster.name, {})
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name], '149', {})
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name], '26', {})
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['149'], 'Office', 0)
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['149'], 'Ext', 0)
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['26'], 'Office', 0)
          this.$set(grouped[poster.priority][poster.clinic_poster.poster.name]['26'], 'Ext', 0)
        }
        grouped[poster.priority][poster.clinic_poster.poster.name][poster.clinic_poster.clinic.language_id][type] += 1
        counters[poster.priority].total += 1
        counters[poster.priority]['sizes'][poster.clinic_poster.poster.name][type] += 1
        counters[poster.priority]['langs'][poster.clinic_poster.clinic.language_id] += 1

        if (!priorities.includes(poster.priority)) priorities.push(poster.priority)
        if (!languages.includes(poster.clinic_poster.clinic.language_id)) languages.push(poster.clinic_poster.clinic.language_id)
        if (!sizes.includes(poster.clinic_poster.poster.name)) sizes.push(poster.clinic_poster.poster.name)
        // if (!types.includes(type)) types.push(type)
      }
      return {
        posters: grouped,
        priorities: priorities,
        sizes: sizes,
        types: types,
        languages: languages,
        counters: counters
      }
    }
  },
  methods: {
    findColSpan (priority, size) {
      if (this.groupedForTable.posters[priority]) {
        if (this.groupedForTable.posters[priority][size]) {
          for (let lang in this.groupedForTable.posters[priority][size]) {
            if (Object.keys(this.groupedForTable.posters[priority][size][lang]).includes('Office')) {
              return 2
            }
          }
        }
      }
      return 1
    },
    clearDone (priority) {
      for (let language in this.clicked[priority]) {
        for (let size in this.clicked[priority][language]) {
          for (let type in this.clicked[priority][language][size]) {
            this.clicked[priority][language][size][type] = false
          }
        }
      }
      localStorage.setItem('clicked', JSON.stringify(this.clicked))
    },
    toggleClicked (priority, language, size, type) {
      if (!this.groupedForTable.posters[priority][size][language][type]) return
      this.clicked[priority][language][size][type] = !this.clicked[priority][language][size][type]
    },
    saveState () {
      localStorage.setItem('clicked', JSON.stringify(this.clicked))
    },
    checkClicked (priority, language, size, type) {
      if (!this.clicked[priority]) return false
      if (!this.clicked[priority][language]) return false
      if (!this.clicked[priority][language][type]) return false
      if (!this.clicked[priority][language][type].includes(size)) return false
      return true
    },
    countPosters (priority, language, size, type) {
      if (this.groupedForTable.posters[priority]) {
        if (this.groupedForTable.posters[priority][size]) {
          if (this.groupedForTable.posters[priority][size][language]) {
            if (this.groupedForTable.posters[priority][size][language][type]) {
              return this.groupedForTable.posters[priority][size][language][type].length
            }
          }
        }
      }
      return null
    },
    priorityLanguageCount (priority, language) {
      let count = 0
      if (this.groupedForTable.posters[priority]) {
        for (let size in this.groupedForTable.posters[priority]) {
          if (this.groupedForTable.posters[priority][size][language]) {
            for (let type in this.groupedForTable.posters[priority][size][language]) {
              count += this.groupedForTable.posters[priority][size][language][type].length
            }
          }
        }
      }
      return count
    },
    prioritySizeCount (priority, size) {
      let count = 0
      if (this.groupedForTable.posters[priority]) {
        if (this.groupedForTable.posters[priority][size]) {
          for (let lang in this.groupedForTable.posters[priority][size]) {
            for (let type in this.groupedForTable.posters[priority][size][lang]) {
              count += this.groupedForTable.posters[priority][size][lang][type].length
            }
          }
        }
      }
      return count
    },
    priorityTotalCount (priority) {
      let count = 0
      if (this.groupedForTable.posters[priority]) {
        for (let lang of this.groupedForTable['languages']) {
          count += this.priorityLanguageCount(priority, lang)
        }
      }
      return count
    },
    translatedPriority (priority) {
      switch (priority) {
        case 1:
          return 'Recalls'
        case 2:
          return 'Implantology'
        case 3:
          return 'Financing'
        case 4:
          return 'Orthodontic'
        case 5:
          return 'Benefits'
      }
    }
  },
  created () {
    if (localStorage.clicked) this.clicked = JSON.parse(localStorage.clicked)
  }
}
</script>

<style>
</style>
