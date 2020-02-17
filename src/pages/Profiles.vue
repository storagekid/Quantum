<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :sticky="true"
      :virtualScroll="true"
      dense
      :editAferCreate="true"
      :getModelView="true"
      v-if="modelsReady"
      >
      <template slot="body-cell-emails" slot-scope="item" :item="item">
        <div v-for="(email, index) in item.item" :key="index">
          <span class="text-bold text-primary">
            {{ email.email }}
          </span>
          <q-chip dense square size="sm" color="tertiary-light" text-color="black">{{ email.type }}</q-chip>
        </div>
      </template>
    </model-table>
  </q-page>
</template>

<script>

import { ModelsFetcher } from '../mixins/modelMixin'

export default {
  name: 'ProfilesPage',
  mixins: [ModelsFetcher],
  data () {
    return {
      modelName: 'profiles',
      modelsNeeded: {
        profiles: {
          scoped: true,
          refresh: true,
          orderBy: 'name',
          with: ['phones', 'emails', 'country', 'company', 'stores', 'clinic_profiles', 'store_profiles', 'user']
        }
      }
    }
  }
}
</script>

<style>
</style>
