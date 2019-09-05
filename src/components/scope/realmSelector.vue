<template>
  <q-btn-group style="display: flex" class="bg-white q-mt-md">
    <q-btn size="xl" style="flex: 1" icon="store_mall_directory" text-color="primary" align="around" @click="$emit('realmSelected', 'clinics')">Clinics</q-btn>
    <q-btn size="xl" style="flex: 1" icon="domain" text-color="primary" align="around" @click="$emit('realmSelected', 'stores')">Stores</q-btn>
  </q-btn-group>
</template>

<script>
export default {
  name: 'RealmSelector',
  data () {
    return {
      visible: false
    }
  }
}
</script>

<style>
</style>
