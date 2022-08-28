<template>
  <q-layout view="lHh Lpr lFf">
   <LayoutHeader />
    <q-page-container>
  <router-view />
</q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import LayoutHeader from "components/LayoutHeader.vue";

export default defineComponent({
  name: 'AppLayout',
  components: {
    LayoutHeader
  },
  mounted() {
    this.$store.dispatch('AuthModule/initAuth')
  }
})
</script>
