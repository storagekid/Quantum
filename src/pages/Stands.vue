<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :getModelView="true"
      :modelsNeeded="modelsNeeded"
      :editAferCreate="true"
      :dense="true"
      rows="10"
      v-if="modelsReady"
      >
      <template slot="body-cell-nickname" slot-scope="item" :item="item">
            <span class="text-bold text-primary">{{ item.item ? item.item : '-' }}</span>
      </template>
      <template slot="body-cell-open" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="item.item" color="positive"></q-icon>
        <q-icon name="check_circle" v-else color="negative"></q-icon>
      </template>
      <template slot="body-cell-active" slot-scope="item" :item="item">
        <q-icon name="check_circle" v-if="item.item" color="positive"></q-icon>
        <q-icon name="check_circle" v-else color="negative"></q-icon>
      </template>
      <template slot="body-cell-addresses" slot-scope="item" :item="item">
        <div v-for="(address, index) in item.item" :key="index">
            <span class="text-bold text-italic text-caption">{{ address.type }} -</span> {{ address.address_line_1 }} {{ address.address_line_2 !== 'NULL' ? address.address_line_2 : '' }}
        </div>
      </template>
      <template slot="body-cell-phones" slot-scope="item" :item="item">
        <div v-for="(phone, index) in item.item" :key="index">
            <span class="text-bold text-italic text-caption">{{ phone.type }} -</span> {{ phone.number }}
        </div>
      </template>
    </model-table>
    <clinic-view v-if="show" :id="show"></clinic-view>
    <q-page-sticky position="top-left" :offset="[5, 5]" v-if="show">
      <q-btn
        round
        dense
        size="xl"
        color="warning"
        text-color="primary"
        @click="show = false"
        icon="chevron_left"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>

import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'stands',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'stands',
      show: null,
      modelsNeeded: {
        stands: {
          full: true,
          refresh: true,
          withTrashed: true,
          orderBy: 'city',
          appends: ['open']
        }
      }
    }
  },
  methods: {
    toggleShow (payload) {
      this.show = payload
    }
  }
}
</script>

<style>
</style>
