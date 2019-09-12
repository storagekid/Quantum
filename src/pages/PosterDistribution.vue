<template>
  <div class="row justify-center items-stretch flex col" style="overflow: auto;" ref="mainWindow">
    <div class="col-sm-3 q-pa-md" style="position: relative; min-width: 300px" v-show="selectorOpen">
      <custom-select
        :dense="true"
        :hide-bottom-space="true"
        :field="{name: 'clinics', type: { model: 'clinics', default: { text: 'Selecciona una clínica'} }}"
        :clearable='true'
        :initValue="clinicSelected"
        @updated="updateCustomSelect('clinicSelected', $event)"
        >
      </custom-select>
      <custom-select
        v-if="dates"
        :dense="true"
        :hide-bottom-space="true"
        :field="{name: 'dates', type: { model: 'dates', default: { text: 'Selecciona una Fecha'} }}"
        :clearable="dates.length > 1"
        :sourceOptions="dates"
        :initValue="dateSelected"
        @updated="updateCustomSelect('dateSelected', $event)"
        >
      </custom-select>
      <q-btn
        v-if="clinicSelected"
        size="sm"
        icon="add"
        color="primary"
        class="full-width q-mt-md"
        @click="startUploader"
        :disable="!clinicHasPosters"
        >
        Añade un plano
      </q-btn>
      <!-- <custom-select
        v-if="dateSelected"
        :dense="true"
        :hide-bottom-space="true"
        :field="{name: 'campaigns', type: { model: 'campaigns', default: { text: 'Selecciona una campaña'} }}"
        :clearable='true'
        :sourceOptions="campaignOptions"
        :initValue="campaignSelected"
        @updated="updateCustomSelect('campaignSelected', $event)"
        >
      </custom-select> -->
      <!-- <q-btn v-if="campaignSelected" size="sm" icon="save" color="primary" class="full-width q-mb-sm" label="Clonar Distribución Base" @click="cloneBaseDistribution"></q-btn> -->
      <q-btn size="sm" icon="save" color="info" class="full-width q-my-md" label="Guardar" :disable="!modelReady" @click="save"></q-btn>
      <q-btn size="sm" icon="file_copy" color="info" class="full-width q-mb-md" label="Clonar" :disable="!designsInRange.length" @click="cloneDialog.state = true"></q-btn>
      <q-uploader
        class="full-width hidden"
        ref="uploader"
        no-thumbnails
        auto-upload
        url=""
        :upload-factory="uploadFile"
        label="Añade un plano"
        :hide-upload-button="true"
        :hide-upload-progress="true"
        @added="uploadFilesAdded($event)"
      />
      <template v-if="clinicPosters">
        <div class="row justify-center items-start q-col-gutter-md">
          <div v-for="(clinicPoster, posterIndex) in clinicPosters" :key="posterIndex + 'poster'" class="col-xs-3">
            <q-card :class="{ghost: postersInDesigns.includes(clinicPoster.id)}" :disabled="postersInDesigns.includes(clinicPoster.id)">
              <q-card-section class="bg-secondary q-pa-xs">
                <div class="text-caption text-primary text-center" style="line-height: 1">{{clinicPoster.clinic_poster.poster.name}}</div>
                <div class="text-caption text-primary text-center" style="line-height: 1">{{clinicPoster.clinic_poster.type}}</div>
              </q-card-section>
              <q-card-section class="flex justify-center q-pa-xs">
                <div
                  :style="{
                    'min-width': clinicPoster.clinic_poster.poster.width / 25 + 'px',
                    'min-height': clinicPoster.clinic_poster.poster.height / 25 + 'px',
                    'opacity': clinicPoster.priority === 1 ? 1 : clinicPoster.priority === 2 ? 0.9 : clinicPoster.priority === 3 ? 0.8 : clinicPoster.priority === 4 ? 0.7 : clinicPoster.priority === 5 ? 0.6 : 0.5
                  }"
                  class="left-poster q-ma-none column justify-center text-center q-mt-sm"
                  >
                  <span class="text-h6 text-white">{{ clinicPoster.priority }}</span>
                </div>
              </q-card-section>
              <q-card-actions v-if="designs.length">
                <q-btn-dropdown size="sm" dense color="primary" icon="add" class="full-width" :disabled="postersInDesigns.includes(clinicPoster.id)">
                  <q-list bordered separator>
                    <q-item
                      clickable
                      v-close-popup
                      v-for="(design, index) in designsInRange"
                      :key="'DB' + index"
                      @click.stop="addPosterToDesign(index, posterIndex)"
                      @mouseover.stop="designTargeted = design.id"
                      @mouseleave.stop="designTargeted = null"
                      >
                      <q-item-section>
                        <q-item-label class="q-py-sm">
                          {{design.name}}
                          <q-list v-if="design.distributions.holders.length" dense separator class="q-mt-sm">
                            <template v-for="(holder, holderIndex) in design.distributions.holders">
                              <q-item
                                v-if="clinicPoster.clinic_poster.poster.name === holder.size && ((!holder.ext && (clinicPoster.clinic_poster.type === 'Ext' || clinicPoster.clinic_poster.type === 'Office')) || (!holder.int && (clinicPoster.clinic_poster.type === 'Int' || clinicPoster.clinic_poster.type === 'Office Int')))"
                                clickable
                                :key="'Holder' + holderIndex"
                                @click.stop="addPosterToHolder(index, posterIndex, holderIndex)"
                                @mouseover.self="board.selected = holderIndex"
                                @mouseleave.self="board.selected = false"
                                >
                                <q-item-section>
                                  <q-item-label class="text-primary" v-close-popup>{{holder.name}}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-list>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </template>
    </div>
    <div class="col">
      <q-page class="q-pa-md col-xs-12" style="max-height: calc(100vh - 70px); overflow: auto; min-width: 800px; background-color: rgba(200,200,200, .3)">
        <q-btn dense color="primary" :icon="selectorOpen ? 'arrow_back' : 'open_in_new'" style="position: absolute; top: 10px; left: -2px; z-index: 100" @click="selectorOpen = !selectorOpen"></q-btn>
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-xs-12" v-if="!clinicSelected">
            <q-banner class="bg-warning text-white text-center">
              <div class="text-h6">
                Selecciona una clínica para empezar
              </div>
            </q-banner>
          </div>
          <div class="col-xs-12" v-else-if="!designs.length">
            <template v-if="clinicSelected.posters">
              <q-banner class="bg-warning text-white text-center" v-if="Object.keys(clinicSelected.posters).length">
                <div class="text-h6">
                  Añade un plano para empezar a usar el distribuidor
                </div>
              </q-banner>
              <q-banner class="bg-info text-white text-center" v-else>
                <div class="text-h6">
                  La clínica no tiene carteles
                </div>
              </q-banner>
            </template>
          </div>
          <div v-for="design in designsInRange" :key="'Design' + design.__index" class="" style="width: 100%">
            <q-resize-observer @resize="onResize" />
            <q-card :class="{targeted: designTargeted === design.id, selected: designSelected === design.__index, 'design-box': true}">
              <q-card-section class="bg-secondary q-pa-xs q-mb-sm">
                <div class="text-caption text-primary text-center">{{design.name}}</div>
              </q-card-section>
              <q-card-section>
                <div class="text-center row">
                  <div class="col-xs-12">
                    <div class="text-center row q-col-gutter-sm">
                      <div class="col-xs-12 col-sm-4 bg-white text-primary">
                        <q-input
                          dense
                          mask="####-##-##"
                          fill-mask="#"
                          :rules="[]"
                          bottom-slots
                          :hide-bottom-space="true"
                          :error="design.starts_at === null"
                          error-message="Debes seleccionar una fecha de inicio"
                          label="Fecha Inicio"
                          stack-label
                          v-model="design.starts_at"
                          >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer" color="primary">
                              <q-popup-proxy :ref="'qDateProxy-' + design.__index + '-StartsAt'" transition-show="scale" transition-hide="scale">
                                <q-date color="primary" v-model="design.starts_at" @input="hideDatePicker(design.__index + '-StartsAt')" mask="YYYY-MM-DD" :options="dateOptions"/>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="col-xs-12 col-sm-4 bg-white text-primary">
                        <custom-select
                          v-if="dateSelected"
                          :dense="true"
                          :disable="true"
                          :hide-bottom-space="true"
                          :field="{name: 'campaigns', type: { model: 'campaigns', default: { text: 'Selecciona una campaña'} }}"
                          :clearable='true'
                          :sourceOptions="campaignOptions"
                          :initValue="campaignSelected"
                          @updated="updateCustomSelect('campaignSelected', $event)"
                          >
                        </custom-select>
                      </div>
                      <div class="col-xs-12 col-sm-4 bg-white text-primary">
                        <q-input
                          dense
                          mask="####-##-##"
                          fill-mask="#"
                          :rules="[]"
                          bottom-slots
                          :hide-bottom-space="true"
                          label="Fecha Fin"
                          stack-label
                          v-model="design.ends_at"
                          >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer" color="primary">
                              <q-popup-proxy :ref="'qDateProxy-' + design.__index + '-EndsAt'" transition-show="scale" transition-hide="scale">
                                <q-date color="primary" v-model="design.ends_at" @input="hideDatePicker(design.__index + '-EndsAt')" mask="YYYY-MM-DD"/>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-12">
                    <div class="text-center row q-col-gutter-sm">
                      <div class="col-xs-12 col-sm-8 bg-white text-primary">
                        <q-select
                          v-model="design.address"
                          :options="clinicSelected.addresses"
                          :option-label="(item) => (item.label + ' - ' + item.type)"
                          bottom-slots
                          :hide-bottom-space="true"
                          label="Calle"
                          stack-label
                          :error="design.address === null"
                          error-message="Debes seleccionar una calle"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-4 bg-white text-primary">
                        <div class="q-pa-md">
                          <q-badge color="primary">
                            Escala: {{ design.distributions.postersScale }} (1 to 3)
                          </q-badge>
                          <q-slider
                            v-model="design.distributions.postersScale"
                            :min="0.5"
                            :max="2"
                            :step="0.1"
                            label
                            color="warning"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-img
                  class="designcontainer"
                  :ref="`design${design.__index}`"
                  :src="typeof design.file === 'string' ? $store.state.App.publicSources + '/' + design.file : design.imageData"
                  :style="{
                    'width': '100%',
                    'min-width': '600px',
                    'height': 'auto',
                    'overflow': 'visible !important'
                    }"
                  @mousedown="toggleSelectDesign(design.__index)"
                  @mouseup="unpressDesign(design.__index)"
                  @mousemove.prevent.stop="moveHolder($event, design.__index)"
                  >
                  <template v-if="design.distributions.holders.length">
                    <div
                      v-for="(poster, index) in design.distributions.holders" :key="'poster'+index"
                      :class="{poster: true, selected: (holderSelected.includes(index) && designSelected === design.__index)}"
                      :ref="`poster${design.__index}${index}`"
                      @mousedown.exact="selectDesignPoster($event, index, design.__index)"
                      @mouseup.stop="unpressPoster(design.__index)"
                      @click.shift.exact.prevent.stop="toggleSelectedHolder($event, index)"
                      @keydown.down.exact="designs[design.__index].distributions.holders[index].top += 1"
                      @keydown.down.shift.exact="designs[design.__index].distributions.holders[index].top += 10"
                      @keydown.up.exact="designs[design.__index].distributions.holders[index].top -= 1"
                      @keydown.up.shift.exact="designs[design.__index].distributions.holders[index].top -= 10"
                      @keydown.left.exact="designs[design.__index].distributions.holders[index].left -= 1"
                      @keydown.left.shift.exact="designs[design.__index].distributions.holders[index].left -= 10"
                      @keydown.right.exact="designs[design.__index].distributions.holders[index].left += 1"
                      @keydown.right.shift.exact="designs[design.__index].distributions.holders[index].left += 10"
                      :tabindex="99 + index"
                      :style="{
                        'box-sizing': 'content-box',
                        'display': 'flex',
                        'flex-direction': 'column',
                        'align-items': 'center',
                        'background-color': (poster[poster.showing]) ? 'rgba(134,49,115, ' + getPriority(poster[poster.showing]) + ')' : 'rgba(50,50,50,.5)',
                        'top': poster.top + 'px',
                        'left': poster.left + 'px',
                        'width': poster.width * design.distributions.postersScale + 'px',
                        'height': poster.height * design.distributions.postersScale + 'px',
                        'z-index': holderSelected[0] === index ? '100' : '1'
                        }"
                      >
                      <div class="holder-header" :style="{'top': '-' + (design.distributions.postersScale < 1 ? design.distributions.postersScale * 30 : design.distributions.postersScale * 27) + 'px'}">
                        <q-btn v-if="poster.ext && poster.int" color="info" dense size="md" icon="flip" class="q-pa-none" @click.stop="flipHolder(poster)" style="position: absolute; top: -20px; right: -20px"></q-btn>
                        <q-btn v-if="poster.ext || poster.int" color="negative" dense size="md" icon="delete" class="q-pa-none" @click.stop="removePosterFromHolder(design.__index, index, poster.showing, poster[poster.showing].id)" style="position: absolute; top: -20px; left: -20px"></q-btn>
                        <p
                          :style="{'margin': 0, 'line-height': .6, 'font-weight': 'bold', 'font-size': design.distributions.postersScale > 1 ? (design.distributions.postersScale + 0.2) + 'em' : (design.distributions.postersScale + 0.2) + 'em'}"
                          class="text-caption"
                          >
                          {{ poster.name }}
                        </p>
                      </div>
                      <div
                        class="info text-center"
                        :style="{
                        }"
                        >
                        <template v-if="poster[poster.showing]">
                          <q-select
                            items-aligned
                            hide-dropdown-icon
                            :style="{
                              'min-height': '40%',
                              'flex': 1,
                              'font-weight': 'bold',
                              'font-size': design.distributions.postersScale > 1 ? (design.distributions.postersScale + 0.9) + 'em' : (design.distributions.postersScale + 0.5) + 'em'
                            }"
                            dense
                            borderless
                            standout
                            dark
                            v-model="poster[poster.showing].priority"
                            :options="[1,2,3,4,5,6,7,8]"
                            options-dense
                          />
                          <p
                            :style="{
                              'font-size': design.distributions.postersScale > 1 ? (design.distributions.postersScale + 0.4) + 'em' : (design.distributions.postersScale + 0.0) + 'em',
                              'align-items': 'center',
                              'display': 'flex',
                              'flex': 1,
                              'margin-bottom': 0,
                              'justify-content': 'center',
                              'min-height': '25%',
                              'line-height': '0.8',
                              'width': '100%'
                            }">
                            {{ poster[poster.showing].clinic_poster.type }}
                          </p>
                          <p
                            :style="{
                              'font-size': design.distributions.postersScale > 1 ? (design.distributions.postersScale - 0.2) + 'em' : (design.distributions.postersScale + 0) + 'em',
                              'align-items': 'center',
                              'display': 'flex',
                              'flex': 1,
                              'margin-bottom': 0,
                              'justify-content': 'center',
                              'min-height': '25%',
                              'width': '100%'
                            }">
                            {{ poster[poster.showing].clinic_poster.poster.name }}
                          </p>
                        </template>
                        <template v-else>
                          <p
                            :style="{
                              'font-size': design.distributions.postersScale > 1 ? (design.distributions.postersScale - 0.2) + 'em' : (design.distributions.postersScale - 0.2) + 'em',
                              'font-weight': 'bold',
                              'align-items': 'center',
                              'display': 'flex',
                              'flex': 1,
                              'margin-bottom': 0,
                              'justify-content': 'center',
                              'min-height': '50%',
                              'width': '100%'
                            }">
                            {{ poster.size }}
                          </p>
                          <q-btn
                            color="white"
                            dense
                            flat
                            size="md"
                            icon="delete"
                            class="q-pa-none"
                            @click.stop="removeHolderFromDesign(design.__index, index)"
                            :style="{
                              'font-size': design.distributions.postersScale > 1 ? (design.distributions.postersScale - 0.2) + 'em' : (design.distributions.postersScale + 0) + 'em',
                              'align-items': 'center',
                              'display': 'flex',
                              'flex': 1,
                              'margin-bottom': 0,
                              'justify-content': 'center',
                              'min-height': '40%',
                              'width': '100%'
                            }"
                            >
                          </q-btn>
                        </template>
                      </div>
                    </div>
                  </template>
                </q-img>
              </q-card-section>
              <q-card-actions class="justify-between">
                <div class="q-gutter-xs">
                  <q-btn flat size="sm" icon="shuffle" color="primary" label="Cambiar Fachada" @click="updateFacadeFile(design.__index)"></q-btn>
                  <q-btn-dropdown
                    icon="insert_photo"
                    color="primary"
                    flat
                    label="Composición"
                    unelevated
                    size="sm"
                    :loading="btnLoaders.compose"
                    >
                    <div class="column q-gutter-sm q-py-sm">
                      <q-btn flat v-close-popup size="sm" icon="gesture" color="primary" label="Generar Composición" @click="composeFacade(design.__index)" v-if="!design.composed_facade_file_id"></q-btn>
                      <q-btn flat v-close-popup size="sm" icon="redo" color="primary" label="Rehacer Composición" @click="composeFacade(design.__index, true)" v-else></q-btn>
                      <q-btn flat v-close-popup size="sm" icon="get_app" color="primary" label="Descargar Composición" @click="downloadFile(design.composed_facade_file_id)" v-if="design.composed_facade_file_id"></q-btn>
                      <q-btn flat v-close-popup size="sm" icon="delete_forever" color="primary" label="Eliminar Composición" @click="removeComposedFacade(design.composed_facade_file_id, design.__index)" v-if="design.composed_facade_file_id"></q-btn>
                    </div>
                  </q-btn-dropdown>
                  <q-btn-dropdown
                    icon="table_chart"
                    color="primary"
                    flat
                    :label="'PDFs-' + design.complete_facades.length"
                    unelevated
                    size="sm"
                    :loading="btnLoaders.facadePdf"
                    v-if="campaignOptions"
                    >
                    <div class="column q-gutter-sm q-py-sm">
                      <q-btn-dropdown
                        color="primary"
                        flat
                        label="Generate"
                        unelevated
                        size="sm"
                        >
                        <div class="column q-gutter-sm q-py-sm">
                          <template v-for="campaign in campaignOptions">
                            <q-btn
                              v-if="!design.complete_facades_campaigns.includes(campaign.id) && campaign.campaign_posters_count"
                              flat
                              v-close-popup
                              size="sm"
                              icon="gesture"
                              color="primary"
                              :label="campaign.name"
                              :key="'gc-' + campaign.id"
                              @click="completeFacade(design.__index, campaign.id)"></q-btn>
                          </template>
                        </div>
                      </q-btn-dropdown>
                      <q-btn-dropdown
                        color="primary"
                        flat
                        label="Remade"
                        unelevated
                        size="sm"
                        >
                        <div class="column q-gutter-sm q-py-sm">
                          <template v-for="facade in design.complete_facades">
                            <q-btn flat v-close-popup size="sm" icon="redo" color="primary" :label="campaignOptions.filter((i) => { return i.id === facade.campaign_id })[0].name" :key="'rgc-' + facade.id" @click="completeFacade(design.__index, facade.campaign_id, true)"></q-btn>
                          </template>
                        </div>
                      </q-btn-dropdown>
                      <q-btn-dropdown
                        color="primary"
                        flat
                        label="Download"
                        unelevated
                        size="sm"
                        >
                        <div class="column q-gutter-sm q-py-sm">
                          <template v-for="facade in design.complete_facades">
                            <q-btn flat v-close-popup size="sm" icon="get_app" color="primary" :label="campaignOptions.filter((i) => { return i.id === facade.campaign_id })[0].name" :key="'dc-' + facade.id" @click="downloadPDF(facade.complete_facade_file_id)"></q-btn>
                          </template>
                        </div>
                      </q-btn-dropdown>
                      <q-btn-dropdown
                        color="primary"
                        flat
                        label="Remove PDF"
                        unelevated
                        size="sm"
                        >
                        <div class="column q-gutter-sm q-py-sm">
                          <template v-for="(facade, facadeIndex) in design.complete_facades">
                            <q-btn flat v-close-popup size="sm" icon="delete_forever" color="primary" :label="campaignOptions.filter((i) => { return i.id === facade.campaign_id })[0].name" :key="'dc-' + facade.id" @click="removeFacade(facade, facadeIndex, design.__index)"></q-btn>
                          </template>
                        </div>
                      </q-btn-dropdown>
                    </div>
                  </q-btn-dropdown>
                </div>
              </q-card-actions>
              <q-card-actions class="justify-between">
                <q-btn unelevated size="sm" icon="get_app" color="primary" label="Rename Holders" @click="renameHolders(design.__index)"></q-btn>
                <q-btn-dropdown
                  split
                  icon="border_clear"
                  disable-main-btn
                  :disable-dropdown="holderSelected.length < 2"
                  class="glossy"
                  color="primary"
                  label="Align"
                  unelevated
                  content-class="bg-transparent no-shadow"
                  size="sm"
                  >
                  <div class="column q-gutter-sm q-py-sm items-end">
                    <q-btn round size="sm" icon="border_top" color="primary" @click="align('top')"></q-btn>
                    <q-btn round size="sm" icon="border_bottom" color="primary" @click="align('bottom')"></q-btn>
                    <q-btn round size="sm" icon="border_left" color="primary" @click="align('left')"></q-btn>
                    <q-btn round size="sm" icon="border_right" color="primary" @click="align('right')"></q-btn>
                  </div>
                </q-btn-dropdown>
                <q-btn unelevated size="sm" icon="select_all" color="primary" label="Select All" @click="selectAllHoldersInDesign(design.__index)"></q-btn>
                <q-space />
                <q-btn-group rounded outline>
                  <q-btn rounded size="sm" icon="flip" color="info" @click="flipPosters(design.__index, false)"></q-btn>
                  <q-btn rounded outline size="sm" color="info" label="Exteriores" @click="flipPosters(design.__index, 'ext')"></q-btn>
                  <q-btn rounded outline size="sm" color="info" label="Interiores" @click="flipPosters(design.__index, 'int')"></q-btn>
                </q-btn-group>
                <!-- <q-btn size="sm" flat color="negative" icon="delete" label="Eliminar" @click="removeDesign(design.__index)"></q-btn> -->
                <q-btn size="sm" flat color="negative" icon="delete" label="Eliminar" @click="showConfirm(design.__index)"></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-page>
    </div>
    <q-dialog v-model="confirm.state" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">El plano se eliminará, ¿deseas continuar?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="negative" v-close-popup @click="removeDesign"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="cloneDialog.state" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="info" color="info" text-color="white" />
          <span class="q-ml-sm">Seleccione las opciones para clonar la distribución</span>
        </q-card-section>
        <q-card-section>
          <custom-select
            :dense="false"
            :hide-bottom-space="true"
            :field="{name: 'campaigns', type: { model: 'campaigns', default: { text: '¿Esta relaccionado con una campaña?'} }}"
            :clearable='true'
            :initValue="cloneDialog.campaign"
            @updated="updateCustomSelect('cloneDialog.campaign', $event)"
            >
          </custom-select>
          <q-input
            mask="####-##-##"
            :rules="[]"
            bottom-slots
            label="Empieza el"
            stack-label
            v-model="cloneDialog.starts_at"
            >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" color="primary">
                <q-popup-proxy ref="qDateProxy-CSA" transition-show="scale" transition-hide="scale">
                  <q-date color="primary" v-model="cloneDialog.starts_at" @input="hideDatePicker('CSA')" mask="YYYY-MM-DD"/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <!-- <q-input
            dense
            mask="####-##-##"
            :rules="[]"
            bottom-slots
            label="Empieza el"
            stack-label
            v-model="cloneDialog.ends_at"
            >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" color="primary">
                <q-popup-proxy ref="qDateProxy-CEA" transition-show="scale" transition-hide="scale">
                  <q-date color="primary" v-model="cloneDialog.ends_at" @input="hideDatePicker('CEA')" mask="YYYY-MM-DD"/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input> -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="negative" v-close-popup @click="cloneDistributions"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible" style="z-index: 1000">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
import { Helpers } from '../mixins/helpers'
import { ModelsFetcher, ModelController } from '../mixins/modelMixin'
import { FileDownloadMethods } from '../mixins/fileMixin'
import CustomSelect from '../components/form/customSelect'

export default {
  name: 'PosterDistribution',
  mixins: [ModelsFetcher, ModelController, FileDownloadMethods, Helpers],
  components: { CustomSelect },
  data () {
    return {
      modelsNeeded: {
        clinics: {
          scoped: false,
          full: false,
          refresh: false,
          cache: false,
          where: false
        },
        campaigns: {
          scoped: false,
          refresh: false,
          withCount: ['campaign_posters'],
          // with: ['campaign_posters', 'campaign_poster_priorities', 'sanitary_codes'],
          orderBy: 'starts_at',
          orderDesc: true
        }
      },
      name: 'poster_distributions',
      designs: [],
      designSelected: null,
      designPressed: null,
      holderSelected: [],
      designTargeted: null,
      holderTargeted: null,
      clinicSelected: null,
      dateSelected: null,
      campaignSelected: '',
      model: null,
      board: {
        minWidth: 800,
        minHeight: 600,
        width: 0,
        height: 0,
        clicked: false,
        selected: false
      },
      selectorOpen: true,
      updatingFacade: false,
      confirm: {
        state: false,
        id: null,
        index: null
      },
      cloneDialog: {
        state: false,
        campaign: null,
        starts_at: null,
        ends_at: null
      },
      btnLoaders: {
        compose: false,
        facadePdf: false
      },
      visible: false
    }
  },
  computed: {
    campaignOptions () {
      if (this.dateSelected) {
        return this.$store.state.Model.models.campaigns.items.filter(i => {
          if (this.designsInRange[0].ends_at) return i.starts_at >= this.dateSelected.value && this.designsInRange[0].ends_at > i.starts_at
          return i.ends_at >= this.dateSelected.value
        })
      }
      return []
    },
    dates () {
      let dates = []
      let dateObjects = []
      for (let design of this.designs) {
        if (!dates.includes(design.starts_at)) {
          dates.push(design.starts_at)
          let date = {
            label: design.starts_at,
            value: design.starts_at
          }
          dateObjects.push(date)
        }
      }
      return dateObjects.length ? dateObjects : null
    },
    clinicIndex () {
      let index = null
      // console.log('Computed Index')
      for (let i = 0; i < this.$store.state.Model.models.clinics.items.length; i++) {
        // console.log(i)
        if (this.$store.state.Model.models.clinics.items[i].id === this.clinicSelected.id) {
          index = i
          break
        }
      }
      // console.log('Computed Index Without Clinic')
      return index
    },
    campaignSelectedId () {
      let id = ''
      if (this.designsInRange.length) {
        id = this.designsInRange[0].campaign_id
        for (let design of this.designsInRange) {
          if (design.campaign_id !== id) return ''
        }
      }
      return id === null ? '' : id
    },
    clinicHasPosters () {
      if (this.model) {
        if (this.model.posters) {
          if (Object.keys(this.model.posters).length) return true
        }
      }
      return null
    },
    clinicPosters () {
      if (this.model && this.dateSelected) {
        let posters = []
        for (let poster of this.model.posters[this.campaignSelectedId]) {
          if (this.campaignSelectedId !== '') {
            posters.push(poster)
            continue
          } else if (poster.ends_at <= this.dateSelected.value || poster.starts_at > this.dateSelected.value) continue
          posters.push(poster)
        }
        return posters
      }
      return null
    },
    modelReady () {
      if (!this.clinicSelected || !this.designs.length) return false
      for (let design of this.designs) {
        if (!design.address) return false
      }
      return true
    },
    designsInRange () {
      let designs = []
      if (this.designs.length && this.dateSelected) {
        for (let i = 0; i < this.designs.length; i++) {
          if (this.designs[i].starts_at === this.dateSelected.value) {
            let design = this.designs[i]
            design['__index'] = i
            designs.push(design)
          }
        }
      }
      return designs
    },
    postersInDesigns () {
      let ids = []
      for (let design of this.designsInRange) {
        for (let id of design.distributions.posterIds) ids.push(id)
      }
      return ids
    },
    selectedFrame () {
      if (this.board.selected !== false) return this.designs[this.board.designSelected].distributions.holders[this.board.selected]
      return null
    },
    selectedDesign () {
      return this.designs.filter(i => { return i.id === this.designTargeted })[0]
    }
  },
  watch: {
    dates () {
      // console.log('Watching dates')
      // console.log(this.dates)
      if (!this.dates) this.dateSelected = null
      else if (this.dates.length === 1) {
        if (this.dates[0].value) this.dateSelected = this.dates[0]
      } else if (this.dateSelected) {
        if (!this.dates.filter((i) => { return i.value === this.dateSelected.value }).length) this.dateSelected = null
      // else if (!this.dates.includes(this.dateSelected)) this.dateSelected = null
      } else {
        let sortedDates = this.dates.sort((a, b) => (a.starts_at < b.starts_at) ? 1 : ((b.starts_at < a.starts_at) ? -1 : 0)).reverse()
        this.dateSelected = sortedDates[0]
      }
    },
    clinicSelected () {
      this.model = null
      this.campaignSelected = ''
      this.dateSelected = null
      this.designs = []
      if (this.clinicSelected) {
        this.visible = true
        this.$store.dispatch('Model/getModelView', { model: 'clinics', id: this.clinicSelected.value, params: { view: 'distributions' } })
          .then((data) => {
            this.model = data.model
            console.log('HERE')
            // console.log(data.model)
            if (this.model.poster_distributions.length) this.buildModelDesigns(this.model.poster_distributions)
            this.model['originalPosterPriorities'] = JSON.parse(JSON.stringify(this.model.posters))
            this.visible = false
          }).catch((response) => {
            console.log('THERE')
            this.$store.dispatch('Response/responseErrorManager', response)
            this.visible = false
          })
      }
    },
    campaignSelected () {
      if (!this.model) return
      if (!this.model.posters[this.campaignSelectedId]) {
        // console.log('No Priorities Yet For This Campaign')
        this.visible = true
        this.duplicatePosterPriorities(this.campaignSelectedId).then(() => {
          for (let design of this.designs) {
            this.$set(design.posterIds, this.campaignSelectedId, [])
            for (let holder of design.distributions.holders) {
              this.$set(holder.ext, this.campaignSelectedId, null)
              this.$set(holder.int, this.campaignSelectedId, null)
            }
          }
          this.visible = false
        })
        // this.model.posters[this.campaignSelectedId] = JSON.parse(JSON.stringify(this.model.posters['']))
        // for (let poster of this.model.posters[this.campaignSelectedId]) {
        //   poster.campaign_id = this.campaignSelectedId
        // }
      }
    }
  },
  methods: {
    cloneDistributions () {
      this.$q.loading.show()
      let designIds = []
      for (let design of this.designsInRange) {
        designIds.push(design.id)
      }
      let actionPayload = {}
      actionPayload.url = this.$store.state.App.dataWarehouse + 'clinics/' + this.clinicSelected.id + '/posterDistributionClone'
      actionPayload.method = 'POST'
      actionPayload.params = {
        'designs': designIds,
        'starts_at': this.cloneDialog.starts_at || '',
        'campaign': this.cloneDialog.campaign || ''
      }
      this.$axios({
        url: actionPayload.url,
        method: actionPayload.method,
        params: actionPayload.params
      }).then((response) => {
        this.$q.loading.hide()
        this.$store.commit('Model/updateModelItems', { name: 'clinics', item: response.data.model })
        this.clinicSelected = response.data.model
        this.$store.dispatch('Notify/displayMessage', { message: 'Distributions Cloned Successfully', position: 'top', type: 'positive' })
      }).catch((response) => {
        this.$q.loading.hide()
        this.$store.dispatch('Notify/displayMessage', { message: 'Action Failed', position: 'top', type: 'negative' })
      })
      return true
    },
    // clonePosterPriorities () {
    //   return new Promise((resolve, reject) => {
    //     let startDate = new Date(this.cloneDialog.starts_at)
    //     let endsDate = new Date(startDate.setDate(startDate.getDate() - 1))
    //     // console.log(startDate)
    //     // console.log(endsDate)
    //     let endsAt = endsDate.getFullYear() + '-' + (endsDate.getMonth() < 10 ? '0' : '') + (Number(endsDate.getMonth()) + 1) + '-' + (endsDate.getDate() < 10 ? '0' : '') + endsDate.getDate()
    //     console.log(this.cloneDialog.starts_at)
    //     console.log(endsAt)
    //     // if (this.cloneDialog.state) resolve()
    //     let count = 0
    //     let total = this.clinicPosters.length
    //     let payload = { name: 'clinic_poster_priorities', model: null }
    //     for (let poster of this.clinicPosters) {
    //       count++
    //       payload.model = JSON.parse(JSON.stringify(poster))
    //       delete payload.model.id
    //       delete payload.model.created_at
    //       delete payload.model.updated_at
    //       payload.model.starts_at = this.cloneDialog.starts_at
    //       payload.model.ends_at = this.cloneDialog.campaign ? this.this.cloneDialog.campaign.ends_at : null
    //       payload.url = this.$store.state.App.dataWarehouse + payload.name
    //       this.$store.dispatch('Model/sendNewForm', {
    //         'source': payload
    //       }).then((response) => {
    //         // this.$store.commit('Model/addModelItems', { name: payload.name, items: response.model })
    //         this.$store.dispatch('Notify/displayMessage', { message: 'Model: ' + payload.name + ' Created', position: 'top', type: 'positive' })
    //         if (!this.cloneDialog.campaign) {
    //           count--
    //           payload.model = null
    //           payload.model = JSON.parse(JSON.stringify(poster))
    //           delete payload.model.clinic_poster
    //           payload.model.ends_at = endsAt
    //           payload.url = this.$store.state.App.dataWarehouse + payload.name + '/' + payload.model.id
    //           this.$store.dispatch('Model/sendUpdateForm', {
    //             'source': payload
    //           }).then((response) => {
    //             count++
    //             this.$store.dispatch('Notify/displayMessage', { message: 'Model: ' + payload.name + ' Updated', position: 'top', type: 'positive' })
    //             if (count === total) resolve()
    //           }).catch((response) => {
    //             this.$store.dispatch('Response/responseErrorManager', response)
    //           })
    //         }
    //         if (count === total) resolve()
    //         // this.$emit('formRespondedOK')
    //       }).catch((response) => {
    //         // this.$emit('formRespondedWithErrors')
    //         this.$store.dispatch('Response/responseErrorManager', response)
    //         if (count === total) reject()
    //       })
    //     }
    //   })
    // },
    downloadPDF (fileId) {
      this.btnLoaders.facadePdf = true
      this.downloadFile(fileId)
        .then(() => {
          this.btnLoaders.facadePdf = false
        }).catch(() => {
          this.btnLoaders.facadePdf = false
        })
    },
    removeFacade (facade, facadeIndex, designIndex) {
      this.btnLoaders.facadePdf = true
      let payload = { relation: 'poster_distributions', id: this.designs[designIndex].id }
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id + '/removeFacade?campaign=' + facade.campaign_id
      this.$axios({
        url: payload.url,
        method: 'GET',
        params: payload.params
      }).then((response) => {
        this.$store.commit('Model/updateRelationItems', { name: 'clinics', relation: 'poster_distributions', item: response.data.model, parentIndex: this.clinicIndex })
        this.designs[designIndex].complete_facades_campaigns.splice(this.designs[designIndex].complete_facades_campaigns.indexOf(facade.campaign_id), 1)
        this.designs[designIndex].complete_facades.splice(facadeIndex, 1)
        this.$store.dispatch('Notify/displayMessage', { message: 'Facade Remove Successfully', position: 'top', type: 'positive' }, { root: true })
        this.btnLoaders.facadePdf = false
      }).catch((response) => {
        this.$store.dispatch('Response/responseErrorManager', response)
        this.btnLoaders.facadePdf = false
      })
    },
    removeComposedFacade (fileId, designIndex) {
      this.btnLoaders.compose = true
      this.removeFile(fileId)
        .then(() => {
          this.designs[designIndex].composed_facade_file_id = null
          this.btnLoaders.compose = false
        }).catch(() => {
          this.btnLoaders.compose = false
        })
    },
    dateOptions (date) {
      let newdate = date.replace(/\//g, '-')
      return newdate >= this.clinicSelected.starts_at
    },
    hideDatePicker (index) {
      let picker = 'qDateProxy-' + index
      // console.log(picker)
      if (this.$refs[picker][0]) this.$refs[picker][0].hide()
      else this.$refs[picker].hide()
    },
    composeFacade (index, force = false) {
      this.btnLoaders.compose = true
      let payload = { relation: 'poster_distributions', id: this.designs[index].id }
      payload['params'] = {
        'force': force
      }
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id + '/compose'
      this.$axios({
        url: payload.url,
        method: 'GET',
        params: payload.params
      }).then((response) => {
        this.btnLoaders.compose = false
        this.$store.commit('Model/updateRelationItems', { name: 'clinics', relation: 'poster_distributions', item: response.data.model, parentIndex: this.clinicIndex })
        this.designs[index].composed_facade_file_id = response.data.model.composed_facade_file_id
        this.$store.dispatch('Notify/displayMessage', { message: 'Facade Composed successfull', position: 'top', type: 'positive' }, { root: true })
      }).catch((response) => {
        this.btnLoaders.compose = false
        this.$store.dispatch('Response/responseErrorManager', response)
      })
    },
    completeFacade (index, campaignId, force = false) {
      this.btnLoaders.facadePdf = true
      let payload = { relation: 'poster_distributions', id: this.designs[index].id }
      payload['params'] = {
        'force': force
      }
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id + '/complete?campaign=' + campaignId
      this.$axios({
        url: payload.url,
        method: 'GET',
        params: payload.params
      }).then((response) => {
        this.btnLoaders.facadePdf = false
        this.$store.commit('Model/updateRelationItems', { name: 'clinics', relation: 'poster_distributions', item: response.data.model, parentIndex: this.clinicIndex })
        if (response.data.model.complete_facades.length) {
          for (let facade of response.data.model.complete_facades) {
            if (!this.designs[index].complete_facades_campaigns.includes(facade.campaign_id)) {
              this.designs[index].complete_facades_campaigns.push(facade.campaign_id)
              this.designs[index].complete_facades.push(facade)
            }
          }
        }
        this.$store.dispatch('Notify/displayMessage', { message: 'Facade Completed Successfully', position: 'top', type: 'positive' }, { root: true })
      }).catch((response) => {
        this.btnLoaders.facadePdf = false
        // console.log(response)
        this.$store.dispatch('Response/responseErrorManager', response)
      })
    },
    showConfirm (designIndex) {
      this.confirm.state = true
      this.confirm.index = designIndex
    },
    renameHolders (designIndex) {
      this.designs[designIndex].distributions.holders.sort((a, b) => (a.left > b.left) ? 1 : ((b.left > a.left) ? -1 : 0))
      for (let i = 0; i < this.designs[designIndex].distributions.holders.length; i++) {
        this.designs[designIndex].distributions.holders[i].name = 'S-' + (i + 1)
      }
    },
    selectAllHoldersInDesign (designIndex) {
      this.designSelected = designIndex
      this.holderSelected = []
      for (let i = 0; i < this.designs[designIndex].distributions.holders.length; i++) this.holderSelected.push(i)
    },
    flipPosters (designIndex, side = false) {
      this.designs[designIndex].distributions.holders.map(i => {
        i.showing = side !== false ? side : i.showing === 'ext' ? 'int' : 'ext'
      })
    },
    cloneBaseDistribution () {
      for (let design of this.designs) {
        design.posterIds[this.campaignSelectedId] = [...design.posterIds['']]
        for (let holder of design.distributions.holders) {
          holder.ext[this.campaignSelectedId] = this.model.posters[this.campaignSelectedId].filter(i => { return i.id === holder.ext[''].id })[0]
          holder.int[this.campaignSelectedId] = this.model.posters[this.campaignSelectedId].filter(i => { return i.id === holder.int[''].id })[0]
        }
      }
    },
    updateFacadeFile (designIndex) {
      this.updatingFacade = designIndex
      this.startUploader()
    },
    buildModelDesigns (designs) {
      console.log('Building Designs')
      this.designs = []
      for (let design of designs) {
        let baseDesign = this.createDesign()
        let data = JSON.parse(design.distributions)
        // console.log(data)
        baseDesign['id'] = design['id']
        baseDesign['clinic_id'] = design['clinic_id']
        baseDesign['address_id'] = design['address_id']
        baseDesign['address'] = this.model.addresses.filter(i => { return i.id === design.address_id })[0]
        baseDesign['campaign_id'] = design['campaign_id']
        baseDesign['original_facade_file_id'] = design.original_facade_file_id
        baseDesign['composed_facade_file_id'] = design.composed_facade_file_id
        // baseDesign['complete_facade_file_id'] = design.complete_facade_file_id
        baseDesign['complete_facades'] = design.complete_facades
        baseDesign['starts_at'] = design['starts_at']
        baseDesign['ends_at'] = design['ends_at']

        baseDesign['file'] = design.original_facade.url
        baseDesign['name'] = design.original_facade.name

        baseDesign.distributions['scale'] = data['scale']
        baseDesign.distributions['postersScale'] = data['postersScale']
        baseDesign.distributions['width'] = data['width']
        baseDesign.distributions['height'] = data['height']
        baseDesign.distributions['holders'] = []
        baseDesign.distributions['posterIds'] = data['posterIds'] ? data['posterIds'] : []
        console.log('There')
        if (data['holders'].length) {
          for (let holder of data['holders']) {
            if (!holder.lastX) holder['lastX'] = 0
            if (!holder.lastY) holder['lastY'] = 0
            baseDesign.distributions['holders'].push(holder)
          }
        }
        baseDesign['complete_facades_campaigns'] = []
        if (baseDesign.complete_facades.length) {
          for (let facade of baseDesign.complete_facades) baseDesign['complete_facades_campaigns'].push(facade.campaign_id)
        }
        if (baseDesign.distributions.holders.length) {
          let campaignId = baseDesign.campaign_id ? baseDesign.campaign_id : ''
          console.log('Beyond')
          console.log('Campaign: ' + campaignId)
          for (let holder of baseDesign.distributions.holders) {
            holder.ext = this.model.posters[campaignId].filter(i => { return i.id === holder.ext })[0]
            holder.int = this.model.posters[campaignId].filter(i => { return i.id === holder.int })[0]
          }
        }
        console.log('Finish ' + design.id)
        this.designs.push(baseDesign)
      }
    },
    save () {
      this.savePosterPriorities().then(() => { this.saveDistribution() })
    },
    savePosterPriorities () {
      return new Promise((resolve, reject) => {
        let modelsToUpdate = []
        for (let originalPriority of this.model.clinic_poster_priorities) {
          for (let campaign in this.model.posters) {
            for (let newPriority of this.model.posters[campaign]) {
              if (originalPriority.id !== newPriority.id) continue
              else if (originalPriority.priority === newPriority.priority) break
              else {
                // console.log('Diferent Priority Found')
                modelsToUpdate.push(newPriority)
              }
            }
          }
        }
        if (modelsToUpdate.length) {
          let round = 0
          for (let model of modelsToUpdate) {
            round++
            let actionPayload = {}
            actionPayload.url = this.$store.state.App.dataWarehouse + 'clinic_poster_priorities/' + model.id
            actionPayload.method = 'POST'
            actionPayload.data = model
            actionPayload.data['_method'] = 'PATCH'
            this.$axios({
              url: actionPayload.url,
              method: actionPayload.method,
              data: actionPayload.data
            }).then((response) => {
              this.$store.dispatch('Notify/displayMessage', { message: 'PP Updated Successfully', position: 'top', type: 'positive' })
              if (round === modelsToUpdate.length) resolve()
            }).catch((response) => {
              this.$store.dispatch('Notify/displayMessage', { message: 'Action Failed', position: 'top', type: 'negative' })
              if (round === modelsToUpdate.length) reject()
            })
          }
        } else resolve()
      })
    },
    duplicatePosterPriorities (campaignId) {
      return new Promise((resolve, reject) => {
        this.$set(this.model.posters, campaignId, [])
        // this.model.posters[campaignId] = []
        this.model.originalPosterPriorities[campaignId] = []
        let counter = 0
        for (let i = 0; i < this.model.posters[''].length; i++) {
          let payload = { name: 'clinic_poster_priorities', model: JSON.parse(JSON.stringify(this.model.posters[''][i])) }
          payload.model.campaign_id = campaignId
          payload.url = this.$store.state.App.dataWarehouse + 'clinic_poster_priorities'
          this.$store.dispatch('Model/sendNewForm', {
            'source': payload
          }).then((response) => {
            response.model.priority = parseInt(response.model.priority)
            this.model.posters[campaignId].push(response.model)
            this.model.originalPosterPriorities[campaignId].push(response.model)
            this.$store.dispatch('Notify/displayMessage', { message: 'Poster Priority Cretated', position: 'top', type: 'positive' })
            counter++
            if (counter === this.model.posters[campaignId].length) resolve()
            // this.$emit('formRespondedOK')
          }).catch((response) => {
            // this.$emit('formRespondedWithErrors')
            this.$store.dispatch('Response/responseErrorManager', response)
            counter++
            if (counter === this.model.posters[campaignId].length) reject()
          })
        }
      })
    },
    updatePosterPriorities (campaignId) {
      return new Promise((resolve, reject) => {
        let counter = 0
        for (let i = 0; i < this.model.posters[campaignId].length; i++) {
          if (this.model.posters[campaignId][i].priority !== this.model.originalPosterPriorities[campaignId][i].priority) {
            let payload = { name: 'clinic_poster_priorities', model: this.model.posters[campaignId][i] }
            payload.url = this.$store.state.App.dataWarehouse + 'clinic_poster_priorities/' + payload.model.id
            this.$store.dispatch('Model/sendUpdateForm', {
              'source': payload
            }).then((response) => {
              this.model.originalPosterPriorities[campaignId][i].priority = response.model.priority
              this.$store.dispatch('Notify/displayMessage', { message: 'Poster Priority Updated', position: 'top', type: 'positive' })
              counter++
              if (counter === this.model.posters[campaignId].length) resolve()
            }).catch((response) => {
              this.$store.dispatch('Response/responseErrorManager', response)
              counter++
              if (counter === this.model.posters[campaignId].length) reject()
            })
          } else {
            counter++
            if (counter === this.model.posters[campaignId].length) resolve()
          }
        }
      })
    },
    saveDistribution () {
      this.visible = true
      let parentIndex = null
      for (let i = 0; i < this.$store.state.Model.models.clinics.items.length; i++) {
        if (this.$store.state.Model.models.clinics.items[i].id === this.clinicSelected.id) {
          parentIndex = i
          break
        }
      }
      for (let design of this.designs) {
        let model = {
          'clinic_id': this.clinicSelected.id,
          'address_id': design.address.id,
          'starts_at': design.starts_at,
          'ends_at': design.ends_at,
          'file': design.file,
          'distributions': {
            'scale': design.distributions.scale,
            'width': design.distributions.width,
            'height': design.distributions.height,
            'holders': JSON.parse(JSON.stringify(design.distributions.holders)),
            'postersScale': design.distributions.postersScale,
            'posterIds': design.distributions.posterIds
          }
        }
        for (let holder of model.distributions.holders) {
          // Find position in percentages
          holder.width = holder.originalWidth * design.distributions.scale * design.distributions.postersScale
          holder.height = holder.originalHeight * design.distributions.scale * design.distributions.postersScale

          if (holder.ext) holder.ext = holder.ext.id
          else holder.ext = ''
          if (holder.int) holder.int = holder.int.id
          else holder.int = ''
        }
        model.distributions = JSON.stringify(model.distributions)
        let payload = { name: 'poster_distributions', model: model }
        if (!design.id) {
          payload.url = this.$store.state.App.dataWarehouse + 'poster_distributions'
          this.$store.dispatch('Model/sendNewForm', {
            'source': payload
          }).then((response) => {
            this.$store.commit('Model/addRelationItems', { name: 'clinics', relation: this.name, items: response.model, 'parentIndex': parentIndex, arrayPosition: false })
            this.$set(design, 'id', response.model.id)
            this.visible = false
            this.$store.dispatch('Notify/displayMessage', { message: 'Distribution Saved', position: 'top', type: 'positive' })
          }).catch((response) => {
            this.visible = false
            this.$store.dispatch('Response/responseErrorManager', response)
          })
        } else {
          payload.url = this.$store.state.App.dataWarehouse + 'poster_distributions/' + design.id
          this.$store.dispatch('Model/sendUpdateForm', {
            'source': payload
          }).then((response) => {
            this.$store.commit('Model/updateRelationItems', { name: 'clinics', relation: this.name, item: response.model, 'parentIndex': parentIndex })
            this.visible = false
            this.$store.dispatch('Notify/displayMessage', { message: 'Distribution Updated', position: 'top', type: 'positive' })
          }).catch((response) => {
            this.visible = false
            this.$store.dispatch('Response/responseErrorManager', response)
          })
        }
      }
    },
    onResize () {
      // console.log('On Resize')
      for (let i = 0; i <= this.designs.length - 1; i++) {
        if (!this.$refs['design' + i]) continue
        if (!this.$refs['design' + i][0]) continue
        if (!this.$refs['design' + i][0].$el.clientHeight || !this.$refs['design' + i][0].$el.clientWidth) continue
        let oldScale = this.designs[i].distributions.scale
        this.designs[i].distributions.scale = this.getDesignScale(i)
        for (let holder of this.designs[i].distributions.holders) {
          holder.width = holder.originalWidth * this.designs[i].distributions.scale
          holder.height = holder.originalHeight * this.designs[i].distributions.scale
          let oldWidth = (this.$refs['design' + i][0].$el.clientWidth * oldScale) / this.designs[i].distributions.scale
          let oldHeight = (this.$refs['design' + i][0].$el.clientHeight * oldScale) / this.designs[i].distributions.scale
          // console.log(oldWidth)
          // console.log(oldHeight)
          let leftInPercentages = (holder.left * 100) / oldWidth
          holder.leftInPercentage = leftInPercentages
          let topInPercentages = (holder.top * 100) / oldHeight
          holder.topInPercentage = topInPercentages
          let newLeftInPixels = (this.$refs['design' + i][0].$el.clientWidth * leftInPercentages) / 100
          let newTopInPixels = (this.$refs['design' + i][0].$el.clientHeight * topInPercentages) / 100
          holder.left = newLeftInPixels
          holder.top = newTopInPixels
        }
        this.designs[i].width = this.$refs['design' + i][0].$el.clientWidth
        this.designs[i].height = this.$refs['design' + i][0].$el.clientHeight
      }
    },
    getDesignScale (index) {
      let scale = this.$refs['design' + index][0].$el.clientWidth / 600
      return scale
    },
    removePosterFromHolder (designIndex, holderIndex, type, posterId) {
      type === 'ext' ? this.designs[designIndex].distributions.holders[holderIndex].showing = 'int' : this.designs[designIndex].distributions.holders[holderIndex].showing = 'ext'
      this.designs[designIndex].distributions.holders[holderIndex][type] = null
      this.designs[designIndex].distributions.posterIds.splice(this.designs[designIndex].distributions.posterIds.indexOf(posterId), 1)
    },
    removeHolderFromDesign (designIndex, holderIndex) {
      this.designs[designIndex].distributions.holders.splice(holderIndex, 1)
      this.renameHolders(designIndex)
    },
    flipHolder (holder) {
      holder.showing === 'ext' ? holder.showing = 'int' : holder.showing = 'ext'
    },
    getPriority (poster) {
      let priority = poster.priority === 1 ? 1 : poster.priority === 2 ? 0.9 : poster.priority === 3 ? 0.8 : poster.priority === 4 ? 0.7 : poster.priority === 5 ? 0.6 : 0.5
      return priority
    },
    removeDesign (index = false) {
      let design = this.designs[this.confirm.index]
      if (!design.id) this.designs.splice(this.confirm.index, 1)
      else {
        // console.log('Removing Items')
        this.visible = true
        let action
        let source = {
          url: this.$store.state.App.dataWarehouse + this.name + '/' + design.id
        }
        action = this.$store.dispatch('Model/sendDestroyForm', { source: source })
        action.then(() => {
          let mutationPayload = { name: 'clinics', relation: this.name, id: design.id, parentId: this.clinicSelected.id }
          this.$store.commit('Model/removeRelationByIds', mutationPayload)
          this.$store.dispatch('Notify/displayMessage', { message: 'Poster distribution removed', position: 'top', type: 'positive' })
          this.visible = false
          this.designs.splice(this.confirm.index, 1)
          this.confirm.index = null
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          this.confirm.index = null
          this.visible = false
        })
      }
    },
    addPosterToHolder (designIndex, posterIndex, holderIndex) {
      let poster = this.clinicPosters[posterIndex]
      let holder = this.designsInRange[designIndex].distributions.holders[holderIndex]
      this.designsInRange[designIndex].distributions.posterIds.push(poster.id)
      let ext = ['Ext', 'Office']
      ext.includes(poster.clinic_poster.type) ? holder.ext = poster : holder.int = poster
      ext.includes(poster.clinic_poster.type) ? holder.showing = 'ext' : holder.showing = 'int'
      this.designTargeted = null
    },
    addPosterToDesign (designIndex, posterIndex) {
      // console.log('HERE')
      let holder = this.createDesignHolder(designIndex)
      let poster = this.clinicPosters[posterIndex]
      let name = poster.clinic_poster.poster.name
      holder.size = name
      holder.name = 'S-' + (this.designsInRange[designIndex].distributions.holders.length + 1)
      holder.width = poster.clinic_poster.poster.width / 20
      holder.originalWidth = poster.clinic_poster.poster.width / 20
      holder.height = poster.clinic_poster.poster.height / 20
      holder.originalHeight = poster.clinic_poster.poster.height / 20
      let ext = ['Ext', 'Office']
      ext.includes(poster.clinic_poster.type) ? holder.ext = poster : holder.int = poster
      ext.includes(poster.clinic_poster.type) ? holder.showing = 'ext' : holder.showing = 'int'
      if (!this.designsInRange[designIndex].distributions.posterIds) this.$set(this.designsInRange[designIndex].distributions, 'posterIds', [])
      this.designsInRange[designIndex].distributions.posterIds.push(poster.id)
      this.designsInRange[designIndex].distributions.holders.push(holder)
      this.onResize()
      this.designTargeted = null
    },
    createDesignHolder (designIndex) {
      let holder = {}
      this.$set(holder, 'name', '')
      this.$set(holder, 'size', '')
      this.$set(holder, 'top', 30)
      this.$set(holder, 'topInPercentage', 0)
      this.$set(holder, 'left', 30)
      this.$set(holder, 'leftInPercentage', 0)
      this.$set(holder, 'right', false)
      this.$set(holder, 'bottom', false)
      this.$set(holder, 'ext', null)
      this.$set(holder, 'int', null)
      this.$set(holder, 'width', 0)
      this.$set(holder, 'originalWidth', 0)
      this.$set(holder, 'height', 0)
      this.$set(holder, 'originalHeight', 0)
      this.$set(holder, 'showing', null)
      this.$set(holder, 'lastX', 0)
      this.$set(holder, 'lastY', 0)

      return holder
    },
    createDesign () {
      let design = {}
      design['clinic_id'] = null
      design['address_id'] = null
      design['address'] = null
      design['campaign_id'] = null
      design['original_facade_file_id'] = null
      design['composed_facade_file_id'] = null
      design['complete_facade_file_id'] = null
      design['starts_at'] = null
      design['ends_at'] = null
      design['file'] = null
      design['name'] = null
      design['distributions'] = {
        'scale': 1,
        'postersScale': 1,
        'width': 0,
        'height': 0,
        'holders': [],
        'posterIds': []
      }
      return design
    },
    startUploader () {
      this.$refs.uploader.pickFiles()
    },
    uploadFilesAdded (e) {
      // console.log(e)
      if (this.updatingFacade !== false) {
        this.designs[this.updatingFacade]['file'] = e[0]
        this.designs[this.updatingFacade]['name'] = e[0].name
        this.designs[this.updatingFacade]['imageData'] = URL.createObjectURL(e[0])
      } else {
        let design = this.createDesign()
        design['file'] = e[0]
        design['name'] = design['file'].name
        if (this.dateSelected) design['starts_at'] = this.dateSelected.value
        else if (this.clinicSelected.starts_at) design['starts_at'] = this.clinicSelected.starts_at
        else {
          let now = new Date(Date.now())
          let dateString = now.getFullYear() + '-' + (now.getMonth() < 10 ? '0' : '') + (Number(now.getMonth()) + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()
          design['starts_at'] = dateString
        }
        design['complete_facades'] = []
        design['complete_facades_campaigns'] = []
        design['imageData'] = URL.createObjectURL(e[0])
        this.designs.push(design)
      }
      this.$refs.uploader.reset()
      this.updatingFacade = false
    },
    uploadFile (file, updateProgress) {
      return new Promise((resolve, reject) => {
        resolve(file)
      })
    },
    // Designer Methods
    align (side) {
      let defPosition = null
      let pos = null
      for (let holder of this.holderSelected) {
        if (['left', 'top'].includes(side)) {
          if (!defPosition) defPosition = this.designs[this.designSelected].distributions.holders[holder][side]
          else if (this.designs[this.designSelected].distributions.holders[holder][side] < defPosition) {
            defPosition = this.designs[this.designSelected].distributions.holders[holder][side]
          }
        } else if (side === 'bottom') {
          // console.log(this.$refs['poster' + this.designSelected + holder][0].clientHeight)
          pos = this.designs[this.designSelected].distributions.holders[holder]['top'] + this.$refs['poster' + this.designSelected + holder][0].clientHeight
          // console.log('Pos: ' + pos)
          if (!defPosition) defPosition = pos
          else if (pos > defPosition) {
            defPosition = pos
          }
          // console.log('Def Position: ' + defPosition)
        } else if (side === 'right') {
          // console.log(this.$refs['poster' + this.designSelected + holder][0].clientHeight)
          pos = this.designs[this.designSelected].distributions.holders[holder]['left'] + this.$refs['poster' + this.designSelected + holder][0].clientWidth
          // console.log('Pos: ' + pos)
          if (!defPosition) defPosition = pos
          else if (pos > defPosition) {
            defPosition = pos
          }
          // console.log('Def Position: ' + defPosition)
        }
      }
      // console.log('Top: ' + defPosition)
      // console.log('Side: ' + side)

      for (let holder of this.holderSelected) {
        if (['left', 'top'].includes(side)) this.designs[this.designSelected].distributions.holders[holder][side] = defPosition
        else if (side === 'bottom') {
          this.designs[this.designSelected].distributions.holders[holder]['top'] = (defPosition - this.$refs['poster' + this.designSelected + holder][0].clientHeight)
        } else if (side === 'right') {
          this.designs[this.designSelected].distributions.holders[holder]['left'] = (defPosition - this.$refs['poster' + this.designSelected + holder][0].clientWidth)
        }
      }
    },
    toggleSelectDesign (designIndex) {
      // console.log('Design Selected Togle')
      this.designSelected = designIndex
    },
    unpressDesign (designIndex) {
      // console.log('Unpressed')
      this.designPressed = null
      this.holderSelected = []
    },
    unpressPoster (designIndex) {
      // console.log('Unpressed Poster')
      this.designPressed = null
    },
    resetBoardClicked () {
      this.board.clicked = false
    },
    selectElement (e, index, designIndex) {
      // console.log('selecting HOlder')
      this.board.clicked = index
      if (this.designSelected !== designIndex) this.designSelected = designIndex
      this.selectDesignPoster(index, designIndex)
    },
    selectDesignPoster (e, posterIndex, designIndex) {
      e.preventDefault()
      e.stopPropagation()
      this.designs[designIndex].distributions.holders[posterIndex].lastX = e.clientX
      this.designs[designIndex].distributions.holders[posterIndex].lastY = e.clientY
      if (this.designSelected !== designIndex) this.designSelected = designIndex
      if (this.designPressed !== designIndex) this.designPressed = designIndex
      if (this.holderSelected.length < 2) this.holderSelected = [posterIndex]
      this.$refs['poster' + designIndex + posterIndex][0].focus()
    },
    toggleSelectedHolder (e, posterIndex) {
      e.preventDefault()
      e.stopPropagation()
      this.holderSelected.includes(posterIndex) ? this.holderSelected.splice(this.holderSelected.indexOf(posterIndex), 1) : this.holderSelected.push(posterIndex)
    },
    unselectElement () {
      // console.log('Here')
      this.board.clicked = false
      this.board.selected = false
    },
    moveHolder (e, designIndex) {
      if (this.designPressed === null) return
      if (this.holderSelected.length !== 1) return
      this.designs[designIndex].distributions.holders[this.holderSelected[0]].left = this.designs[designIndex].distributions.holders[this.holderSelected[0]].left + e.clientX - this.designs[designIndex].distributions.holders[this.holderSelected[0]].lastX
      this.designs[designIndex].distributions.holders[this.holderSelected[0]].top = this.designs[designIndex].distributions.holders[this.holderSelected[0]].top + e.clientY - this.designs[designIndex].distributions.holders[this.holderSelected[0]].lastY
      this.designs[designIndex].distributions.holders[this.holderSelected[0]].lastX = e.clientX
      this.designs[designIndex].distributions.holders[this.holderSelected[0]].lastY = e.clientY
    }
    // END Designer Methods
  }
}
</script>

<style lang="stylus">
  #board {
    display: block;
    border: 1px solid grey;
  }
  .designcontainer {
    border: 2px solid $secondary;
  }
  .designcontainer > .q-img__image {
    opacity: .5;
  }
  .design-box {
    border: 3px solid $secondary
    &.targeted {
    border-color: $warning
    }
  }
  .poster {
    padding: 0 !important;
    position: absolute;
    border: 2px solid $primary;
  }
  .info {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
  }
  .holder-header {
    position: absolute;
    padding: 5px
    box-sizing: border-box;
    justify-content: center;
    background-color: $secondary;
    color: $primary;
    width: 100%;
    text-align: center;
  }
  .left-poster {
    background-color: $primary
  }
  .ghost {
    border: 1px dashed grey;
    opacity: 0.3 !important;
  }
  .selected {
    border-color: $warning;
    &:focus {
      outline: none;
    }
  }
  .selectedTest {
    border-color: $info;
  }
  .handler {
    position: absolute;
    border: 1px solid $primary;
    background: $secondary;
  }
  .handlerSelected {
    background: $primary;
  }
</style>
