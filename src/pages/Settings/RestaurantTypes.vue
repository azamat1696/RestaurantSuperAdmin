<template>
  <div class="q-pa-md">
    <q-table
      title="Restoran Tipleri"
      :rows="RestaurantTypes"
      :columns="baseSetting.columns"
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
            {{ props.row.RestName }}
          </q-td>
          <q-td>
            <q-img :src="Constants.FILE_URL+'/restTypeBanners/'+props.row.Banner" height="60px" width="100px"> </q-img>
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
      <q-card style="min-width: 500px">
        <q-bar class="q-pa-md bg-blue-grey-9 text-white" style="height: 50px">
          <div class="text-h4" v-if="!formFields.id">Yeni Restorant Tipi Oluştur</div>
          <div class="text-h4" v-else>Araç Sınıf Güncelle</div>
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
              <div class="col-12 q-pa-xs">
                <div class="text-subtitle2 text-grey-8">  Restoran Tipi Adı </div>
                <q-input
                  outlined
                  dense
                  v-model="formFields.RestName"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Zorunlu alan']"
                />
              </div>
              <div class="col-12 q-pa-xs">
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
              <div class="col-12 q-pa-xs">
                <q-toggle v-model="formFields.Status" label="Statusu" color="green"/>
              </div>
            </div>

            <div class="text-right" v-if="!formFields.id">

              <q-btn label="Sıfırla" type="reset" color="primary" flat class="q-ml-sm" @click="onReset" />
              <q-btn label="Kaydet" type="submit" color="positive"  icon-right="save"  flat/>
            </div>
            <div class="text-right" v-else>
              <q-btn label="Güncelle" type="button" color="blue"  icon-right="save"  flat @click="onUpdate"/>
            </div>
          </q-form>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { date } from "quasar";
import Constants from "app/Constants";

const columns = [
  { name: 'id', align:'center', label: '', field: 'id' },
  { name: 'RestName', align: 'center', label: 'Restoran Tipi', field: 'RestName', sortable: true },
  { name: 'Banner', align: 'center', label: 'Banner', field: 'Banner', sortable: true },
  { name: 'Status', align:'center', label: 'Statusu', field: 'Status', sortable: true },
  { name: 'created_at', align:'center', label: 'Tarih', field: 'created_at' },
  { name: '', align:'center', label: 'Aksiyon', field: 'created_at' },

];
export default {
  name: "RestaurantTypes",
  setup(){
    return {
      pagination: {
        rowsPerPage:9
      },
      Constants,
      baseSetting: ref({
        showFormDialog: false,
        filter: '',
        date,
        columns
      }),
      formFields: ref({
         id: '',
         RestName: '',
         Banner: '',
         Status: true
      })
      }
    },
  methods: {
    onSubmit(){
      let formData = new FormData()
      formData.append('RestName',this.formFields.RestName)
      formData.append('Banner',this.formFields.Banner)
      formData.append('Status',this.formFields.Status)
      this.$store.dispatch('RestaurantTypesModule/create',formData).then( res => {
        if(res)
        {
          this.onReset()
          this.baseSetting.showFormDialog = false
        }
      })
    },
    onReset(){
     this.formFields.RestName = ''
     this.formFields.Banner = ''
      this.formFields.id = ''
    },
    onUpdate(){
      let formData = new FormData()
      formData.append('RestName',this.formFields.RestName)
      formData.append('Banner',this.formFields.Banner)
      formData.append('Status',this.formFields.Status)
      formData.append('id',this.formFields.id)
      formData.append('_method','PUT')
      this.$store.dispatch('RestaurantTypesModule/update',formData).then( res => {
        if(res)
        {
          this.onReset()
          this.baseSetting.showFormDialog = false
        }
      })
    },
    onEdit(id){
      const item = this.RestaurantTypes.find( e => +e.id === +id)
      this.formFields.RestName = item.RestName
      this.formFields.id = +item.id
      this.formFields.Status = +item.Status === 1
      this.baseSetting.showFormDialog = true
    },
    onDelete(id){
      this.$store.dispatch('RestaurantTypesModule/destroy',id).then( res => {
        if (res){
          console.log(res)
        }
      })
    }
  },
  computed: {
    RestaurantTypes(){
      return this.$store.getters['RestaurantTypesModule/restTypes']
    }
  }

}
</script>

<style scoped>

</style>
