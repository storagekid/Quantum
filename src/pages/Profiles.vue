<template>
  <q-page class="q-pa-md">
    <model-table
      :modelName="modelName"
      :modelsNeeded="modelsNeeded"
      :dense="true"
      :editAferCreate="true"
      :getModelView="true"
      v-if="Object.keys(modelsNeeded).length === modelsFetched"
      >
      <template slot="body-cell-emails" slot-scope="item" :item="item">
        <div v-for="(email, index) in item.item" :key="index">
          <q-btn dense small flat color="primary">
            {{ email.email }}
          </q-btn>
          <q-chip dense square color="tertiary-light" text-color="black">{{ email.type }}</q-chip>
        </div>
      </template>
      <template slot="body-cell-clinic_profiles" slot-scope="item" :item="item">
        <div v-for="(clinicProfile, index) in item.item" :key="index">
            <q-chip dense square color="tertiary-light" text-color="black">{{clinicProfile.clinic.nickname}}</q-chip>
        </div>
      </template>
      <template slot="body-cell-phones" slot-scope="item" :item="item">
        <div v-for="(phone, index) in item.item" :key="index">
            {{ phone.number }}
        </div>
      </template>
      <template slot="body-cell-user_id" slot-scope="item" :item="item">
        <q-icon size="22px" color="positive" name="check_circle" v-if="item.item"></q-icon>
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
