<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :dense="true"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-name" slot-scope="item" :item="item">
        <q-btn size="md" dense flat color="primary">{{ item.item }}</q-btn>
      </template>
      <template slot="body-cell-group_users" slot-scope="item" :item="item">
        <div v-for="(group, index) in item.item" :key="index">
          <span class="text-bold text-italic text-caption">{{ group.groupName }} -</span> {{ group.role }}
        </div>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'UsersPage',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'users',
      modelsNeeded: {
        users: {
          with: ['group_users']
        }
      }
    }
  }
}
</script>

<style>
</style>
