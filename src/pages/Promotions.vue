<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      :rows="20"
      v-if="modelsReady"
      >
      <template slot="body-cell-current_legal" slot-scope="item" :item="item">
          <span class="text-bold text-primary" v-if="item.item.length < 30">{{ item.item ? item.item : '*' }}</span>
          <div class="text-bold text-primary ellipsis" style="max-width: 200px" v-else>
            {{ item.item ? item.item : '*' }}
            <q-tooltip content-style="font-size: 16px">
              <div style="max-width: 600px">{{ item.item }}</div>
            </q-tooltip>
          </div>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'promotions',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'promotions',
      modelsNeeded: {
        promotions: {
          full: true,
          refresh: true,
          appends: ['current_legal'],
          withCount: ['legals']
        }
      }
    }
  }
}
</script>

<style>
</style>
