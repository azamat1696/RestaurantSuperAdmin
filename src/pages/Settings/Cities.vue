<template>
<div class="q-pa-md">
 <q-table
  title="Şehirler"
  :rows="cities"
  row-key="id"
  :columns="columns"
  :filter="baseSetting.filter"
  :pagination="pagination"
 >
   <template v-slot:top-right>
     <q-input outlined dense debounce="300" v-model="baseSetting.filter" color="primary" placeholder="Şehir Arayınız...">
       <template v-slot:append>
         <q-icon name="search" />
       </template>
     </q-input>
     <q-btn
       color="primary"
       label="Yeni Kayıt "
       icon="add"
       class="q-mr-xs q-ml-xs q-pa-sm q-pr-md"
       @click="baseSetting.showFormDialog = true"
       ref="showFormDialog"
       id="showFormDialog"
     />
     <q-btn
       color="blue-grey-8"
       icon="archive"
       label="Excel Oluştur"
       class="q-pa-sm "
       disable
     />
   </template>
   <template v-slot:body="props">
     <q-tr :props="props" :key="props.row.index" class="text-center">
       <q-td>
         #{{ props.row.id }}
       </q-td>
       <q-td>
         {{ props.row.CityName }}
       </q-td>
       <q-td>
         <q-chip  square :color="+props.row.Status ===1 ? 'positive' :'negative'" text-color="white" :icon="+props.row.Status ===1 ?'done' : 'clear'" size="13px">
           {{ (+props.row.Status === 1) ? 'Açık' :'Kapalı' }}
         </q-chip>
       </q-td>
       <q-td>
         {{  date.formatDate(props.row.created_at,'YYYY-MM-DD') }}
       </q-td>
   <q-td  >

     <q-btn flat round color="blue-grey-9"  @click="onEdit(props.row.id)" ><i class="fas fa-edit"></i></q-btn>

     <q-btn flat round color="primary" @click="onDelete(props.row.id)" ><i class="fas fa-trash-alt"></i></q-btn>
   </q-td>
     </q-tr>
   </template>
 </q-table>
  <q-dialog   v-model="baseSetting.showFormDialog" persistent  style="z-index: 999!important;">
    <q-card style="min-width: 700px">
      <q-bar class="q-pa-md" style="height: 50px">

        <div class="text-h4" >Yeni Şehir Oluştur</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="onReset">
          <q-tooltip>Kapat</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >

          <div class="row">

            <div class="col-6 q-pa-xs">
              <div class="text-subtitle2 text-grey-8">  Şehir Adı </div>
              <GMapAutocomplete
                placeholder="Konum Arayınız"
                @place_changed="setPlace"
                class="autoCompleteInput"
              >
              </GMapAutocomplete>
            </div>

            <div class="col-6 q-pa-xs">
              <div class="text-subtitle2 text-grey-8">  Şehir Statusu</div>
              <q-toggle v-model="formFields.Status" label="Şehir Statusu" color="green"/>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="text-subtitle2 text-grey-8">  Harita Konumu </div>
              <q-input
                outlined
                dense
                :model-value="center.lat.toFixed(4) + ' - ' + center.lng.toFixed(4)"
                hide-bottom-space
                readonly
                for="latLng"

              />
            </div>
          </div>
          <div class="row">
            <div class="col-12"  >
              <GMapMap
                :center="center"
                :zoom="9"
                map-type-id="terrain"
                style="width: 100%;height: 300px!important;"
                :disableDefaultUI="true"
              >
                <GMapCluster>
                  <GMapMarker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="false"
                    :draggable="false"
                    @click="center=m.position"
                  />
                </GMapCluster>
              </GMapMap>

            </div>
          </div>

          <div class="row">
            <div class="col-12 text-right" v-if="!formFields.id">
              <q-btn label="Sıfırla" type="reset" color="primary" flat class="q-ml-sm" @click="onReset" />
              <q-btn label="Kaydet" type="submit" color="blue-grey-8"  icon-right="save"   />
            </div>
            <div class="col-12 text-right" v-else>
              <q-btn label="Güncelle" type="button" color="blue-grey-8"  icon-right="restart_alt" @click="onUpdate"  />
            </div>
          </div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</div>
</template>

<script>
import { ref } from  "vue"
import {date, Notify} from "quasar"
const columns = [
  { name: 'id', align:'center', label: '', field: 'id' },
  { name: 'CityName', align: 'center', label: 'Şehir', field: 'CityName', sortable: true },
  { name: 'Status', align:'center', label: 'Statusu', field: 'Status', sortable: true },
  { name: 'created_at', align:'center', label: 'Tarih', field: 'created_at' },
  { name: '', align:'center', label: 'Aksiyon', field: 'created_at' },

];
export default {
  name: "Cities",
  setup(){
    return {
      date,
      pagination: {
        rowsPerPage:9
      },
      columns,
      center: ref({lat: 35.1937, lng: 33.357}),
      markers: ref([{
        position: {
          lat: 35.1937, lng: 33.357
        },
      }]),
      map : ref(null),
      baseSetting : ref({
        showFormDialog: ref(false),
        filter : ref(''),
      }),
      formFields : ref({
        Status:ref(true),
        CityName: ref(''),
        Positions: ref(''),
        id: ref('')
      }),
    }
  },
  methods: {
    onSubmit: function () {
      let formData = new FormData();
      formData.append('CityName', document.getElementsByClassName('pac-target-input')[0].value);
      formData.append('Status', this.formFields.Status);
      formData.append('Positions', JSON.stringify(this.center));
      this.$store.dispatch('CitiesModule/create', formData).then(res => {
          if (res){
            this.onReset()
            this.baseSetting.showFormDialog = false
          }
      })
    },
    setPlace(e) {
      this.setMarker(e.geometry.location.lat(), e.geometry.location.lng())
    },
    setMarker(lat,lng) {
      this.center = {lat:lat, lng: lng}
      this.markers = [
        {
          position: {
            lat: lat, lng: lng
          },
        }
      ]
    },
    onReset() {
      this.formFields.CityName='';
      this.formFields.Positions='';
      this.formFields.id='';
      this.formFields.Status=true;
    },
    onEdit(id) {
      const record = this.cities.find(e => +e.id === +id)
      const positions = JSON.parse(record.Positions)
      this.formFields.Status = +record.Status === 1
      this.formFields.id = record.id
      this.formFields.Positions = positions
      this.formFields.CityName = record.CityName
      // Set Maps Options

      this.baseSetting.showFormDialog = true
      setTimeout(() =>{
        this.setMarker(positions.lat,positions.lng)
        document.getElementsByClassName('pac-target-input')[0].value = record.CityName
      },800)
    },
    onUpdate(){
      let formData = new FormData();
      formData.append('CityName', document.getElementsByClassName('pac-target-input')[0].value);
      formData.append('Status',this.formFields.Status);
      formData.append('id',this.formFields.id);
      formData.append('Positions',JSON.stringify(this.center));
      formData.append('_method','PUT')
      this.$store.dispatch('CitiesModule/update',formData).then(res => {
       if (res){
         this.onReset()
         this.baseSetting.showFormDialog = false
       }
      })
    },
    onDelete(id){
       this.$store.dispatch('CitiesModule/destroy',id).then( res => {
            if (res) {
              Notify.create({
                position: 'top-right',
                type: 'positive',
                message: "İşlem Başarılı"
              })
            }
       })
    }
  },
  computed: {
    cities(){
      return this.$store.getters['CitiesModule/cities']
    }
  }
}
</script>

<style scoped>
.vue-map-container {
  height: 300px!important;
}
.pac-container.pac-logo {
  display: block!important;
  z-index: 100000!important;
}
.autoCompleteInput {
  padding: 8px;
  border: 1px solid #b1b1b1;
  border-radius: 4px;
  width: 100%;
}

</style>
