<template>
  <div class="q-pa-md">
    <q-table
      title="Restoranlar"
      :columns="baseSetting.restColumns"
      :rows="restRows"
      row-key="id"
      :filter="baseSetting.filter"
      :pagination="pagination"
    >

      <template v-slot:top-right>
        <q-input outlined dense debounce="300" color="primary" v-model="baseSetting.filter"  placeholder="Restoran Arayınız..."  >
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
            <span class="text-subtitle2">#{{props.row.id}}</span>
          </q-td>
          <q-td>
            {{props.row.PlaceName}}
          </q-td>
          <q-td>
            <q-img :src="Constants.FILE_URL+'/logos/'+props.row.PlaceLogo"></q-img>
          </q-td>
          <q-td>
            {{props.row.email}}
          </q-td>
          <q-td>
            {{props.row.phone}}
          </q-td>
          <q-td>
            {{ {...this.$store.getters['CitiesModule/elById'](props.row.city_id)}.CityName }}
          </q-td>
          <q-td>
            {{ {...this.$store.getters['DistrictModule/getRecordById'](props.row.district_id)}.DistrictName }}
          </q-td>
          <q-td>
            {{ {...this.$store.getters['RestaurantTypesModule/elById'](props.row.rest_type_id)}.RestName }}
          </q-td>
          <q-td>
            {{ props.row.PlaceAddress }}
          </q-td>
          <q-td>
            {{props.row.Descriptions}}
          </q-td>
          <q-td>
            {{props.row.MembershipPackage}} Aylık
          </q-td>
          <q-td>
            <q-chip  square :color="+props.row.Status ===1 ? 'positive' :'negative'" text-color="white" :icon="+props.row.Status ===1 ?'done' : 'clear'" size="13px">
              {{ (+props.row.Status === 1) ? 'Açık' :'Kapalı' }}
            </q-chip>
          </q-td>
          <q-td>
            <q-chip  square :color="+props.row.IsArchived ===1 ? 'positive' :'negative'" text-color="white" :icon="+props.row.IsArchived ===1 ?'done' : 'clear'" size="13px">
              {{ (+props.row.IsArchived === 1) ? 'Açık' :'Kapalı' }}
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
      <q-card style="max-width: 700px">
        <q-bar class="q-pa-md bg-blue-grey-9 text-white" style="height: 50px">
          <div class="text-h4 " >Yeni Restoran Oluştur</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup @click="onReset">
            <q-tooltip>Kapat</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <div class="row">
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Restoran ismi </div>
                <q-input
                  hide-bottom-space
                  outlined
                  dense
                  v-model="formFields.PlaceName"
                  :rules="[ val => val && val.length > 0 || 'Zorunlu alan']"
                  clearable
                />
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Mekan Tipi  </div>
                <q-select
                  hide-bottom-space
                  outlined
                  dense
                  v-model="formFields.rest_type_id"
                  :options="restTypes"
                  :option-label="(items) => items.RestName"
                  :option-value="(items) => items.id"
                  :rules="[ val => val && val.RestName.length > 0 || 'Zorunlu alan']"
                  clearable
                />
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Şehir Seçin  </div>
                <q-select
                  hide-bottom-space
                  outlined
                  dense
                  v-model="formFields.city_id"
                  :options="cities"
                  :option-label="(items) => items.CityName"
                  :option-value="(items) => items"
                  emit-value
                  clearable
                />
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8"> Bölge Seçin </div>
                <q-select
                  hide-bottom-space
                  outlined
                  dense
                  v-model="formFields.district_id"
                  :options="districts"
                  :option-label="(items) => items.DistrictName"
                  :option-value="(items) => items.id"
                  :rules="[ val => val && val.DistrictName.length > 0 || 'Zorunlu alan']"
                  clearable
                />
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8"> E-posta </div>
                <q-input
                  outlined
                  dense
                  v-model="formFields.email"
                  autogrow
                  hide-bottom-space
                  placeholder="jhon@gmail.com"
                  clearable
                />
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8"> Telefon </div>
                <q-input
                  outlined
                  dense
                  v-model="formFields.phone"
                  autogrow
                  hide-bottom-space
                  placeholder="+90 (5........"
                  clearable
                />
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8"> Abonelik Paketleri </div>
                <q-select
                  hide-bottom-space
                  outlined
                  dense
                  v-model="formFields.MembershipPackage"
                  :options="baseSetting.membershipPackage"
                  :option-label="(items) => items.package"
                  :option-value="(items) => items.id"
                  clearable
                />

              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Restoran Logo  </div>
                <q-file
                  hide-bottom-space
                  outlined
                  dense
                  v-model="formFields.PlaceLogo"
                  clearable
                  label="Logo yükleyin.. "
                  accept=".jpg, .png, image/*"
                >
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop.prevent />
                  </template>
                </q-file>
              </div>
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Restoran Banner  </div>
                <q-file
                  hide-bottom-space
                  outlined
                  dense
                  v-model="formFields.Banner"
                  clearable
                  label="Banner yükleyin.. "
                  accept=".jpg, .png, image/*"
                >
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop.prevent />
                  </template>
                </q-file>
              </div>

              <div class="col-6 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">   Açık Adress  </div>
                <q-input
                  type="textarea"
                  outlined
                  dense
                  v-model="formFields.PlaceAddress"
                  autogrow
                  hide-bottom-space
                  placeholder="Açık adres ...."
                  clearable
                />
              </div>
              <div class="col-6 q-pa-xs">
                <div class="text-subtitle2 text-grey-8"> Açıklama </div>
                <q-input
                  type="textarea"
                  outlined
                  dense
                  v-model="formFields.Descriptions"
                  autogrow
                  hide-bottom-space
                  placeholder="Açıklama..."
                  clearable
                />
              </div>

            </div>
            <div class="row">
              <div class="col-4 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Mekan ismi   </div>
                <GMapAutocomplete
                  placeholder="Konum Arayınız"
                  @place_changed="setPlace"
                  class="autoCompleteInput"
                >
                </GMapAutocomplete>
              </div>
              <div class="col-4 q-pa-xs">
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
              <div class="col-2 q-pa-xs text-center">
                <div class="text-subtitle2 text-grey-8"> Arşivleme   </div>
                <q-toggle v-model="formFields.IsArchived"   color="green"/>
              </div>
              <div class="col-2 q-pa-xs text-center">
                <div class="text-subtitle2 text-grey-8">Status</div>
                <q-toggle v-model="formFields.Status"   color="green"/>
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
                      :clickable="true"
                      :draggable="true"
                      @click="center=m.position"
                      @dragend="updatedCoordinates($event.latLng)"
                    />
                  </GMapCluster>
                </GMapMap>

              </div>
            </div>
            <div class="row" >
              <div class="col-12 text-right" v-if="!formFields.id">
                <q-btn label="Sıfırla" type="reset"  color="red-10" flat class="q-ml-sm" @click="onReset" />
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
import { ref } from   "vue"
import { date } from "quasar"
import Constants from "app/Constants";

const restColumns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  { name: 'PlaceName', align: 'center', label: 'Restoran', field: 'PlaceName', sortable: true },
  { name: 'PlaceLogo', align: 'center', label: 'Logo', field: 'PlaceLogo', sortable: true },
  { name: 'email', align: 'center', label: 'E-posta', field: 'email', sortable: true },
  { name: 'phone', align: 'center', label: 'Telefon', field: 'phone', sortable: true },
  { name: 'CityName', align: 'center', label: 'Şehir Adı', field: 'CityName', sortable: true },
  { name: 'DistrictName', align: 'center', label: 'Bölge Adı', field: 'DistrictName', sortable: true },
  { name: 'RestaurantType', align: 'center', label: 'Restoran Tipi', field: 'RestaurantType', sortable: true },
  { name: 'PlaceAddress', align: 'center', label: 'Adres', field: 'PlaceAddress', sortable: true },
  { name: 'Descriptions', align: 'center', label: 'Açıklama', field: 'Descriptions', sortable: true },
  { name: 'MembershipPackage', align: 'center', label: 'Paket türü', field: 'MembershipPackage', sortable: true },
  { name: 'Status', align:'center', label: 'Statusu', field: 'Status', sortable: true },
  { name: 'IsArchived', align:'center', label: 'Arşiv durumu', field: 'IsArchived', sortable: true },
  { name: 'created_at', align:'center', label: 'Tarih', field: 'created_at' },
  { name: '', align:'center', label: 'Aksiyon', field: 'created_at' },
]
const membershipPackage = [
  { package: '3 Aylık', id: 3  },
  { package: '6 Aylık', id: 6  },
  { package: '12 Aylık', id: 12  }
]
export default {
  name: "Places",
  setup(){
    return {
      Constants,
      pagination: {
        rowsPerPage:9
      },
      baseSetting: ref({
        showFormDialog: false,
        restColumns,
        filter: '',
        membershipPackage,
        date
      }),
      formFields: ref({
        id: '',
        PlaceName: '',
        city_id: '',
        district_id: '',
        rest_type_id: '',
        Status: true,
        PlaceAddress: '',
        Positions: '',
        Banner: '',
        PlaceLogo: '',
        Descriptions : '',
        email: '',
        phone: '',
        MembershipPackage: '',
        IsArchived: false,
      }),
      center: ref({lat: 35.1937, lng: 33.357}),
      markers: ref([{
        position: {
          lat: 35.1937, lng: 33.357
        },
      }]),
      map : ref(null),
    }
  },
  methods: {
    onSubmit(){
      let formData  = new FormData()
      formData.append('PlaceName',this.formFields.PlaceName)
      formData.append('district_id',this.formFields.district_id.id)
      formData.append('city_id',this.formFields.city_id.id)
      formData.append('rest_type_id',this.formFields.rest_type_id.id)
      formData.append('Status', this.formFields.Status)
      formData.append('PlaceAddress',this.formFields.PlaceAddress)
      formData.append('Positions',JSON.stringify(this.center))
      formData.append('PlaceLogo',this.formFields.PlaceLogo)
      formData.append('Banner',this.formFields.Banner)
      formData.append('email',this.formFields.email)
      formData.append('Descriptions',this.formFields.Descriptions)
      formData.append('phone',this.formFields.phone)
      formData.append('MembershipPackage',this.formFields.MembershipPackage.id)
      formData.append('IsArchived',this.formFields.IsArchived)

      this.$store.dispatch('RestaurantsModule/create',formData).then( res => {
        if (res)
        {
          this.onReset()
          this.baseSetting.showFormDialog = false
        }
      })

    },
    onUpdate(){
      let formData = new FormData();
      formData.append('PlaceName',this.formFields.PlaceName)
      formData.append('id',this.formFields.id)
      formData.append('district_id',this.formFields.district_id.id)
      formData.append('city_id',this.formFields.city_id.id)
      formData.append('rest_type_id',this.formFields.rest_type_id.id)
      formData.append('Status', this.formFields.Status)
      formData.append('PlaceAddress',this.formFields.PlaceAddress)
      formData.append('Positions',JSON.stringify(this.center))
      formData.append('PlaceLogo',this.formFields.PlaceLogo)
      formData.append('Banner',this.formFields.Banner)
      formData.append('email',this.formFields.email)
      formData.append('Descriptions',this.formFields.Descriptions)
      formData.append('phone',this.formFields.phone)
      formData.append('MembershipPackage',this.formFields.MembershipPackage.id)
      formData.append('IsArchived',this.formFields.IsArchived)
      formData.append('_method','PUT')
      this.$store.dispatch('RestaurantsModule/update',formData).then(res => {
        if (res)
        {
            this.onReset()
            this.baseSetting.showFormDialog = false
        }
      })
    },
    onEdit(id){
      const record = this.restRows.find(e => +e.id === +id)
      const positions = JSON.parse(record.Positions)
      this.setMarker(positions.lat,positions.lng)

      this.formFields.Status =      +record.Status === 1
      this.formFields.IsArchived =  +record.IsArchived === 1
      this.formFields.id =           record.id
      this.formFields.Positions =    positions
      this.formFields.city_id =      this.$store.getters['CitiesModule/elById'](record.city_id)
      this.formFields.district_id =  this.$store.getters['DistrictModule/getRecordById'](record.district_id)
      this.formFields.Descriptions = record.Descriptions
      this.formFields.rest_type_id = this.$store.getters['RestaurantTypesModule/elById'](record.rest_type_id)
      this.formFields.PlaceName =    record.PlaceName
      this.formFields.phone =        record.phone
      this.formFields.email =        record.email
      this.formFields.MembershipPackage =   membershipPackage.find(e => +e.id === +record.MembershipPackage )
      this.formFields.PlaceLogo = record.PlaceLogo
      this.formFields.Banner = record.Banner
      this.formFields.PlaceAddress = record.PlaceAddress
      this.baseSetting.showFormDialog = true
    },
    onDelete(id){
       this.$store.dispatch('RestaurantsModule/destroy',id).then(res => {
         if(res)
         {
           console.log(res)
         }
       })
    },
    onReset(){
      this.formFields={}

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
    updatedCoordinates(event){
       this.setMarker(event.lat(),event.lng())
    }
  },
  mounted() {
    this.$store.dispatch('CitiesModule/get')
    this.$store.dispatch('DistrictModule/get')
    this.$store.dispatch('RestaurantTypesModule/get')
    this.$store.dispatch('RestaurantsModule/get')
  },
  computed: {
    cities(){
      return this.$store.getters['CitiesModule/cities']
    },
    districts(){
      return this.$store.getters['DistrictModule/getRecords']
    },
    restTypes(){
      return this.$store.getters['RestaurantTypesModule/restTypes']
    },
    restRows(){
      return this.$store.getters['RestaurantsModule/restaurants']
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
