<template>
  <div class="row justify-center">
    <h3 class="q-display-2 text-center col-xs-12 text-tertiary q-my-none">Model Review</h3>
    <q-card class="col-xs-12 col-sm-4" v-for="(group, index) in quasarData.newLayout" :key="'Review'+index">
      <q-card-section class="text-primary uppercase">{{group.title}} {{group.subtitle ? group.subtitle : ''}}</q-card-section>
      <q-separator />
      <q-card-section>
        <span v-for="(row, index) in group.fields" :key="'FieldsRow'+index">
          <q-list v-if="group.fields.length" dense>
            <q-item v-for="(field, index) in row" :key="'FieldsFieldLabel'+index">
              <q-item-section avatar>
                {{field.label}}
              </q-item-section>
              <q-item-section side>
                <span v-if="field.type.name === 'select' && model[field.name]">
                  {{ model[field.name].label }}
                </span>
                <span v-else-if="field.type.name === 'array' && model[field.name]">
                  {{ model[field.name].label }}
                </span>
                <span v-else-if="field.type.name === 'password' && model[field.name]">
                  {{ hidePassword(model[field.name]) }}
                </span>
                <div v-else>
                  {{ model[field.name] ? model[field.name] : '-' }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </span>
        <template v-if="group.relations">
          <span v-for="(relation, index) in group.relations" :key="'Relation'+index">
            <q-list v-if="[].includes(quasarData.relations[relation].type) === 'BelongsToMany'" dense>
              <q-item>
                <q-item-section avatar class="self-start">
                  {{relation}}
                </q-item-section>
                <q-item-section side class="col-12">
                  <span v-for="(item, index) in model[relation]" :key="relation+'Item'+index">
                    {{ item.label }}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list v-if="quasarData.relations[relation].type === 'MorphMany'" dense>
              <q-item>
                <q-item-section avatar>
                  {{relation}}
                </q-item-section>
                <q-item-section side v-for="(item, index) in model[relation]" :key="relation+'Item'+index">
                  {{ item[quasarData.relations[relation].quasarData.keyField] }}
                </q-item-section>
              </q-item>
            </q-list>
            <q-list v-if="quasarData.relations[relation].type === 'HasMany'" dense>
              <q-item>
                <q-item-section avatar>
                  {{relation}}
                </q-item-section>
                <q-item-section side v-for="(item, index) in model[relation]" :key="relation+'Item'+index">
                  <q-list dense>
                    <q-item v-for="(relationfield, label) in item" :key="'RelationaFieldsFieldLabel'+label">
                      <q-item-section avatar>
                        {{label}}
                      </q-item-section>
                      <!-- <q-item-section>Active, Active class</q-item-section> -->
                      <q-item-section side>
                        <div>
                          {{ item[label] ? item[label] : '-' }}
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-item-section>
              </q-item>
            </q-list>
          </span>
        </template>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'ModelReview',
  props: ['model', 'quasarData'],
  data () {
    return {}
  },
  methods: {
    getRelationListOptions (name) {
      if (this.$store.state.Model.models[name]) return this.$store.state.Model.models[name].items.filter(item => this.model[name].includes(item.id))
      return this.$store.state.Scope[name].items.filter(item => this.model[name].includes(item.id))
    },
    getModelById (name, id) {
      if (this.$store.state.Model.models[name]) return this.$store.state.Model.models[name].items.filter(item => item.id === id)[0]
      return this.$store.state.Scope[this.$store.state.Scope.mode][name].items.filter(item => item.id === id)[0]
    },
    hidePassword (pass) {
      let newpass = ''
      for (let i = pass.length; i >= 0; i--) {
        newpass = newpass + '*'
      }
      return newpass
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
