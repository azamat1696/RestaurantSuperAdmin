<template>
  <div class="q-pa-md">
    <q-table
      title="Super Kullanıcılar"
      :columns="baseSetting.userColumns"
      :rows="superUsers"
      row-key="id"
      :filter="baseSetting.filter"
      :pagination="pagination"
    >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" color="primary" v-model="baseSetting.filter"  placeholder="Kullanıcılar Arayınız..."  >
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
            {{ props.row.name }}
          </q-td>
          <q-td>
            {{ props.row.email }}
          </q-td>
          <q-td>
            {{ baseSetting.date.formatDate(props.row.created_at,'YYYY-MM-DD') }}
          </q-td>
          <q-td >
            <q-btn flat round color="blue-grey-9"  @click="onEdit(props.row.id)" ><i class="fas fa-edit"></i></q-btn>

            <q-btn flat round color="primary"  @click="onDelete(props.row.id)" ><i class="fas fa-trash-alt"></i></q-btn>
          </q-td>
        </q-tr>

      </template>

    </q-table>

    <q-dialog   v-model="baseSetting.showFormDialog" persistent  style="z-index: 999!important;">
      <q-card style="max-width: 700px">
        <q-bar class="q-pa-md bg-blue-grey-9 text-white" style="height: 50px">
          <div class="text-h4 " v-if="!formFields.id" >Yeni Kullanıcı Oluştur</div>
          <div class="text-h4 " v-else >  Kullanıcı Düzenle </div>
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

       <div class="col-6 q-pa-xs">
         <div class="text-subtitle2 text-grey-8">  İsim  </div>
         <q-input
           hide-bottom-space
           outlined
           dense
           v-model="formFields.name"
           :rules="[ val => val && val.length > 0 || 'Zorunlu alan']"
           placeholder="Jhon"
         />
       </div>

       <div class="col-6 q-pa-xs">
         <div class="text-subtitle2 text-grey-8">  E-posta </div>
         <q-input
           outlined
           dense
           v-model="formFields.email"
           placeholder="example@gmail.com"
           hide-bottom-space
           clearable
         />
       </div>
       <div class="col-6 q-pa-xs">
         <div class="text-subtitle2 text-grey-8">   Şifre  </div>
         <q-input
           outlined
           dense
           v-model="formFields.password"
           hide-bottom-space
           clearable
         />
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
import {date} from "quasar"

const userColumns = [
  { name: 'id', align:'center', label: '', field: 'id' },
  { name: 'name', align: 'center', label: 'İsim', field: 'name', sortable: true },
  { name: 'email', align:'center', label: 'E-posta', field: 'email', sortable: true },
  { name: 'created_at', align:'center', label: 'Tarih', field: 'created_at' },
  { name: '', align:'center', label: 'Aksiyon', field: 'created_at' },
]
export default {
  name: "Superuser",
  setup(){
    return {
      pagination: {
        rowsPerPage:9
      },
      baseSetting: ref({
        showFormDialog: false,
        userColumns,
        date
      }),
      formFields: ref({
        id: '',
        name: '',
        email: '',
        password: ''
      }),
    }
  },
  methods: {
    onSubmit(){
     let formData = new FormData()
      formData.append('name',this.formFields.name)
      formData.append('email',this.formFields.email)
      formData.append('password',this.formFields.password)
      this.$store.dispatch('SuperUserModule/create',formData).then(res => {
        if(res)
        {
           this.onReset()
          this.baseSetting.showFormDialog = false
        }
      })
    },
    onUpdate(){
      let formData = new FormData()
      formData.append('id',this.formFields.id)
      formData.append('name',this.formFields.name)
      formData.append('email',this.formFields.email)
      formData.append('password',this.formFields.password)
      formData.append('_method','PUT')
      this.$store.dispatch('SuperUserModule/update',formData).then(res => {
        if(res)
        {
          this.onReset()
          this.baseSetting.showFormDialog = false
        }
      })
    },
    onEdit(id){
    const record = this.superUsers.find(el => +el.id === +id)
      this.formFields.id = record.id
      this.formFields.name = record.name
      this.formFields.email = record.email
      this.baseSetting.showFormDialog = true
    },
    onDelete(id){
     this.$store.dispatch('SuperUserModule/destroy',id)
      this.onReset()
    },
    onReset(){
      this.formFields = {}
    }
  },
  mounted() {
    this.$store.dispatch('SuperUserModule/get')
  },
  computed: {
    superUsers(){

      return this.$store.getters['SuperUserModule/superUser']
    }
  }
}
</script>

<style scoped>

</style>

