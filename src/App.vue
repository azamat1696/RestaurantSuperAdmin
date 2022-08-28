<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  beforeCreate() {
    this.$store.dispatch('AuthModule/initAuth')
  }
})
</script>
<style>
.q-header, .q-footer {
  z-index: 998 !important;
}
</style>
