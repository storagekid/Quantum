<template>
  <q-card id="remove-model" class="bg-white">
    <q-card-section class="text-center bg-secondary text-primary">
      Cloning {{ $tc('models.' + name + '.name', 1) }}
    </q-card-section>
    <q-separator />
    <q-card-section class="text-center" v-if="relations.length">
      <p>Would you like to clone relations too?</p>
      <q-btn @click="selectAllRelations">All</q-btn>
      <q-option-group
        dense
        v-model="relationsSelected"
        :options="relations"
        color="primary"
        type="toggle"
      />
    </q-card-section>
    <q-card-section class="text-center">
      <p>{{ $tc('models.' + name + '.name', 1) }} will be cloned</p>
      <p class="text-negative q-title">Are you Sure?</p>
    </q-card-section>
    <q-card-actions align="stretch">
      <q-btn-group spread class="full-width">
        <q-btn color="info" label="Cancel" v-close-popup/>
        <q-btn color="primary" label="DO IT" @click="startCloning"/>
      </q-btn-group>
    </q-card-actions>
  </q-card>
</template>

<script>
import { ModelBuilder, ModelController } from '../../mixins/modelMixin'

export default {
  name: 'CloneModelConfirm',
  props: ['name', 'model', 'relatedTo', 'parentIndex'],
  mixins: [ModelBuilder, ModelController],
  data () {
    return {
      relationsSelected: []
    }
  },
  computed: {
    quasarData () {
      return this.$store.state.Model.models[this.name].quasarData
    },
    relations () {
      if (Object.keys(this.quasarData.relations).length) {
        let options = []
        for (let relation in this.quasarData.relations) options.push({ label: this.$tc('models.' + relation + '.name', 2), value: relation })
        return options
      }
      return []
    }
  },
  methods: {
    selectAllRelations () {
      this.relationsSelected = this.relations.map(i => i.value)
    },
    startCloning () {
      this.$emit('formSent')
      let payload = {
        name: this.name,
        model: this.buildModel(this.model),
        quasarInfo: {
          nameSpace: this.quasarData.nameSpace
        },
        options: {
          relations: this.relationsSelected
        }
      }
      this.cloneModel(payload)
        .then((response) => {
          this.$emit('formResponded', 'success')
          // console.log(response)
        }).catch((response) => {
          this.$emit('formResponded', 'failed')
          // console.log(response)
        })
    }
  }
}
</script>

<style>
</style>
