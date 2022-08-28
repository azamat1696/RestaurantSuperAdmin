<template>
  <q-layout view="lHh Lpr lFf">
    <LayoutHeader />
    <q-page-container>
      <div class="row q-pa-sm ">
        <div class="col-2">
          <q-list bordered class=" q-card rounded-borders text-dark bg-white q-ma-md" style="max-width: 300px">
            <q-item
              clickable
              v-ripple
              v-for="(menu,index) in menuList"
              :key="index"
              class="  text-left q-ma-xs "
              style="border-bottom: 1px solid #ddd"
              active-class="activeMenu"
              :to="{ name : menu.name}"
            >
              <q-item-section class="text-uppercase">{{menu.label}}</q-item-section>
              <q-item-section avatar>
                <q-icon  name="arrow_forward" />
              </q-item-section>
            </q-item>

          </q-list>
        </div>
        <div class="col-10">
          <q-page >
            <router-view   />
          </q-page>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import LayoutHeader from "components/LayoutHeader.vue";
const menuList = [
  {
    id:1,
    icon: 'update',
    label: 'Restoranlar',
    separator: true,
    name:'Restaurants'
  },
  {
    id:2,
    icon: 'update',
    label: 'Etkinlikler',
    separator: true,
    name:'events'
  },
  {
    id:3,
    icon: 'update',
    label: 'Restoran Kullanıcılar',
    separator: true,
    name:'RestaurantUsers'
  },
  {
    id:4,
    icon: 'update',
    label: 'Müşteriler',
    separator: true,
    name:'Customers'
  },
  {
    id:5,
    icon: 'update',
    label: 'Super Kullanıcı',
    separator: true,
    name:'SuperUser'
  },
]
export default {
  name: "EventAndPlaces",
  components: {
    LayoutHeader
  },
  setup(){
    return {
      menuList
    }
  },
  mounted() {
    this.$store.dispatch('RestaurantTypesModule/get')
    this.$store.dispatch('CitiesModule/get')
    this.$store.dispatch('DistrictModule/get')
  }
}
</script>

<style scoped lang="scss">
.activeMenu {
  background-color: rgba(148, 178, 193, 0.39);
  border-right: 3px solid #455a64 ;
  /*color: white;*/
}


</style>

