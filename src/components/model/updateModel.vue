<template>
  <q-card :id="'update-' + modelName" class="bg-white relative-position">
    <q-card-section class="text-subtitle1 text-center bg-primary text-white q-py-xs">
      Update Model <span class="text-bold">{{ model.label }}</span>
    </q-card-section>
    <q-card-section>
      <update-model-tabs
        mode="update"
        :batchMode="batchMode"
        :modelName="modelName"
        :source="model"
        :quasarData="quasarData"
        v-on:formSent="changeStatus"
        v-on:formResponded="closeModal"
        v-on:relationFormResponded="$q.loading.hide()"
        v-on:loading="visible = true"
        v-on:loaded="visible = false"
      >
      </update-model-tabs>
      <!-- <generic-data-loading v-else></generic-data-loading> -->
    </q-card-section>
    <!-- <multi-upload-bars
      v-if="multiUpload.show"
      :opened="multiUpload.show"
      :items="multiUpload.items"
      >
    </multi-upload-bars> -->
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
import UpdateModelTabs from '../model/updateModelTabs'
// import { ModelsFetcher } from '../../mixins/modelMixin'

export default {
  name: 'UpdateModel',
  components: { UpdateModelTabs },
  props: ['modelName', 'model', 'batchMode', 'modelsNeeded', 'quasarData'],
  // mixins: [ModelsFetcher],
  data () {
    return {
      visible: false
      // multiUpload: {
      //   show: false,
      //   items: []
      // }
    }
  },
  methods: {
    // showMultiUpload (payload) {
    //   this.multiUpload.show = true
    //   for (let item of payload.items) {
    //     this.$set(item, 'state', 'waiting')
    //   }
    //   payload.items[0].state = 'uploading'
    //   this.multiUpload.items = payload.items
    // },
    // multiUploadFileSuccess (payload) {
    //   this.multiUpload.items[payload.index].state = 'success'
    //   if (payload.index < this.multiUpload.items.length - 1) {
    //     this.multiUpload.items[payload.index + 1].state = 'uploading'
    //   }
    // },
    // multiUploadFileFailed (payload) {
    //   this.multiUpload.items[payload.index].done = 'failed'
    //   if (payload.index < this.multiUpload.items.length - 1) {
    //     this.multiUpload.items[payload.index + 1].state = 'uploading'
    //   }
    // },
    // clearMultiUpload () {
    //   this.multiUpload.show = false
    //   this.multiUpload.items = []
    // },
    changeStatus () {
      this.$q.loading.show()
      // this.visible = true
    },
    closeModal () {
      // this.visible = false
      this.$q.loading.hide()
      this.$emit('modelUpdated')
    }
  }
}
</script>

<style>
</style>
