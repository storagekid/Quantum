<template>
  <q-item-section side>
    <div class="row items-center">
      <template v-if="icons[0]">
        <q-icon :name="icons[0]" size="xs"></q-icon>
      </template>
      <template v-if="icons[1]">
        <q-icon :name="icons[1]" size="xs"></q-icon>
      </template>
      <div class="text-bold" style="font-size: 1.2em; padding-left: 3Opx" v-if="keys">{{ keys }}</div>
    </div>
  </q-item-section>
</template>

<script>
export default {
  name: 'ToolbarMenuShorcut',
  props: ['keys', 'icons'],
  data () {
    return {}
  }
}
</script>
