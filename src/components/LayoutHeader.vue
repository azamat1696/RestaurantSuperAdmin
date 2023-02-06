<template>

  <q-header elevated>
    <q-toolbar>
      <div class="q-pa-xs">
        <q-img @click="this.$router.push('/')"  src="./../../public/icons/dark_logo.png"  width="40px"   style="color: #fff  ;object-fit: cover"/>
      </div>
      <q-toolbar-title>
        Super Admin
      </q-toolbar-title>
      <q-space/>
      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
               @click="$q.fullscreen.toggle()"
               v-if="$q.screen.gt.sm">
        </q-btn>
        <q-btn round dense flat color="white" icon="notifications">
          <q-badge color="red" text-color="white" floating>
            5
          </q-badge>
          <q-menu
          >
            <q-list style="min-width: 100px">
              <messages></messages>
              <q-card class="text-center no-shadow no-border">
                <q-btn label="View All" style="max-width: 120px !important;" flat dense
                       class="text-indigo-8"></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn round flat>
          <q-avatar size="26px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            <q-menu
            >
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <div class="text-subtitle1">{{ userDetail.name }}</div>
                  <q-btn label="Çıkış yap" no-caps @click="this.$store.dispatch('AuthModule/logout')" style="max-width: 120px !important;" flat dense
                         class="text-indigo-8"></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-avatar>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>

</template>

<script>

export default {
  name: "LayoutHeader",
  setup() {

    return {

    }
  },
  computed :{
    userDetail(){
      return this.$store.getters['AuthModule/userDetailGetter']
    }
  }
}
</script>

<style scoped>

</style>
