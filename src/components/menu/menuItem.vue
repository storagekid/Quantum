<template>
  <q-expansion-item
    :icon="item.icon"
    :label="item.name"
    expand-separator
    :group="item.name"
    v-if="item.children.length"
    :key="item.id"
    :value="value"
    >
    <menu-item
      v-for="child in item.children"
      :item="child"
      :key="child.id"
      v-on:children="checkChildren"
      :parentGroups="groups"
      :menuName="menuName"
      :currentRoute="currentRoute"
      v-on:routeChanged="spreadWord"
      >
    </menu-item>
  </q-expansion-item>
  <q-item
    dense
    clickable
    v-ripple
    :class="{'bg-warning': (groups.includes('administrator') || !groups.length) && menuName !== 'admin-menu'}"
    :to="{name: item.to}"
    :exact="true"
    :key="item.id"
    @click="spreadWord(item.name)"
    v-else>
    <q-item-section avatar>
    <q-avatar :icon="item.icon" font-size=".5em" rounded></q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label style="font-weight: bold">
        {{$t('menus.main.' +item.name +'.title')}}
      </q-item-label>
    </q-item-section>
    <q-item-section side v-if="(home !== item.name) && currentRoute === item.name">
      <q-avatar icon="home" font-size=".4em" rounded @click.stop="setHomePage(item.name)"></q-avatar>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'menuItem',
  props: ['item', 'parentGroups', 'menuName', 'currentRoute'],
  data () {
    return {
      children: [],
      value: false
    }
  },
  watch: {
    expanded () {
      this.value = this.expanded
    }
  },
  computed: {
    expanded () {
      // console.log(this.$router.currentRoute.name)
      // console.log(this.childrenNames)
      return this.childrenNames.includes(this.currentRoute)
    },
    childrenNames () {
      let names = []
      if (this.item.children.length) {
        for (let child of this.item.children) {
          names.push(child.name)
        }
      }
      if (names.length) this.$emit('children', names)
      return [...names, ...this.children]
    },
    groups () {
      let groups = []
      if (this.item.groups.length) {
        for (let group of this.item.groups) groups.push(group.name)
      }
      return [...groups, ...this.parentGroups]
    },
    home () {
      return this.$store.state.App.settings.home
    }
  },
  methods: {
    spreadWord (name) {
      this.$emit('routeChanged', name)
    },
    setHomePage (name) {
      console.log('Button hitted')
      this.$store.commit('App/setSetting', { name: 'home', value: name })
    },
    checkChildren (e) {
      // console.log(e)
      this.children = e
    }
  },
  mounted () {
    this.value = this.expanded
  }
}
</script>

<style>
</style>
