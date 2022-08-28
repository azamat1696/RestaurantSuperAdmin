<template>
  <div class="row q-pb-none q-pt-md" style="justify-content: center">
    <PageCard  v-for="(card,index) in MainPageCardsJs" :key="index" :detail="card"/>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import PageCard from "components/PageCard.vue";
const MainPageCardsJs = [

  {
    id :1,
    title : "Genel Ayarlar",
    route : 'cities',
    iconPath :  'https://img.icons8.com/clouds/344/settings.png'
  },
  {
    id :2,
    title : "Yerler / Etkinlikler",
    route : 'Restaurants',
    iconPath :  'https://img.icons8.com/clouds/344/overtime.png'
  },

];
export default defineComponent({
  name: 'IndexPage',
  components: {
    PageCard
  },
  setup(){
    return {
      MainPageCardsJs
    }
  }
})
</script>
