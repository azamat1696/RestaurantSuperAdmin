<template>
  <div class="q-pa-md">
    <q-table
      title="Etkinlikler"
      :columns="baseSetting.eventColumns"
      :rows="events"
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
            #{{props.row.id}}
          </q-td>
          <q-td>
            {{ props.row.EventName }}
          </q-td>
          <q-td>
            {{ {...this.$store.getters['RestaurantsModule/elById'](props.row.restaurant_id)}.PlaceName }}
          </q-td>
          <q-td>
            {{ props.row.EventDescription.substring(1,30)+" .... " }}
          </q-td>
          <q-td>
            <q-chip  square :color="+props.row.Status ===1 ? 'positive' :'negative'" text-color="white" :icon="+props.row.Status ===1 ?'done' : 'clear'" size="13px">
              {{ (+props.row.Status === 1) ? 'Açık' :'Kapalı' }}
            </q-chip>
          </q-td>
          <q-td class="text-center">
            {{ props.row.StartDateTime }}
          </q-td>
          <q-td class="text-center">
            {{ props.row.EndDateTime }}
          </q-td>
          <q-td>
            {{ baseSetting.date.formatDate(props.row.created_at,'YYYY-MM-DD H:m') }}
          </q-td>
          <q-td class="text-center">
            <q-btn flat round color="blue-grey-9"  @click="addCustomer(props.row.id)" > <q-icon name="group_add" /> </q-btn>
            <q-btn flat round color="blue-grey-9"  @click="onEdit(props.row.id)" ><i class="fas fa-edit"></i></q-btn>
            <q-btn flat round color="primary"  @click="onDelete(props.row.id)" ><i class="fas fa-trash-alt"></i></q-btn>
          </q-td>
        </q-tr>

      </template>

    </q-table>

    <q-dialog   v-model="baseSetting.showFormDialog" persistent  style="z-index: 999!important;">
      <q-card style="max-width: 700px">
        <q-bar class="q-pa-md bg-blue-grey-9 text-white" style="height: 50px">
          <div class="text-h4 " >Yeni Etkinlik Oluştur</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
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

      <div class="col-6 q-pa-xs">
        <div class="text-subtitle2 text-grey-8">  Etkinlik Başlığı  </div>
        <q-input
          hide-bottom-space
          outlined
          dense
          v-model="formFields.EventName"
          :rules="[ val => val && val.length > 0 || 'Zorunlu alan']"
          autogrow
        />
      </div>
      <div class="col-6 q-pa-xs">
        <div class="text-subtitle2 text-grey-8"> Mekan seçiniz </div>
        <q-select
          outlined
          dense
          v-model="formFields.restaurant_id"
          :options="restaurants"
          :option-label="items => items.PlaceName"
          :option-value="items => items.id"
        />
      </div>

      <div class="col-6 q-pa-xs">
        <div class="text-subtitle2 text-grey-8">Açıklma </div>
        <q-input
          type="textarea"
          outlined
          dense
          autogrow
          v-model="formFields.EventDescription"
          placeholder="Açıklama..."
          hide-bottom-space
        />
      </div>

      <div class="col-6 q-pa-xs">
        <div class="text-subtitle2 text-grey-8"> Banner  </div>
        <q-file
          outlined
          dense
          v-model="formFields.Banner"
          label="Banner Yükleyin.."
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
        </q-file>
      </div>

      <div class="col-4 q-pa-xs text-center">
        <div class="text-subtitle2 text-grey-8">Başlama Tarihi ve Saati</div>

        <q-input  outlined dense v-model="formFields.StartDateTime">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="formFields.StartDateTime" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="formFields.StartDateTime" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-4 q-pa-xs text-center">
        <div class="text-subtitle2 text-grey-8">Bitiş Tarihi ve Saati</div>

        <q-input outlined dense v-model="formFields.EndDateTime">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="formFields.EndDateTime" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="formFields.EndDateTime" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-4 q-pa-xs text-center">
        <div class="text-subtitle2 text-grey-8">Status</div>
        <q-toggle v-model="formFields.Status"   color="green"/>
      </div>
    </div>
    <div class="row" >
      <div class="col-12 text-right" v-if="!formFields.id">
        <q-btn label="Temizle" type="reset" color="red-10"   icon="restart_alt" class="q-mr-sm"  @click="onReset" />
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
    <q-dialog   v-model="baseSetting.showCustomerDialog" persistent  style="z-index: 999!important;">
      <q-card style="max-width: 700px;min-width: 600px">
        <q-bar class="q-pa-md bg-blue-grey-9 text-white" style="height: 50px">
          <div class="text-h4 " >Etkinlğe Müşteri ekle </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Kapat</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form
            @submit="onCustomerSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <div class="row">
              <div class="col-12 q-pa-xs">
                <div class="text-subtitle2 text-grey-8"> Müşteriler seçiniz </div>
                <q-select
                  v-model="modelCustomers"
                  :options="customerOptions"
                  outlined
                  dense
                  :option-label="(item) => item !== null ?  item.name+' '+item.surname : '' "
                   option-value="id"
                  emit-value
                  map-options
                  hide-bottom-space
                  multiple
                  use-chips

                  use-input
                  @filter="filterFn"
                  menu-anchor="bottom start"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

              </div>
            </div>
            <div class="row" >
              <div class="col-12 text-right">
                <q-btn label="Kaydet" type="submit" color="blue-grey-8"  icon-right="save"   />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import {  computed, ref } from   "vue"
import { date } from "quasar"
import {useStore} from "vuex";

const eventColumns = [
  { name: 'id', align:'center', label: '', field: 'id' },
  { name: 'EventName', align: 'center', label: 'Etkinlik', field: 'EventName', sortable: true },
  { name: 'restaurant_id', align: 'center', label: 'Mekan Adı', field: 'restaurant_id', sortable: true },
  { name: 'EventDescription', align: 'center', label: 'Açıklama', field: 'EventDescription', sortable: true },
  { name: 'Status', align:'center', label: 'Statusu', field: 'Status', sortable: true },
  { name: 'StartDateTime', align:'center', label: 'Başlama Tarihi', field: 'StartDateTime', sortable: true },
  { name: 'EndDateTime', align:'center', label: 'Bitiş Tarihi', field: 'EndDateTime', sortable: true },
  { name: 'created_at', align:'center', label: 'Tarih', field: 'created_at' },
  { name: '', align:'center', label: 'Aksiyon', field: 'created_at' },
]

export default {
  name: "Events",
  setup(){
    const store = useStore();

    const customers  = computed( () => {
       return JSON.parse(JSON.stringify(store.getters['CustomersModule/customers']))
    });

    const customerOptions = ref(customers.value)
    return {
      pagination: {
        rowsPerPage:9
      },
      baseSetting: ref({
        showFormDialog: false,
        showCustomerDialog: false,
        eventColumns,
        date
      }),
      formFields: ref({
        id: '',
        EventName: '',
        EventDescription: '',
        restaurant_id: '',
        Status: true,
        Banner: '',
        StartDateTime: '',
        EndDateTime : '',
        customer_id: ''
      }),
      modelCustomers: ref([]),
      customerOptions,


       filterFn (val,update,abort){
        update(() => {
          const needle = val.toLowerCase()
          customerOptions.value =  customers.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
      }
    }
  },
  methods: {
    onSubmit(){
      let formData = new  FormData()
      formData.append('EventName',this.formFields.EventName)
      formData.append('EventDescription',this.formFields.EventDescription)
      formData.append('restaurant_id',this.formFields.restaurant_id.id)
      formData.append('Status',this.formFields.Status)
      formData.append('Banner',this.formFields.Banner)
      formData.append('customer_id',JSON.stringify(this.modelCustomers))
      formData.append('StartDateTime',this.formFields.StartDateTime)
      formData.append('EndDateTime',this.formFields.EndDateTime)
      this.$store.dispatch('EventsModule/create',formData).then( res => {
        if(res)
        {
          this.onReset();
          this.baseSetting.showFormDialog = false
        }
      })
    },
    onUpdate(){
      let formData = new FormData();
      formData.append('EventName',this.formFields.EventName)
      formData.append('id',this.formFields.id)
      formData.append('EventDescription',this.formFields.EventDescription)
      formData.append('restaurant_id',this.formFields.restaurant_id.id)
      formData.append('Status',this.formFields.Status)
      formData.append('Banner',this.formFields.Banner)
      formData.append('StartDateTime',this.formFields.StartDateTime)
      formData.append('EndDateTime',this.formFields.EndDateTime)
      formData.append('customer_id',JSON.stringify(this.modelCustomers))
      formData.append('_method','PUT')
      this.$store.dispatch('EventsModule/update',formData).then(res => {
        if (res)
        {
          this.onReset()
          this.baseSetting.showFormDialog = false
        }
      })
    },
    onEdit(id){
      const record = this.events.find(e => +e.id === +id)
      this.formFields.restaurant_id = this.$store.getters['RestaurantsModule/elById'](record.restaurant_id)
      this.formFields.EventName = record.EventName
      this.formFields.StartDateTime = record.StartDateTime
      this.formFields.EndDateTime = record.EndDateTime
      this.formFields.EventDescription = record.EventDescription
      this.formFields.Banner = record.Banner
      this.formFields.Status = +record.Status ===1
      this.formFields.id = record.id
      this.baseSetting.showFormDialog = true
    },
    onDelete(id){
      this.$store.dispatch('EventsModule/destroy',id).then(res => {
        if(res)
        {
          console.log(res)
        }
      })
    },
    onReset(){
     this.formFields = { }
    },
    addCustomer(eventId){
      this.modelCustomers = []
      this.formFields.id = +eventId
      // this.modelCustomers =  JSON.parse(JSON.stringify(this.$store.getters['EventsModule/registeredCustomersById'](eventId))).map( el => +el.customer_id)
      this.modelCustomers =  this.$store.getters['EventsModule/registeredCustomersById'](eventId)
      this.baseSetting.showCustomerDialog = true
     },
    onCustomerSubmit(){
      console.log(this.modelCustomers)
       let formData = new FormData()
      formData.append('event_id',this.formFields.id)
      formData.append('customer_id',JSON.stringify(this.modelCustomers))
      this.$store.dispatch('EventsModule/createEventCustomer',formData).then( res => {
        if (res){
          this.modelCustomers = []
          this.baseSetting.showCustomerDialog = false
        }
      })

    }
  },
 async mounted() {
   await  this.$store.dispatch('RestaurantsModule/get')
   await  this.$store.dispatch('EventsModule/get')
   await   this.$store.dispatch('EventsModule/getEventCustomer')
  await  this.$store.dispatch('CustomersModule/get')
  },
  computed : {
    restaurants(){
      return this.$store.getters['RestaurantsModule/restaurants']
    },
    events(){
      return this.$store.getters['EventsModule/events']
    },
    registeredCustomers(){
      return this.$store.getters['EventsModule/registeredCustomers']
    }
  }
}
</script>

<style scoped>

</style>
