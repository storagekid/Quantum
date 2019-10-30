<template>
  <div padding v-if="model" :class="{'bg-white': true, 'sticky-table': sticky ? true : false}">
    <template v-if="!updateModel">
      <q-table
        :virtual-scroll="virtualScroll"
        :class="wrapperClass ? wrapperClass : sticky === true ? 'custom-table-wrapper my-sticky-header-column-table' : 'custom-table-wrapper'"
        v-if="model"
        :table-class="tableClass ? tableClass : 'custom-table'"
        :table-header-class="tableHeaderClass"
        :dense="!($q.screen.lt.md || dense) ? true : dense"
        :loading="loading"
        :grid="grid"
        :grid-header="gridHeader"
        :hide-header="false"
        :ref="'table-' + modelName"
        :data="model"
        :filter="filter"
        :filter-method="filterMethod"
        :sort-method="customSort"
        :visible-columns="visibleColumns"
        :separator="separator"
        :columns="columns"
        :pagination.sync="pagination"
        :no-data-label="'No se encontraron Items'"
        selection="multiple"
        :selected.sync="selectedItems"
        row-key="id"
        @request="onRequest"
        >
        <template v-slot:top="props" class="dense">
          <template v-if="typeof hideHeaderButtons === 'undefined' && (can.create || can.edit || can.delete)">
            <q-btn size="sm" color="primary" class="q-mr-md" icon="add_circle" @click="newModel = !newModel" v-if="can.create && (!grid)"/>
            <q-btn-group flat rounded class="q-mr-md" v-if="$store.state.User.role !== 'user'">
              <q-btn dense flat size="sm" rounded color="primary" icon="visibility" @click="showView" :disabled="!selectedItems.length || selectedItems.length > 1" v-if="can.edit"/>
              <q-btn dense flat size="sm" rounded color="primary" icon="edit" @click="showUpdate" :disabled="!selectedItems.length || selectedItems.length > 1" v-if="can.edit"/>
              <q-btn dense flat size="sm" rounded color="primary" icon="file_copy" @click="cloneModel = true" :disabled="!selectedItems.length || selectedItems.length  > 1 || true" v-if="can.create"/>
              <q-btn dense flat size="sm" rounded color="primary" icon="find_replace" :label="!$q.screen.lt.md ? 'Multi Edit' : ''" @click="showUpdateBatch" :disabled="selectedItems.length < 2 || !batchForm" v-if="can.edit"/>
              <q-btn dense flat size="sm" rounded color="primary" icon="delete" @click="removeModel = true" :disabled="!shouldRemove" v-if="can.delete"/>
              <q-btn dense flat size="sm" rounded color="primary" icon="restore_from_trash" @click="restoreModel = true" :disabled="!shouldRestore" v-if="showRestore"/>
              <q-btn dense flat size="sm" rounded color="primary" icon="delete_forever" @click="removeModel = true" :disabled="!shouldRemoveForever" v-if="can.delete"/>
            </q-btn-group>
            <q-space />
          </template>
          <q-btn-group rounded class="q-mr-md">
            <q-btn size="sm" rounded color="green" icon="grid_on" :label="!$q.screen.lt.md ? 'Excel' : ''" :loading="downloadingExcel" @click="confirm.state = true" v-if="can.show"/>
          </q-btn-group>
          <q-btn-group rounded class="q-mr-md">
            <!-- Old Old Select All Before Quasar v.1.1.6 -->
              <!-- <q-btn size="sm" rounded color="blue" icon="clear_all" :label="!$q.screen.lt.md ? 'Seleccionar Todo' : ''" @click="selectedItems = model" :disabled="selectedItems.length === model.length" v-if="relatedTo && grid"/> -->
            <!-- END Old Select All -->
            <q-btn size="sm" rounded color="blue" icon="clear_all" :label="!$q.screen.lt.md ? 'Borrar Selección' : ''" @click="selectedItems = []" :disabled="!selectedItems.length"/>
            <q-btn size="sm" rounded color="blue" icon="format_clear" :label="!$q.screen.lt.md ? 'Quitar Filtros' : ''" @click="clearFilters" :disabled="!filter"/>
          </q-btn-group>
          <q-space />
          <q-btn dense flat color="warning" icon="help" @click="showSearchHelp = true"></q-btn>
          <q-input dense debounce="800" v-model="filters['searchBar'].text" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="visibleColumns"
            multiple
            dense
            options-dense
            display-value="Columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          />
          <q-select
            dense
            options-dense
            color="secondary"
            v-model="separator"
            emit-value
            :options="[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' },
              { label: 'Cell', value: 'cell' },
              { label: 'None', value: 'none' }
            ]"
          />
          <q-btn
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          />
          <!-- Old Table Headers Before Quasar v.1.1.6 -->
            <!-- <div v-if="$refs['table-' + modelName] && grid" class="custom-table full-width">
              <div class="q-table q-mb-sm q-mt-xs">
                <q-tr class="row justify-between full-width">
                  <template v-for="column in $refs['table-' + modelName].computedCols">
                    <template v-if="column.onGrid !== 'hide'">
                      <th :class="[column.__thClass, filter.indexOf(column.label) > -1 ? 'filtered' : '']" :key="column.name" auto-width v-if="visibleColumns.includes(column.name)">
                        <div>
                          {{ column.label }}
                          <q-icon :class="[column.__iconClass]" @click="sortColumn(column)" :name="column.__iconClass.indexOf('desc') ? 'arrow_upward' : 'arrow_downward'"></q-icon>
                          <q-icon :class="[column.__filterClass]" name="filter_list">
                            <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                              <div class="q-pa-md custom-table filter">
                                <q-option-group
                                  class="text-h6"
                                  v-model="filters[column.name].options"
                                  :options="[
                                    {label: 'Buscar', value: 'has'},
                                    {label: 'Exacto', value: 'is'},
                                    {label: 'Excluir', value: 'not'},
                                    {label: 'Incluir', value: 'in'},
                                    {label: 'Sí', value: 'some'},
                                    {label: 'No', value: 'empty'}
                                  ]"
                                  color="primary"
                                  inline
                                  dense
                                />
                                <q-input
                                  v-model="filters[column.name].text"
                                  debounce="800"
                                  v-if="!['empty', 'some'].includes(filters[column.name].options)"
                                  :disable="['empty', 'some'].includes(filters[column.name].options)"
                                  dense
                                  >
                                </q-input>
                              </div>
                            </q-popup-proxy>
                          </q-icon>
                        </div>
                      </th>
                    </template>
                  </template>
                </q-tr>
              </div>
            </div> -->
          <!-- END Old Table Headers -->
        </template>
        <q-tr slot="header" slot-scope="props" :props="props" v-if="ready">
          <q-th class="text-left" auto-width dense>
            <q-checkbox
              class="items-start"
              :dense="dense"
              :value="!selectedItems.length ? null : selectedItems.length > 0"
              @input="toggleSelection"
              >
            </q-checkbox>
          </q-th>
          <template v-for="column in columns">
            <th :class="[props.colsMap[column.name].__thClass, filter.indexOf(column.label) > -1 ? 'filtered' : '']" :key="column.name" auto-width v-if="visibleColumns.includes(column.name)">
              <slot :name="'head-cell-' + column.name" v-bind:item="props">
                {{ column.label }}
                <q-icon :class="props.colsMap[column.name].__iconClass" @click="sortColumn(column)" :name="props.colsMap[column.name].__iconClass.indexOf('desc') ? 'arrow_upward' : 'arrow_downward'"></q-icon>
                <q-icon :class="props.colsMap[column.name].__filterClass" name="filter_list">
                  <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                    <div class="q-pa-md custom-table filter">
                      <q-option-group
                        class="text-h6"
                        v-model="filters[column.name].options"
                        :options="[
                          {label: 'Buscar', value: 'has'},
                          {label: 'Exacto', value: 'is'},
                          {label: 'Excluir', value: 'not'},
                          {label: 'Incluir', value: 'in'},
                          {label: 'Sí', value: 'some'},
                          {label: 'No', value: 'empty'},
                          {label: 'Únicos', value: 'uniques'},
                          {label: 'Duplicados', value: 'clones'}
                        ]"
                        color="primary"
                        inline
                        dense
                      />
                      <q-input
                        v-model="filters[column.name].text"
                        debounce="800"
                        v-if="!['empty', 'some', 'clones', 'uniques'].includes(filters[column.name].options)"
                        :disable="['empty', 'some', 'clones', 'uniques'].includes(filters[column.name].options)"
                        dense
                        >
                      </q-input>
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </slot>
            </th>
          </template>
        </q-tr>
        <template v-slot:body="props">
          <!-- <template v-for="prop in props" slot-scope="props" :props="props" > -->
            <q-tr :class="{selected: props.selected ? true : false, deleted: props.row.deleted_at ? true : false}">
              <td class="row-checkbox">
                <q-checkbox dense v-model="props.selected"/>
              </td>
              <template v-for="(column, index) in props.cols">
                <q-td :key="column.name" v-if="index === 0" :class="[column.__tdClasses, 'first']" auto-width>
                  <slot :name="'body-cell-' + column.name" v-bind:item="getItem(props.row, column.name)" v-if="column.name.indexOf('.') > -1">
                    {{ column.name.indexOf('.') > -1 ? getItem(props.row, column.name) : props.value }}
                  </slot>
                  <slot :name="'body-cell-' + column.name" v-bind:item="props.row[column.field]" v-else>
                    <span class="text-bold text-primary" v-if="getItem(props.row, column.name).length < ($q.screen.lt.md ? 20 : 40)">{{ getItem(props.row, column.name) }}</span>
                    <div class="text-bold text-primary ellipsis" style="max-width: 100px" v-else>
                      {{ getItem(props.row, column.name) ? getItem(props.row, column.name) : '*' }}
                      <q-tooltip content-style="font-size: 16px">
                        <div style="max-width: 600px">{{ getItem(props.row, column.name) }}</div>
                      </q-tooltip>
                    </div>
                  </slot>
                </q-td>
                <q-td :key="column.name" v-else-if="column.name !== 'actions'" auto-width>
                  <slot :name="'body-cell-' + column.name" v-bind:item="getItem(props.row, column.name)" v-if="column.name.indexOf('.') > -1">
                    {{ column.name.indexOf('.') > -1 ? getItem(props.row, column.name) : props.value }}
                  </slot>
                  <slot :name="'body-cell-' + column.name" v-bind:item="props.row[column.field]" v-else>
                    {{ getItem(props.row, column.name) }}
                  </slot>
                </q-td>
                <q-td :key="column.name" v-else auto-width>
                  <slot :name="'body-cell-' + column.name" v-bind:item="props.row"></slot>
                </q-td>
              </template>
              <!-- <template v-for="column in columns" :slot="'body-cell-' + column.name" slot-scope="props" :props="props" >
                <q-td :key="column.name" v-if="column.name !== 'actions'" auto-width>
                  <slot :name="'body-cell-' + column.name" v-bind:item="getItem(props.row, column.name)" v-if="column.name.indexOf('.') > -1">
                    {{ column.name.indexOf('.') > -1 ? getItem(props.row, column.name) : props.value }}
                  </slot>
                  <slot :name="'body-cell-' + column.name" v-bind:item="props.row[column.field]" v-else>
                    {{ props.value }}
                  </slot>
                </q-td>
                <q-td :key="column.name" v-else auto-width>
                  <slot :name="'body-cell-' + column.name" v-bind:item="props.row"></slot>
                </q-td>
              </template> -->
            </q-tr>
          <!-- </template> -->
        </template>
        <template v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
            :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
            <q-card :class="props.selected ? 'bg-grey-2' : ''">
              <q-card-section>
                <q-checkbox dense v-model="props.selected" :label="props.row.name" />
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm">
                <q-list dense @mouseover.stop="showActions = props.row.id">
                  <q-item
                    v-for="col in props.cols"
                    :key="col.name"
                    class="justify-between"
                    style='padding: 0; min-height: 10px; line-height: 1.2'
                    >
                      <template v-if="col.onGrid !== 'hide'">
                        <template v-if="col.onGrid === 'footer'">
                          <div class="full-width row">
                            <q-img
                              v-if="col.value"
                              spinner-color="primary"
                              spinner-size="82px"
                              contain
                              :src="$store.state.App.publicSources + '/' + getItem(props.row, col.name)"
                              basic
                              style="max-height:150px; min-height: 100px; min-width: 50px"
                              class="q-mt-sm bg-color-primary">
                              <template v-if="!col.value">
                                <div class="absolute-full flex flex-center bg-primary text-white">
                                  <q-spinner-gears color="white" size="36px"/>
                                  <!-- Image not found -->
                                </div>
                              </template>
                            </q-img>
                            <div class="full-width text-subtitle1 text-center q-pa-xs" v-if="showActions === props.row.id" >
                              <q-card-actions class="justify-between q-pa-none">
                                <q-btn
                                  dense
                                  size="md"
                                  color="warning"
                                  @click="$emit('editRelation', {name: modelName, index: props.row.__index, row: props.row})"
                                  icon="edit"
                                  >
                                </q-btn>
                                <q-btn dense size="md" color="positive"  @click="downloadFile(getObject(props.row, col.name).id)" icon="cloud_download"></q-btn>
                                <q-btn dense size="md" color="negative"  @click="removeRelation({'relation': relationData.name, 'index': props.row.__index, 'id': props.row.id}, 'update')" icon="remove"></q-btn>
                              </q-card-actions>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <q-item-section avatar>
                              {{ col.label }}
                          </q-item-section>
                          <q-item-section side class="q-pr-none">
                            {{ getItem(props.row, col.name) || '-' }}
                          </q-item-section>
                        </template>
                      </template>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
        </div>
      </template>
        <template v-slot:bottom-row v-if="!ready">
          <q-tr>
            <q-td colspan="100%">
              <generic-data-loading></generic-data-loading>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </template>
    <template v-if="updateModel || updateModelBatch">
      <update-model
        :modelName="modelName"
        :batchMode="batchMode"
        :model="batchMode ? selectedItems : selectedItems[0]"
        :relation="relatedTo"
        :quasarData="quasarData"
        v-on:modelUpdated="endUpdating"
        v-if="updateModel">
      </update-model>
      <q-page-sticky position="top-left" :offset="[5, 5]">
        <q-btn
          round
          dense
          size="xl"
          color="warning"
          text-color="primary"
          @click="endUpdating"
          icon="chevron_left"
        />
      </q-page-sticky>
    </template>
    <q-dialog v-model="newModel">
      <new-model
        :modelName="modelName"
        :quasarData="quasarData"
        :relation="relatedTo"
        v-on:profileCreated="endCreating"
        v-if="newModel">
      </new-model>
    </q-dialog>
    <q-dialog v-model="cloneModel">
      <clone-model-confirm :name="modelName" :model="selectedItems[0]" v-on:confirmed="cloneConfirmed"></clone-model-confirm>
    </q-dialog>
    <q-dialog v-model="removeModel">
      <remove-model-confirm
        :modelQty="selectedItems.length"
        :name="modelName"
        :models="selectedItems"
        :relatedTo="relatedTo ? relatedTo.name : null"
        :parentIndex="relatedTo ? relatedTo.index : null"
        v-on:confirmed="removeConfirmed">
      </remove-model-confirm>
    </q-dialog>
    <q-dialog v-model="restoreModel">
      <restore-model-confirm :modelQty="selectedItems.length" :name="modelName" :models="selectedItems" :quasarData="quasarData" v-on:confirmed="restoreConfirmed"></restore-model-confirm>
    </q-dialog>
    <q-dialog v-model="confirm.state" persistent>
      <q-card v-if="confirm.state">
        <q-card-section class="row items-center">
          <q-avatar icon="info" color="blue" text-color="white" />
          <span class="q-ml-sm">Selecciona una plantilla</span>
        </q-card-section>
        <q-card-section class="row items-center">
          <custom-select
            :dense="true"
            :hide-bottom-space="true"
            :field="{name: 'campaigns', type: { default: { text: 'Selecciona una plantilla'} }}"
            :sourceOptions="options.exports.excel"
            :clearable='true'
            :initValue="options.exports.excel[0]"
            @updated="updateCustomSelect('confirm.blueprint', $event)"
            >
          </custom-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="positive" v-close-popup @click="exports"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showSearchHelp">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Búsqueda Avanzada</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding class="info-dialog">
            <div class="row q-gutter-sm">
              <p class="col-12 q-pa-xs">
                Puedes encadenar palabras añadiendo <strong>&&</strong> entre ellas, por ejemplo:
                <q-banner class="text-primary bg-secondary q-mt-xs">
                  <div class="text-h6">Madrid&&28100&&CS5955</div>
                  <span class="text-italic">Muestra todas las filas que contengan Madrid, 28100 y CS5955 en cualquiera de sus columnas.</span>
                </q-banner>
              </p>
              <p class="col-12 q-pa-xs">
                Para buscar el contenido exacto de una columna escribe <strong>&&"</strong> seguido de la palabra a buscar, por ejemplo:
                <q-banner class="text-primary bg-secondary q-mt-xs">
                  <div class="text-h6">&&"Valencia</div>
                  <span class="text-italic">Muestra todas las filas cuyo valor exacto de cualquiera de sus columnas sea Valencia.</span>
                </q-banner>
              </p>
              <p class="col-12 q-pa-xs">
                Para limitar la búsqueda a una columna en concreto usa <strong>&&</strong>[Columna]<strong>==</strong>[Palabra], por ejemplo:
                <q-banner class="text-primary bg-secondary q-mt-xs">
                  <div class="text-h6">&&Ciudad==Madrid</div>
                  <span class="text-italic">Muestra todas las filas que contengan Madrid en la columna ciudad</span>
                </q-banner>
                Útil para mostrar solo los registros vacios de una determinada columna de la tabla, por ejemplo para mostrar solo las clínicas abiertas:
                <q-banner class="text-primary bg-secondary q-mt-xs">
                  <div class="text-h6">&&Fecha de Baja==</div>
                  <span class="text-italic">Muestra todas las filas cuya columna "Fecha de Baja" esté vacia</span>
                </q-banner>
              </p>
              <p class="col-12 q-pa-xs">
                Puedes invertir la búsqueda por columna, es decir, mostrar los valores DISTINTOS a la palabra buscada, <strong>&&</strong>[Columna]<strong>!=</strong>[Palabra], por ejemplo:
                <q-banner class="text-primary bg-secondary q-mt-xs">
                  <div class="text-h6">&&Ciudad!=Castellón</div>
                  <span class="text-italic">Muestra todas las filas que NO contengan Castellón en la columna ciudad</span>
                </q-banner>
                Útil para eliminar los registros vacios de una determinada columna de la tabla, por ejemplo para mostrar solo las clínicas cerradas:
                <q-banner class="text-primary bg-secondary q-mt-xs">
                  <div class="text-h6">&&Fecha de Baja!=</div>
                  <span class="text-italic">Muestra todas las filas cuya columna "Fecha de Baja" NO esté vacia</span>
                </q-banner>
              </p>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
import NewModel from './newModel'
import UpdateModel from './updateModel'
import RemoveModelConfirm from './removeModelConfirm'
import RestoreModelConfirm from './restoreModelConfirm'
import CloneModelConfirm from './cloneModelConfirm'
import { customSelectMixins } from '../../mixins/customSelectMixins'
import CustomSelect from '../form/customSelect'
import { FileMethods } from '../../mixins/fileMixin'
import { ModelsFetcher } from '../../mixins/modelMixin'
import { searchMethods } from '../../mixins/tableMixin'

export default {
  name: 'ModelTable',
  props: ['modelName', 'relatedTo', 'tableModels', 'getModelView', 'permissions', 'dense', 'grid', 'gridHeader', 'rows', 'showFilters', 'editAferCreate', 'startFilter', 'tableView', 'hideHeaderButtons', 'wrapperClass', 'tableClass', 'tableHeaderClass', 'sticky', 'virtualScroll'],
  mixins: [ModelsFetcher, searchMethods, FileMethods, customSelectMixins],
  components: { NewModel, UpdateModel, RemoveModelConfirm, RestoreModelConfirm, CloneModelConfirm, CustomSelect },
  data () {
    return {
      visible: false,
      downloadingExcel: false,
      confirm: {
        state: false,
        id: null,
        index: null,
        blueprint: null
      },
      newModel: false,
      cloneModel: false,
      updateModel: false,
      updateModelBatch: false,
      removeModel: false,
      restoreModel: false,
      loading: false,
      columns: [],
      options: {},
      visibleColumns: [],
      separator: 'horizontal',
      filters: {
        'searchBar': { text: '' }
      },
      selectedItems: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: this.rows ? this.rows : this.virtualScroll ? 0 : 15
      },
      names: [],
      showSearchHelp: false,
      showActions: null
    }
  },
  watch: {
    'filters.searchBar.text' () {
      // console.log('Watcher')
      let value = this.filters['searchBar'].text
      if (value.indexOf('&&') > -1 && Object.keys(this.filters).length > 1) {
        this.buildFilters(value)
      }
    }
  },
  computed: {
    showRestore () {
      return this.quasarData.fields.includes('deleted_at')
    },
    shouldRestore () {
      if (!this.selectedItems.length || !this.can.delete) return false
      for (let item of this.selectedItems) {
        if (!item.deleted_at) return false
      }
      return true
    },
    shouldRemove () {
      if (!this.selectedItems.length || !this.can.delete) return false
      for (let item of this.selectedItems) {
        if (item.deleted_at) return false
      }
      return true
    },
    shouldRemoveForever () {
      if (!this.$store.getters['User/isRoot']) return false
      else if (!this.selectedItems.length || !this.can.delete) return false
      for (let item of this.selectedItems) {
        if (!item.deleted_at) return false
      }
      return true
    },
    filter: {
      get () {
        let filter = ''
        if (this.filters['searchBar'].text) filter += this.filters['searchBar'].text
        for (let column in this.filters) {
          let ref = this.columns.filter(i => { return i.name === column })[0]
          if (!ref) continue
          if (this.filters[column].options === 'some') filter += '&&' + ref.label + '!='
          else if (this.filters[column].options === 'empty') filter += '&&' + ref.label + '=='
          else if (this.filters[column].options === 'clones') filter += '&&' + ref.label + '=2='
          else if (this.filters[column].options === 'uniques') filter += '&&' + ref.label + '=1='
          else if (this.filters[column].text) {
            if (this.filters[column].options === 'has') filter += '&&' + ref.label + '==' + this.filters[column].text
            else if (this.filters[column].options === 'is') filter += '&&' + ref.label + '=="' + this.filters[column].text
            else if (['not', 'in'].includes(this.filters[column].options)) {
              if (this.filters[column].text.indexOf(',') > -1) {
                let exclusions = this.filters[column].text.toLowerCase().split(',')
                if (this.filters[column].options === 'in') {
                  filter += '&&' + ref.label + '=in=' + exclusions.join('|')
                } else {
                  for (let exclusion of exclusions) filter += '&&' + ref.label + '!=' + exclusion
                }
              } else filter += '&&' + ref.label + '!=' + this.filters[column].text
            }
          }
        }
        return filter
      },
      set (value) {
        if (value) {
          // console.log('Setting')
          this.filters['searchBar'].text = value
        }
      }
    },
    // checkIndeterminate () {
    //   if (this.selectedItems.length && this.selectedItems.length !== this.model.length) return true
    //   return false
    // },
    ready () {
      if (!this.model) return false
      return true
    },
    can () {
      let object = {
        show: Object.keys(this.options).length ? this.options.actions.view : false,
        create: Object.keys(this.options).length ? this.options.actions.create : false,
        edit: Object.keys(this.options).length ? this.options.actions.update : false,
        delete: Object.keys(this.options).length ? this.options.actions.destroy : false
      }
      return object
    },
    model () {
      if (this.relatedTo) {
        return this.$store.state.Model.models[this.relatedTo.name].items[this.relatedTo.index][this.modelName]
      } else if (this.$store.state.Model.models[this.modelName]) {
        return this.$store.state.Model.models[this.modelName].items
      }
      return null
    },
    filteredModel () {
      return this.model.filter(i => { return this.filterIds.includes(i.id) })
    },
    quasarData () {
      if (this.relatedTo) {
        return this.$store.state.Model.models[this.relatedTo.name].quasarData.relations[this.modelName].quasarData
      } else return this.$store.state.Model.models[this.modelName].quasarData
    },
    // selectedId () {
    //   if (this.selectedItems.length > 0) return this.selectedItems[0].id
    //   return false
    // },
    batchForm () {
      if (this.quasarData) {
        if (Object.keys(this.quasarData.relations).length) return true
        let found = false
        for (let i in this.quasarData.formFields) {
          if (this.quasarData.formFields[i].batch) {
            found = true
            break
          }
        }
        return found
      }
      return false
    },
    batchMode () {
      return this.batchForm && this.selectedItems.length > 1
    }
  },
  methods: {
    buildFilters (value) {
      // console.log(value)
      let searches = []
      let spliters = ['==', '!=', '=="', '"']
      searches = value.split('&&')
      for (let filter of searches) {
        let label = ''
        let text = ''
        if (filter) {
          // console.log('Filter: ' + filter)
          for (let split of spliters) {
            // console.log('Split: ' + split)
            if (filter.indexOf(split) > -1) {
              label = filter.substring(0, filter.indexOf(split))
              text = filter.substring(filter.indexOf(split) + split.length)
              // console.log('Label: ' + label)
              // console.log('Text: ' + text)
              for (let column in this.filters) {
                // console.log('Label: ' + label)
                // console.log('Column: ' + column)
                // console.log(this.filters[column])
                if (this.filters[column].label === label) {
                  // console.log('Column Found')
                  if (text) {
                    // console.log('Text Found')
                    if (split === '==') this.filters[column].text = text
                    else if (split === '=="') {
                      this.filters[column].text = text
                      this.filters[column].options = 'is'
                    }
                  } else {
                    // console.log('Text Empty')
                    // console.log('Split: ' + split)
                    // console.log('Column: ' + column)
                    if (split === '==') {
                      // console.log('It is a MATCH')
                      this.filters[column].options = 'empty'
                    } else if (split === '!=') this.filters[column].options = 'some'
                  }
                  break
                }
              }
            }
          }
        }
      }
      this.filters['searchBar'].text = value.substring(0, value.indexOf('&&'))
      // console.log('Before Erasing')
      // console.log(this.filters)
      // console.log('Erasing')
    },
    clearFilters () {
      for (let column in this.filters) {
        this.filters[column].text = ''
        this.filters[column].options = 'has'
      }
    },
    log (item) {
    // console.log(item)
    },
    toggleSelection () {
      // console.log(this.$refs['table-' + this.modelName])
      if (!this.selectedItems.length) this.selectedItems = this.$refs['table-' + this.modelName].computedRows
      else if (this.selectedItems.length && this.selectedItems.length !== this.$refs['table-' + this.modelName].computedRowsNumber) this.selectedItems = this.filteredModel
      else this.selectedItems = []
    },
    sortColumn (column) {
      this.$refs['table-' + this.modelName].sort(column.name)
    },
    // updateCustomSelectFilter (payload, object) {
    //   if (!this.filters[object]) this.$set(this.filters, object, [])
    //   if (!payload) this.filters[object] = []
    //   else {
    //     let values = []
    //     payload.forEach((i) => { values.push(i.value) })
    //     this.filters[object] = values
    //   }
    // },
    exports () {
      this.downloadingExcel = true
      this.$axios({
        url: this.$store.state.App.dataWarehouse + 'exportExcel',
        method: 'POST',
        data: {
          model: this.modelName,
          ids: this.filterIds,
          blueprint: this.confirm.blueprint,
          modelOptions: this.$store.state.Model.models[this.modelName].options
        },
        responseType: 'blob'
      }).then((response) => {
        // console.log(response.data)
        let headers = response.headers['content-disposition'].split(';')
        let badname = headers[1].split('=')
        let name = badname[1]
        if (headers[2]) {
          let badname2 = headers[2].split('\'\'')
          // console.log(decodeURIComponent(badname2[1]))
          name = decodeURIComponent(badname2[1])
        }
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', name) // or any other extension
        document.body.appendChild(link)
        link.click()
        this.downloadingExcel = false
        this.$store.dispatch('Notify/displayMessage', { message: 'Downloaded', position: 'top', type: 'positive' })
      }).catch(({ response }) => {
        this.downloadingExcel = false
        this.$store.dispatch('Response/responseErrorManager', response)
      })
    },
    showUpdate () {
      if (!this.getModelView) this.updateModel = true
      else if (this.$store.state.Model.models[this.modelName].viewsFetched.includes(this.selectedItems[0].id)) this.updateModel = true
      else {
        this.visible = true
        this.$store.dispatch('Model/getModelView', { model: this.modelName, id: this.selectedItems[0].id })
          .then((data) => {
            // console.log(data.model)
            this.updateModel = true
            this.visible = false
          }).catch(({ response }) => {
            this.visible = false
            this.$store.dispatch('Response/responseErrorManager', response)
          })
      }
    },
    showUpdateBatch () {
      if (!this.getModelView) this.updateModel = true
      else if (this.$store.state.Model.models[this.modelName].viewsFetched.includes(this.selectedItems[0].id)) this.updateModel = true
      else {
        this.visible = true
        this.$store.dispatch('Model/getModelView', { model: this.modelName, id: this.selectedItems[0].id })
          .then((data) => {
            // console.log(data.model)
            this.updateModel = true
            this.visible = false
          })
      }
    },
    showView () {
      let id = this.selectedItems[0].id
      if (!this.getModelView) this.$emit('show', id)
      else if (this.$store.state.Model.models[this.modelName].viewsFetched.includes(id)) this.$emit('show', id)
      else {
        this.visible = true
        this.$store.dispatch('Model/getModelView', { model: this.modelName, id: id })
          .then((data) => {
            // console.log(data.model)
            this.$emit('show', id)
            this.visible = false
          })
      }
    },
    onRequest (props) {
      // let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination
      // let filter = props.filter
      // let pagination = {
      //   page: page,
      //   rowsPerPage: rowsPerPage,
      //   sortBy: sortBy,
      //   descending: descending,
      //   filter: filter
      // }
      // console.log('Request')
      // console.log(props)
      this.loading = true
      this.$axios.get(this.$store.state.Model.models[this.modelName].pagination.next_page_url)
        .then((response) => {
          this.$store.commit('Model/setModelItems', { name: this.modelName, items: response.data.model.data })
          this.$store.commit('Model/setModelPagination', { name: this.modelName, data: response.data.model })
          this.pagination.page = this.$store.state.Model.models[this.modelName].pagination.current_page
          this.loading = false
        })
    },
    cellName (column) {
      let name = 'body-cell-' + column.name
      this.names.push('name')
      return name
    },
    endCreating () {
      this.newModel = false
      this.selectedItems = []
      if (this.can.edit && this.editAferCreate) {
        this.selectedItems.push(this.$refs['table-' + this.modelName].computedRows[0])
        this.updateModel = true
        this.showUpdate()
      }
    },
    endUpdating () {
      this.updateModel = false
      this.selectedItems = []
    },
    removeConfirmed () {
      this.selectedItems = []
      this.removeModel = false
    },
    restoreConfirmed () {
      this.selectedItems = []
      this.restoreModel = false
    },
    cloneConfirmed () {
      this.selectedItems = []
      this.removeModel = false
    },
    getTable () {
      let params = {
        model: this.modelName,
        table: this.tableView
      }
      this.$axios({
        url: this.$store.state.App.dataWarehouse + 'table',
        method: 'GET',
        params: params
      }).then(({ data }) => {
        if (this.relatedTo) {
          // console.log('Building Columns on Relation Table')
          // console.log(this.columns)
          for (let i = 0; i < data.table.columns.length; i++) {
            if (data.table.columns[i].show === 'relation' || (this.grid && data.table.columns[i].onGrid !== 'hide')) this.columns.push(data.table.columns[i])
          }
        } else this.columns = data.table.columns
        this.options = data.table.options
      }).then(() => {
        for (let column of this.columns) {
          if (column.show) this.visibleColumns.push(column.field)
          this.$set(column, '__filterClass', 'q-table__sort-icon q-table__filter-icon q-table__sort-icon--left')
          this.$set(this.filters, column.name, {})
          this.$set(this.filters[column.name], 'text', '')
          this.$set(this.filters[column.name], 'options', 'has')
          this.$set(this.filters[column.name], 'label', column.label)
          this.names.push('body-cell-' + column.name)
        }
        this.columns.map(i => {
          if (i.name.indexOf('.') > -1) {
            let names = i.name.split('.')
            i['field'] = function (row) {
              let item = row[names[0]]
              for (let i = 1; i < names.length; i++) {
                if (!item) {
                  console.log('Null on Table')
                  continue
                }
                item = item[names[i]]
              }
              return item
            }
          }
          return i
        })
        if (this.filters['searchBar'].text) {
          this.buildFilters(this.filters['searchBar'].text)
        }
      })
    }
  },
  created () {
    this.getTable()
    if (this.relatedTo) {
      // console.log('Relation Table')
    } else if (this.$store.state.Model.models[this.modelName].pagination) {
      this.$set(this.pagination, 'rowsNumber', this.$store.state.Model.models[this.modelName].pagination.total)
    }
  },
  mounted () {
    if (this.startFilter) {
      this.filters['searchBar'].text = this.startFilter
    }
    this.$emit('tableReady')
  }
}
</script>
<style lang="stylus">
// @import '~quasar.variables'
  .info-dialog {
    font-size: .9em;
    p {
      line-height: 1.5;
    }
    .text-h6 {
      font-size: 1.2em;
      line-height: 1.2;
    }
    span.text-italic {
      font-size: .9em;
      line-height: .8;
      letter-spacing: 0;
    }
  }
</style>
