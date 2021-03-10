<template>
    <td style="background-color: #ffffff;">
        <img :src="src" :width="data.styles.width" height="" :alt="data.styles['image-alt']" :title="data.styles['image-title']" border="0" style="width: 100%; max-width: 600px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555; margin: auto; display: block;" class="g-img">
    </td>
</template>

<script>
export default {
  name: 'hero-row',
  props: [ 'data' ],
  data () {
    return {}
  },
  computed: {
    src () {
      return this.data.styles['image-source'] === 'local' ? this.data.styles['local-url'] : this.data.styles['remote-url']
    }
  }
}
</script>
