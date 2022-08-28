<template>
  <div class="q-pa-md">
    <q-table
      title="Slider"
      :columns="baseSetting.sliderColumns"
      :rows="slider"
      row-key="id"
      :filter="baseSetting.filter"
      :pagination="pagination"
    >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" color="primary" v-model="baseSetting.filter"  placeholder="  Arayınız..."  >
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
            {{ props.row.SliderName }}
          </q-td>
          <q-td>
            <q-img :src="Constants.FILE_URL+'/sliders/'+props.row.SliderImage" height="60px" width="60px"></q-img>
          </q-td>
          <q-td>
            <q-chip  square :color="+props.row.Status ===1 ? 'positive' :'negative'" text-color="white" :icon="+props.row.Status ===1 ?'done' : 'clear'" size="13px">
              {{ (+props.row.Status === 1) ? 'Açık' :'Kapalı' }}
            </q-chip>
          </q-td>

          <q-td>
            {{ baseSetting.date.formatDate(props.row.created_at,'YYYY-MM-DD H:m') }}
          </q-td>
          <q-td class="text-center">
            <q-btn flat round color="blue-grey-9"  @click="onEdit(props.row.id)" ><i class="fas fa-edit"></i></q-btn>
            <q-btn flat round color="primary"  @click="onDelete(props.row.id)" ><i class="fas fa-trash-alt"></i></q-btn>
          </q-td>
        </q-tr>

      </template>

    </q-table>

    <q-dialog   v-model="baseSetting.showFormDialog" persistent  style="z-index: 999!important;">
      <q-card style="max-width: 700px">
        <q-bar class="q-pa-md bg-blue-grey-9 text-white" style="height: 50px">
          <div class="text-h4 " >Yeni Slider Oluştur</div>
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

      <div class="col-12 q-pa-xs">
        <div class="text-subtitle2 text-grey-8">  Slider Başlığı  </div>
        <q-input
          hide-bottom-space
          outlined
          dense
          v-model="formFields.SliderName"
          :rules="[ val => val && val.length > 0 || 'Zorunlu alan']"
          autogrow
        />
      </div>


      <div class="col-12 q-pa-xs">
        <div class="text-subtitle2 text-grey-8"> Slider   </div>
        <q-file
          outlined
          dense
          v-model="formFields.SliderImage"
          label="Slider Yükleyin.."
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
        </q-file>
      </div>

      <div class="col-6 q-pa-xs text-center">
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


  </div>
</template>

<script>
import { ref } from   "vue"
import { date } from "quasar"
import Constants from "app/Constants";

const sliderColumns = [
  { name: 'id', align:'center', label: '', field: 'id' },
  { name: 'SliderName', align: 'center', label: 'Başlığı', field: 'SliderName', sortable: true },
  { name: 'SliderImage', align: 'center', label: 'Slider', field: 'SliderImage', sortable: true },
  { name: 'Status', align: 'center', label: 'Status', field: 'Status', sortable: true },
  { name: 'created_at', align: 'center', label: 'Tarih', field: 'created_at', sortable: true },
  { name: '', align:'center', label: 'Aksiyon', field: 'created_at' },
]

export default {
  name: "Slider",
  setup(){

    return {
      pagination: {
        rowsPerPage:9
      },
      baseSetting: ref({
        showFormDialog: false,
        sliderColumns,
        date
      }),
      Constants,
      formFields: ref({
        id: '',
        SliderName: '',
        SliderImage: '',
        Status: ''
      }),

    }
  },
  methods: {
    onSubmit(){
      let formData = new  FormData()
      formData.append('SliderName',this.formFields.SliderName)
      formData.append('SliderImage',this.formFields.SliderImage)
      formData.append('Status',this.formFields.Status)
      this.$store.dispatch('SliderModule/create',formData).then( res => {
        if(res)
        {
          this.baseSetting.showFormDialog = false
          this.onReset();
        }
      })
    },
    onUpdate(){
      let formData = new FormData();
      formData.append('id',this.formFields.id)
      formData.append('SliderName',this.formFields.SliderName)
      formData.append('SliderImage',this.formFields.SliderImage)
      formData.append('Status',this.formFields.Status)
      formData.append('_method','PUT')
      this.$store.dispatch('SliderModule/update',formData).then(res => {
        if (res)
        {
          this.baseSetting.showFormDialog = false
          this.onReset()

        }
      })
    },
    onEdit(id){
      const record = this.slider.find(e => +e.id === +id)
      this.formFields.id = record.id
      this.formFields.SliderName = record.SliderName
      this.formFields.SliderImage = record.SliderImage
      this.formFields.Status = record.Status === 1
      this.baseSetting.showFormDialog = true
    },
    onDelete(id){
      this.$store.dispatch('SliderModule/destroy',id).then(res => {
        if(res)
        {
          console.log(res)
        }
      })
    },
    onReset(){
     this.formFields = { }
    },

  },
  mounted() {
   this.$store.dispatch('SliderModule/get')
  },
  computed : {
    slider(){
      return this.$store.getters['SliderModule/sliders']
    }
  }
}
</script>

<style scoped>

</style>
