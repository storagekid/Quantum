<template>
  <q-card id="profile-selector" class="bg-white relative-position">
    <q-card-section class="text-center bg-secondary text-primary">
      Perfil
    </q-card-section>
    <q-separator />
    <q-card-section>
      <form>
        <q-select
          v-model="profileSelected"
          float-label="Selecciona un perfil"
          radio
          :options="profiles"
        />
        <q-btn color="primary" label="Aceptar" class="q-mt-md full-width" @click="getScope(profileSelected.id)" :disabled="profileSelected === null"/>
      </form>
    </q-card-section>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
export default {
  name: 'profileSelector',
  props: ['profiles'],
  data () {
    return {
      profileSelected: null,
      visible: false
    }
  },
  methods: {
    getScope (id) {
      this.visible = true
      this.$axios.get(this.$store.state.App.dataWarehouse + 'profiles', {
        params: {
          options: {
            ids: [id],
            with: ['clinics', 'stores'],
            appends: [
              'storeScope',
              'clinicScope'
            ]
          }
        }
      }).then((response) => {
        this.visible = false
        this.$emit('profile-selected', { id: id, profile: response.data.model[0] })
      }).catch((response) => {
        this.visible = false
      })
    }
  }
}
</script>

<style>
</style>
