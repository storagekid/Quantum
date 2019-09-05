<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :permissions="permissions"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'GroupsPage',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'groups',
      modelsNeeded: {
        groups: {
          withCount: ['users']
        }
      }
    }
  },
  computed: {
    permissions () {
      let role = this.$store.state.User.groupsInfo['Clinics']
      let object = {
        show: (role !== 'guest'),
        create: ['user', 'administrator', 'overseeker', 'root'].includes(role),
        edit: ['administrator', 'overseeker', 'root'].includes(role),
        delete: ['overseeker', 'root'].includes(role)
      }
      return object
    }
  }
}
</script>

<style>
</style>
