<template>
  <div class="cursor-pointer non-selectable">
    {{ menuName }}
    <q-menu :offset="[5, 7]">
      <slot name="menu-content">
        <div class="text-primary text-center">Menu Content</div>
      </slot>
    </q-menu>
  </div>
</template>

<script>
export default {
  name: 'ToolbarMenu',
  props: [ 'menuName' ],
  data () {
    return {
    }
  }
}
</script>
