<template>
  <div class="q-pa-md">
    <q-table
      title="Bölgeler"
      :columns="baseSetting.districtColumns"
      row-key="id"
      :rows="districts"
      :filter="baseSetting.filter"
      :pagination="pagination"
    >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" color="primary" v-model="baseSetting.filter"  placeholder="Bölge Arayınız..."  >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="primary"
          label="Yeni Kayıt "
          icon="add"
          class="q-mr-xs q-ml-xs q-pa-sm q-pr-md"
          @click=" baseSetting.showFormDialog = true"
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
            #{{props.row.id}}
          </q-td>
          <q-td>
            {{ {...this.$store.getters['CitiesModule/elById'](props.row.city_id)}.CityName }}
          </q-td>
          <q-td>
            {{ props.row.DistrictName }}
          </q-td>
          <q-td>
            <q-chip  square :color="+props.row.Status ===1 ? 'positive' :'negative'" text-color="white" :icon="+props.row.Status ===1 ?'done' : 'clear'" size="13px">
              {{ (+props.row.Status === 1) ? 'Açık' :'Kapalı' }}
            </q-chip>
          </q-td>
          <q-td>
            {{ baseSetting.date.formatDate(props.row.created_at,'YYYY-MM-DD') }}
          </q-td>
          <q-td class="text-right">
            <q-btn flat round color="blue-grey-9"  @click="onEdit(props.row.id)" ><i class="fas fa-edit"></i></q-btn>

            <q-btn flat round color="primary"  @click="onDelete(props.row.id)" ><i class="fas fa-trash-alt"></i></q-btn>
          </q-td>
        </q-tr>

      </template>

    </q-table>




    <q-dialog   v-model="baseSetting.showFormDialog" persistent  style="z-index: 999!important;">
      <q-card style="min-width: 700px">
        <q-bar class="q-pa-md" style="height: 50px">

          <div class="text-h4" >Yeni Şehir Oluştur</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Kapat</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >

            <div class="row">
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8"> Şehir Seçiniz </div>
                <q-select
                  v-model="formFields.city_id"
                  :options="cities"
                  :option-label="(items) => items.CityName"
                  :option-value="(items) => items.id"
                  :lazy-rules="true"
                  :rules="[ val => val && val.CityName.length > 0 || 'Zorunlu alan']"
                  outlined
                  dense
                  hide-bottom-space
                />
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Bölge Adı </div>
                <GMapAutocomplete
                  placeholder="Konum Arayınız"
                  @place_changed="setPlace"
                  class="autoCompleteInput"
                >
                </GMapAutocomplete>
              </div>

              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Bölge Statusu</div>
                <q-toggle v-model="formFields.Status" label="Model Statusu" color="green"/>
              </div>
            </div>
            <div class="row q-mt-xs">
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
                <q-btn label="Sıfırla" type="reset" color="primary" flat class="q-ml-sm" />
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
import { ref } from "vue"
import { date } from "quasar"
const districtColumns = [
  { name: 'id', align:'center', label: '', field: 'id' },
  { name: 'CityName', align: 'center', label: 'Şehir Adı', field: 'CityName', sortable: true },
  { name: 'DistrictName', align: 'center', label: 'Bölge Adı', field: 'DistrictName', sortable: true },
  { name: 'Status', align:'center', label: 'Statusu', field: 'Status', sortable: true },
  { name: 'created_at', align:'center', label: 'Tarih', field: 'created_at' },
  { name: '', align:'center', label: 'Aksiyon', field: 'created_at' },

];
export default {
  name: "Districts",
  setup(){

    return {
      pagination: {
        rowsPerPage:9
      },
      center: ref({lat: 35.1937, lng: 33.357}),
      markers: ref([{
        position: {
          lat: 35.1937, lng: 33.357
        },
      }]),
      map : ref(null),
      baseSetting : ref({
        showFormDialog: ref(false),
        date,
        districtColumns,
        filter : ref(''),
      }),
      formFields : ref({
        Status:true,
        DistrictName: '',
        Positions: '',
        city_id: '',
        id: ''
      }),
    }
  },
  methods: {
    onSubmit: function () {
      let formData = new FormData();
      formData.append('DistrictName', document.getElementsByClassName('pac-target-input')[0].value);
      formData.append('Status', this.formFields.Status);
      formData.append('city_id', this.formFields.city_id.id);
      formData.append('Positions', JSON.stringify(this.center));
      this.$store.dispatch('DistrictModule/create', formData).then(res => {
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
      this.formFields.DistrictName='';
      this.formFields.Positions='';
      this.formFields.id='';
      this.formFields.city_id='';
    },
    onEdit(id) {
      const record = this.districts.find(e => +e.id === +id)
      this.formFields.Status = +record.Status === 1
      this.formFields.id = record.id
      this.formFields.DistrictName = record.DistrictName
      this.formFields.city_id = this.$store.getters['CitiesModule/elById'](+record.city_id)

      // Set Maps Options
      const positions = JSON.parse(record.Positions)
      this.setMarker(positions.lat,positions.lng)
      this.markers = [ { position: positions } ]
      this.baseSetting.showFormDialog = true
      setTimeout(() =>{
        this.formFields.Positions = JSON.parse(record.Positions)
        document.getElementsByClassName('pac-target-input')[0].value = record.DistrictName
      },800)
    },
    onUpdate(){
      let formData = new FormData();
      formData.append('DistrictName', document.getElementsByClassName('pac-target-input')[0].value);
      formData.append('Status',this.formFields.Status);
      formData.append('id',this.formFields.id);
      formData.append('city_id',this.formFields.city_id.id);
      formData.append('Positions',JSON.stringify(this.center));
      formData.append('_method','PUT')
      this.$store.dispatch('DistrictModule/update',formData).then(res => {
        if (res){
          this.onReset()
          this.baseSetting.showFormDialog = false
        }
      })
    },
    onDelete(id){
      this.$store.dispatch('DistrictModule/destroy',id).then( (res) => {
        if (res){
          this.onReset()
        }
      })
    }
  },
  computed: {
    cities(){
      return this.$store.getters['CitiesModule/cities']
    },
    districts(){
      return this.$store.getters['DistrictModule/getRecords']
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
