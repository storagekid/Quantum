<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-none">
    <div class="row justify-between bg-primary q-pa-xs text-white">
      <div class="text-subtitle2 q-pl-sm">{{ panelName || 'Side Panel Name' }}</div>
      <q-btn
        color="white"
        size="sm"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </div>
  </q-card-section>
    <q-slide-transition>
      <div v-show="expanded" class="q-pa-sm">
        <slot name="panel-content">
          <div class="text-primary text-center">Empty Panel Content</div>
        </slot>
      </div>
    </q-slide-transition>
    <div class="disable-state" @click="showDisableState" v-if="panelDisabled"></div>
  </q-card>
</template>

<script>
export default {
  name: 'SidePanel',
  props: [ 'panelName', 'panelDisabled' ],
  data () {
    return {
      expanded: true
    }
  },
  watch: {
    panelDisabled () {
      if (this.panelDisabled) this.expanded = false
    }
  },
  methods: {
    showDisableState () {
      // console.log('Disable frame clicked')
      return true
    }
  },
  mounted () {
    if (this.panelDisabled) this.expanded = false
  }
}
</script>
<style lang="stylus">
  .disable-state {
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    float: left;
    left: 0;
    background-color: rgba(0,0,0,.3);
  }
</style>
