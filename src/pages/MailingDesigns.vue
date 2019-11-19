<template>
  <q-page class="q-pa-md">
    <model-table
      :sticky="true"
      :virtualScroll="true"
      :modelName="modelName"
      :dense="true"
      :getModelView="true"
      v-if="modelsReady"
      >
      <template slot="body-cell-promotions" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <div v-for="(promotion, index) in item.item" :key="index">
              <span class="text-bold text-italic text-caption">{{ promotion.name }}</span>
          </div>
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </template>
      <template slot="body-cell-claims" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <div v-for="(claims, index) in item.item" :key="index">
              <span class="text-bold text-italic text-caption">{{ claims.name }}</span>
          </div>
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </template>
      <template slot="body-cell-clinics" slot-scope="item" :item="item">
        <template v-if="item.item.length">
          <div v-for="(clinic, index) in item.item" :key="index">
              <span class="text-bold text-italic text-caption">{{ clinic.label }}</span>
          </div>
        </template>
        <template v-else>
          <div>-</div>
        </template>
      </template>
      <template slot="body-cell-base_af.thumbnail" slot-scope="item" :item="item">
          <div v-if="item.item">
            <q-img style="max-height: 100px" contain :src="$store.state.App.publicSources + '/' + item.item">
            </q-img>
            <q-tooltip self="center left" anchor="center left" content-style="min-width: 300px; max-height: 300px display: flex">
              <q-img :src="$store.state.App.publicSources + '/' + item.item">
              </q-img>
            </q-tooltip>
          </div>
          <div v-else>
            {{ '*' }}
          </div>
      </template>
    </model-table>
  </q-page>
</template>

<script>
import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'mailing_designs',
  mixins: [ ModelsFetcher ],
  data () {
    return {
      modelName: 'mailing_designs',
      modelsNeeded: {
        'mailing_designs': {
          full: true
        }
      }
    }
  }
}
</script>

<style>
</style>
