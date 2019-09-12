<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :permissions="permissions"
      :dense="true"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-sanitary_codes" slot-scope="item" :item="item">
        {{ item.item.length }}
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'PosterModels',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'poster_models',
      modelsNeeded: {
        poster_models: {
          scoped: false,
          refresh: false,
          cache: false,
          where: false,
          full: true
        }
        // campaigns: {
        //   scoped: false,
        //   refresh: false,
        //   cache: false,
        //   where: false,
        //   full: true
        // }
      },
      modelSelected: null
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
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
