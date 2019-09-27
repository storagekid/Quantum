<template>
  <q-card style="overflow: visible">
    <q-card-section class="text-primary text-weight-bolder bg-secondary q-mt-lg">
      {{relationData.name}}
      <q-btn dense rounded class="q-ml-md" color="primary" icon="add"
        @click="openRelation = relationData.name"
        v-if="openRelation !== relationData.name && relationData.quasarData.listFields.mode !== 'table'"
      />
      <q-btn-group rounded class="q-ml-md" v-if="openRelation === relationData.name">
        <q-btn rounded color="primary" icon="check"
          @click="startSaveRelation"
          :disable="$v.relation.$anyError"
        />
        <q-btn rounded color="negative" icon="cancel" @click="closeRelationForm(relationData.name)"/>
      </q-btn-group>
    </q-card-section>
    <q-card-section
      :class="{
        'q-pa-none': relationData.quasarData.listFields.mode === 'table',
        'no-shadow': relationData.quasarData.listFields.mode === 'table'
      }"
      v-if="openRelation || (typeof model[relationData.name] !== 'undefined')"
      >
      <form class="q-mb-lg" v-if="openRelation">
        <template v-if="['HasMany', 'MorphMany', 'HasManyThrough'].includes(relationData.type)">
          <div class="row q-col-gutter-md q-mt-md" v-for="(row, index) in relationData.quasarData.newLayout[0].fields" :key="relationData.name+'RelForm'+index">
            <template
              v-for="(field, index) in row"
              >
              <div
                class="col-xs-12"
                :class="field.type.name === 'boolean' ? 'items-center' : 'items-start'"
                :key="relationData.name+'MultiUploader'+index"
                v-if="field.type.name === 'multiFile'"
                >
                <div class="q-pa-md">
                  <q-btn icon="cloud_upload" :label="!showMultiuploader ? 'Use Multiuploader' : 'Close Multiuploader'" color="primary" @click="showMultiuploader = !showMultiuploader"></q-btn>
                </div>
                <q-uploader
                  v-if="showMultiuploader"
                  float-label="Multi Upload"
                  multiple
                  class="full-width"
                  label="Add Files to upload"
                  :factory="uploadFiles"
                  @added="uploadMultiFilesAdded($event, relationData.name, field.name)"
                  :batch="true"
                  @uploading="sendMultiFiles"
                  @factory-failed="failedMethod"
                  @removed="removeFiles"
                />
              </div>
            </template>
            <template v-if="!showMultiuploader">
              <div
                v-for="(field, index) in row"
                :key="relationData.name+'RelField'+index"
                class="col-xs-12 col-sm-3"
                >
                <q-input
                  v-if="field.type.name === 'inputText'"
                  :class="field.type.name === 'boolean' ? 'items-center' : 'items-start'"
                  bottom-slots
                  :error="relationData.quasarData.fields.includes(field.name) ? $v.relation[field.name].$error : false"
                  :name="field.name"
                  :label="field.label"
                  stack-label
                  v-model="relation[field.name]"
                  @blur="$v.relation[field.name].$touch()"
                  />
                <q-uploader
                  v-if="field.type.name === 'file'"
                  :class="field.type.name === 'boolean' ? 'items-center' : 'items-start'"
                  bottom-slots
                  :error="relationData.quasarData.fields.includes(field.name) ? $v.relation[field.name].$error : false"
                  url=""
                  :upload-factory="uploadFile"
                  label="Add a File to upload"
                  :hide-upload-button="true"
                  :hide-upload-progress="true"
                  @added="uploadFilesAdded($event, relationData.name, field.name)"
                />
                <q-select
                  v-if="['array', 'arrayUnique'].includes(field.type.name)"
                  v-show="field.name !== relationData.quasarData.listFields.draggable"
                  :class="field.type.name === 'boolean' ? 'items-center' : 'items-start'"
                  bottom-slots
                  :error="relationData.quasarData.fields.includes(field.name) ? $v.relation[field.name].$error : false"
                  :name="field.name"
                  :label="field.type.default.text"
                  stack-label
                  v-model="relation[field.name]"
                  :options="field.type.name === 'arrayUnique' ? filterArrayUnique(relationData.name, field.name, field.type.array) : field.type.array"
                  @input="$v.relation[field.name].$touch()"
                />
                <custom-select
                  v-if="field.type.name === 'select'"
                  :field="field"
                  :model="model"
                  :relation="relationData.name"
                  :initValue="relation[field.name]"
                  :error="relationData.quasarData.fields.includes(field.name) ? $v.relation[field.name].$error : false"
                  @updated="updateCustomSelect(field.name, ...arguments, true)"
                  >
                </custom-select>
                <q-select
                  v-if="field.type.name === 'selectFromModel'"
                  :class="field.type.name === 'boolean' ? 'items-center' : 'items-start'"
                  bottom-slots
                  :error="relationData.quasarData.fields.includes(field.name) ? $v.relation[field.name].$error : false"
                  :name="field.name"
                  :label="field.type.default.text"
                  stack-label
                  :options="model[field.type.model]"
                  v-model="relation[field.name]"
                />
                <q-input
                  v-if="field.type.name === 'date'"
                  mask="####-##-##"
                  :rules="[]"
                  bottom-slots
                  :error="relationData.quasarData.fields.includes(field.name) ? $v.relation[field.name].$error : false"
                  :name="field.name"
                  :label="field.label"
                  stack-label
                  v-model="relation[field.name]"
                  >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" color="primary">
                      <q-popup-proxy :ref="'qDateProxy-' + index" transition-show="scale" transition-hide="scale">
                        <q-date color="primary" v-model="relation[field.name]" @input="hideDatePicker(index)" mask="YYYY-MM-DD"/>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-toggle
                  v-if="field.type.name === 'boolean'"
                  :class="field.type.name === 'boolean' ? 'items-center' : 'items-start'"
                  bottom-slots
                  :error="relationData.quasarData.fields.includes(field.name) ? $v.relation[field.name].$error : false"
                  v-model="relation[field.name]"
                  :label="field.type.default.text"
                  @input="$v.relation[field.name].$touch()"
                />
              </div>
            </template>
          </div>
        </template>
        <template v-if="['BelongsToMany'].includes(relationData.type)">
              <custom-select
                  :relation="relationData.name"
                  :relationType="relationData.type"
                  :initValue="null"
                  :error="$v.relation.$error"
                  @updated="updateCustomSelect(relationData.name, ...arguments, true)"
                  >
                </custom-select>
        </template>
      </form>
      <template v-if="model[relationData.name]">
        <q-list
          separator no-border dense
          v-if="relationData.quasarData.listFields.mode === 'list'"
          class="q-mt-md"
          >
          <q-item
            v-for="(item, index) in model[relationData.name]"
            :key="relationData.name+'Item'+index"
            >
            <q-item-section avatar>
              <div class="row">
                <q-btn-group flat class="q-gutter-sm">
                  <q-btn size="md" flat dense color="negative" icon="delete" @click="startRemoveRelation(relationData.name, index, item.id, item)"/>
                  <q-btn
                    v-if="!relationData.quasarData.listFields.draggable"
                    size="md"
                    dense
                    color="warning"
                    icon="edit"
                    @click="editRelation(relationData.name, index, item)"
                  />
                </q-btn-group>
                <q-btn-group flat class="q-ml-md" v-if="relationData.quasarData.listFields.draggable">
                  <q-btn
                    :disable="index < 2"
                    size="md"
                    flat
                    dense
                    :color="index < 2 ? 'accent' : 'primary'"
                    icon="unarchive"
                    @click="moveRelation(relationData.name, index, (index * -1))"
                  />
                  <q-btn
                    :disable="index === 0"
                    size="md"
                    flat
                    dense
                    :color="index === 0 ? 'accent' : 'primary'"
                    icon="arrow_drop_up"
                    @click="moveRelation(relationData.name, index, -1)"
                  />
                  <q-btn
                    :disable="index === model[relationData.name].length-1"
                    size="md"
                    flat
                    dense
                    :color="index === model[relationData.name].length-1 ? 'accent' : 'primary'"
                    icon="arrow_drop_down"
                    @click="moveRelation(relationData.name, index, 1)"
                  />
                  <q-btn
                    :disable="index >= model[relationData.name].length - 2"
                    size="md"
                    flat
                    dense
                    :color="index >= model[relationData.name].length - 2 ? 'accent' : 'primary'"
                    icon="archive"
                    @click="moveRelation(relationData.name, index, (model[relationData.name].length -1) - index)"
                  />
                </q-btn-group>
              </div>
            </q-item-section>
            <q-item-section avatar class="gt-sm" v-for="(left, index) in relationData.quasarData.listFields.left" :key="relationData.name+'List-L'+index">
              <q-chip small dense v-if="left.includes('chips')">{{item[index]}}</q-chip>
            </q-item-section>
            <q-item-section v-for="(main, index) in relationData.quasarData.listFields.main" :key="relationData.name+'List-M'+index">
              <q-item-label>
                <q-icon class="float-right" name="star" color="positive" v-if="main.includes('boolean') && item[index]"/>
                <span v-if="main.includes('text')">{{ item[index] }}</span>
                <span v-else-if="main.includes('object')">{{ renderObject(item, index) }}</span>
                <span v-else-if="main.includes('storeId')">{{ renderStore(item, index) }}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section class="gt-sm" v-for="(right, index) in relationData.quasarData.listFields.right" :key="relationData.name+'List-R'+index">{{ item[index] }}</q-item-section>
          </q-item>
          <q-card-actions>
            <q-btn-group class="row full-width q-col-gutter-x-md" v-if="relationData.quasarData.listFields.draggable && model[relationData.name].length > 1">
              <q-btn
                v-if="itemsOrderChanged.length"
                class="col-2"
                color="warning"
                @click="revertOrder"
                >
                Revert
              </q-btn>
              <q-btn
                class="col"
                :disable="!itemsOrderChanged.length"
                color="primary"
                @click="updateRelationOrder(relationData.name)"
                >
                Save Order
              </q-btn>
            </q-btn-group>
          </q-card-actions>
        </q-list>
        <div
          v-else-if="relationData.quasarData.listFields.mode === 'table-grid'"
          v-show="!openRelation"
          class="text-center"
          >
          <model-table
            :grid="true"
            v-on:editRelation="editRelation"
            dense
            :modelName="relationData.name"
            :relatedTo="{name: relatedTo, index: model.__index, id: model.id}"
            >
          </model-table>
        </div>
        <div
          v-else-if="relationData.quasarData.listFields.mode === 'table'"
          v-show="!openRelation"
          >
          <model-table
            wrapperClass="no-shadow"
            tableClass="no-shadow custom-table"
            dense
            :modelName="relationData.name"
            :relatedTo="{name: relatedTo, index: model.__index, id: model.id}"
            >
          </model-table>
        </div>
      </template>
    </q-card-section>
    <q-dialog v-model="removeModel">
      <remove-model-confirm
        :modelQty="selectedItems.length"
        :name="relationData.name"
        :models="selectedItems"
        :relatedTo="relatedTo"
        :parentIndex="model.__index"
        v-on:confirmed="hideRemoveRelation"
        v-on:finished="finishRemoveRelation"
        >
      </remove-model-confirm>
    </q-dialog>
    <q-inner-loading :showing="relationLoader">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
    <multi-async-action-bars
      v-if="multiAsyncAction.show"
      :opened="multiAsyncAction.show"
      :items="multiAsyncAction.items"
      :relation="relationData.name"
      :relatedTo="relatedTo"
      :parentIndex="model.__index"
      :headerText="'Creando nuevo ' + relationData.name"
      keyField="nickname"
      v-on:Finished="clearMultiUpload"
      >
    </multi-async-action-bars>
  </q-card>
</template>

<script>
import { ModelRelations, RelationController, SortingRelation } from '../../mixins/modelMixin'
import { searchMethods } from '../../mixins/tableMixin'
import { FileDownloadMethods } from '../../mixins/fileMixin'
import RemoveModelConfirm from '../model/removeModelConfirm'
import { customSelectMixins } from '../../mixins/customSelectMixins'
import CustomSelect from '../form/customSelect'
import { multiAsyncActionBarsMixins } from '../../mixins/multiAsyncActionBarsMixins'
import MultiAsyncActionBars from '../loaders/multiAsyncActionBars'

export default {
  name: 'RelationCard',
  props: ['relationData', 'relatedTo', 'model', 'modelData', 'mode', 'batchMode', 'batchSource'],
  mixins: [ModelRelations, RelationController, SortingRelation, searchMethods, FileDownloadMethods, multiAsyncActionBarsMixins, customSelectMixins],
  components: { RemoveModelConfirm, CustomSelect, MultiAsyncActionBars },
  data () {
    return {
      showMultiuploader: false,
      openRelation: false,
      multiUpload: {
        items: []
      },
      editing: false,
      removeModel: false,
      relationName: null,
      relation: {},
      relationLoader: false,
      gridItemLoading: false,
      selectedItems: []
    }
  },
  methods: {
    startRemoveRelation (relation, index, id, item) {
      this.selectedItems.push(item)
      this.removeModel = true
    },
    startSaveRelation () {
      this.relationLoader = true
      let payload = this.buildRelationPayload({
        relatedTo: this.relationData.nameSpace,
        relatedToID: this.relation.id,
        relation: this.relationData.name,
        model: this.relation,
        index: this.editing,
        parentName: this.relatedTo,
        parentNameSpace: this.modelData.nameSpace,
        parentIndex: this.model.__index,
        parentId: this.model.id,
        id: this.relation['id'],
        quasarData: this.relationData
      })
      if (this.batchMode) {
        this.batchRelation(payload, this.batchSource, this.mode).then(() => {
          this.relationLoader = false
          this.closeRelationForm()
        })
      } else {
        this.mode === 'update'
          ? this.updateRelation(payload).then(() => {
            this.relationLoader = false
            this.closeRelationForm()
          }).catch(() => { this.relationLoader = false })
          : this.saveRelation(payload).then(() => {
            this.relationLoader = false
            this.closeRelationForm()
          }).catch(() => { this.relationLoader = false })
      }
    },
    // hideDatePicker (index) {
    //   let picker = 'qDateProxy-' + index
    //   // console.log(picker)
    //   this.$refs[picker][0].hide()
    // },
    renderStore (object, path) {
      // console.log('Render Store')
      // console.log(object)
      // console.log(path)
      if (path.indexOf('.') > -1) {
        let names = path.split('.')
        let item = object[names[0]]
        for (let i = 1; i < names.length; i++) {
          if (!item) return path
          item = item[names[i]]
        }
        if (typeof item !== 'string') {
          return 'item.label'
        }
        return item
      }
      return path
    },
    renderObject (object, path) {
      // console.log(object)
      // console.log(path)
      if (path.indexOf('.') > -1) {
        let names = path.split('.')
        let item = object[names[0]]
        for (let i = 1; i < names.length; i++) {
          if (!item) return '-'
          item = item[names[i]]
        }
        if (typeof item !== 'string') {
          return 'item.label'
        }
        return item
      }
      return path
    },
    // FILES METHODS
    uploadMultiFilesAdded (files, relation, field) {
      let models = {}
      this.$store.state.Model.models.poster_models.items.map(model => {
        models[model.name] = model.id
      })
      let posters = {}
      this.$store.state.Model.models.posters.items.map(model => {
        posters[model.name.toLowerCase()] = model.id
      })
      // console.log(posters)
      let langs = {}
      this.$store.state.Model.models.languages.items.map(model => {
        langs[model['639-1']] = model.id
      })
      let states = {}
      this.$store.state.Model.models.states.items.map(model => {
        states[model.name] = model.id
      })
      for (let file of files) {
        let object = {}
        for (let index in this.relation) {
          object[index] = null
        }
        // Defaults
        object.file = file
        object.type = 'Ext'
        object.language_id = langs['es']
        object.country_id = 1
        // End Defaults
        let cleanName = file.name.substring(0, file.name.indexOf('.pdf'))
        let words = cleanName.split(' ')
        let units = ['cm', 'mm', 'm']
        let multistate = []
        // let langs = ['eu', 'ca', 'en', 'fr', 'it', 'es']
        for (let word of words) {
          if (word.includes('x')) {
            if (word.indexOf('(') > 0) {
              word = word.substring(0, word.indexOf('('))
              object.poster_id = posters[word]
              continue
            } else if (word.indexOf('(') === 0) {
              object.type = 'Office'
              continue
            } else if (word.indexOf('(') === -1) {
              for (let unit of units) {
                if (word.indexOf(unit) !== -1) {
                  word = word.substring(0, word.indexOf(unit))
                  // console.log(word)
                  object.poster_id = posters[word.toLowerCase()]
                  continue
                }
              }
              object.poster_id = posters[word]
              continue
            }
          } else if (word === 'Interior') {
            object.type = 'Office Int'
            continue
          } else if (word === 'Generic') {
            object.poster_model_id = models['Recalls']
            continue
          } else if (models[word]) {
            object.poster_model_id = models[word]
            continue
          } else if (word === 'CAT') {
            object.language_id = langs['ca']
            continue
          } else if (word === 'AS') {
            object.state_id = states['Asturias, Principado de']
            continue
          } else if (word === 'AR') {
            object.state_id = states['Aragón']
            continue
          } else if (word === 'MU') {
            object.state_id = states['Murcia, Región de']
            continue
          } else if (word === 'NA') {
            object.state_id = states['Navarra, Comunidad Foral de']
            continue
          } else if (word === 'PV') {
            object.state_id = states['País Vasco']
            continue
          } else if (word.indexOf('-')) {
            multistate = word.split('-')
            continue
          }
        }
        if (multistate.length) {
          for (let state of multistate) {
            let newObject = {}
            for (let i in object) {
              newObject[i] = object[i]
            }
            if (state === 'AS') newObject.state_id = states['Asturias, Principado de']
            else if (state === 'AR') newObject.state_id = states['Aragón']
            else if (state === 'MU') newObject.state_id = states['Murcia, Región de']
            else if (state === 'NA') newObject.state_id = states['Navarra, Comunidad Foral de']
            else if (state === 'PV') newObject.state_id = states['País Vasco']
            let temp = { model: {} }
            temp.model = newObject
            temp.model.nickname =
              this.$store.state.Model.models.poster_models.items.filter(i => { return i.id === temp.model.poster_model_id })[0].name + ' ' +
              this.$store.state.Model.models.posters.items.filter(i => { return i.id === temp.model.poster_id })[0].name + ' ' +
              temp.model.type
            this.multiAsyncAction.items.push(temp)
          }
        } else {
          let temp = { model: {} }
          temp.model = object
          this.multiAsyncAction.items.push(temp)
        }
      }
    },
    removeFiles (files) {
      for (let i = this.multiUpload.items.length - 1; i >= 0; i--) {
        if (this.multiUpload.items[i].file.name === files[0].name) this.multiUpload.items.splice(i, 1)
      }
    },
    failedMethod () {
      console.log('failedMethod')
      this.sendMultiFiles()
      this.closeRelationForm()
    },
    uploadFiles (files) {
      return new Promise((resolve, reject) => {
        reject(files)
      })
    },
    sendMultiFiles () {
      console.log('Send Multi Files')
      this.multiAsyncAction.items.map(i => {
        let actionPayload = {}
        actionPayload.url = this.$store.state.App.dataWarehouse + this.relatedTo + '/' + this.model.id + '/' + this.relationData.name
        actionPayload.method = 'POST'
        actionPayload.params = {}
        i.actionPayload = actionPayload
        i.model[this.relationData.getForeignKeyName] = this.model.id
      })
      this.multiAsyncAction.show = true
      // this.multiUploadFiles({
      //   relation: this.openRelation,
      //   items: this.multiUpload.items,
      //   parentIndex: this.model.__index
      // })
      // this.closeRelationForm()
    },
    uploadFilesAdded (files, relation, field) {
      this.relation[field] = files[0]
      this.$v.relation[field].$touch()
    },
    uploadFile (file, updateProgress) {
      return new Promise((resolve, reject) => {
        resolve(file)
      })
    },
    // END FILE METHODS
    showRemoveRelation (relation) {
      this.removeModel = true
      this.relationName = relation
    },
    hideRemoveRelation () {
      this.removeModel = false
    },
    finishRemoveRelation () {
      this.selectedItems = []
      this.removeModel = false
      this.relationName = null
    },
    closeRelationForm () {
      this.openRelation = false
      this.editing = false
      this.multiUpload.items = []
      this.relationName = null
      this.buildRelationData(this.relationData)
    },
    editRelation (relation, sourceIndex, item) {
      if (typeof relation === 'object') {
        sourceIndex = relation.index
        item = relation.row
        relation = relation.name
      }
      // console.log(relation)
      // console.log(sourceIndex)
      // console.log(item)
      this.editing = sourceIndex
      // console.log(item)
      // this.editingId = item.id
      this.buildRelationData(this.relationData, item)
      this.openRelation = relation
    },
    validateFromLaravel (rules) {
      let validations = {}
      for (let rule of rules) {
        if (typeof rule !== 'string') continue
        if (rule === 'required') {
          const { required } = require('vuelidate/lib/validators')
          validations = { ...validations, required }
        } else if (rule.includes('min:')) {
          const { minLength } = require('vuelidate/lib/validators')
          let minValue = parseInt(rule.substring((rule.indexOf(':') + 1)))
          validations = { ...validations, minLength: minLength(minValue) }
        } else if (rule.includes('max:')) {
          const { maxLength } = require('vuelidate/lib/validators')
          let maxValue = parseInt(rule.substring((rule.indexOf(':') + 1)))
          validations = { ...validations, maxLength: maxLength(maxValue) }
        } else if (rule.includes('same:')) {
          const { sameAs } = require('vuelidate/lib/validators')
          let sameField = rule.substring((rule.indexOf(':') + 1))
          validations = { ...validations, sameAs: sameAs(sameField) }
        }
      }
      return validations
    }
  },
  validations () {
    let relation = {}
    let sameContructor = ['MorphMany', 'HasManyThrough', 'HasMany']
    let avoid = false
    if (this.relationData.type === 'HasMany') {
      avoid = this.relationData['getForeignKeyName']
    }
    if (sameContructor.includes(this.relationData.type)) {
      for (let field in this.relationData.quasarData.rules) {
        if (field !== avoid) relation[field] = this.validateFromLaravel(this.relationData.quasarData.rules[field])
      }
    }
    if (this.relationData.type === 'BelongsToMany') {
      relation = this.validateFromLaravel(['required'])
    }
    if (this.relationData.type === 'BelongsTo') {
      relation = this.validateFromLaravel(['required'])
    }
    return { relation }
  },
  created () {
    this.buildRelationData(this.relationData)
  },
  mounted () {
    this.$v.$touch()
  }
}
</script>

<style lang="stylus">
// @import '~quasar.variables'
  .shadow {
    opacity: .5;
    border: 1px dashed grey;
  }
  .dropzone {
    padding: 10px 0;
    background-color: rgba(0,0,0,.05);
  }
</style>
