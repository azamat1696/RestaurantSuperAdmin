<template>
  <div class="q-pa-md">
    <q-table
      title="Rezervasyonlar"
      :columns="baseSetting.eventColumns"
      :rows="reservations"
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
            #{{props.row.reservation_id}}
          </q-td>
          <q-td>
            {{ props.row.customer }}
          </q-td>
          <q-td>
            {{ props.row.email }}
          </q-td>
          <q-td>
            {{ props.row.phone }}
          </q-td>
          <q-td>
            {{ props.row.EventName }}
          </q-td>
          <q-td>
            {{ props.row.EventDescription.substring(1,30) }}
          </q-td>

          <q-td class="text-center">
            {{ props.row.EventDescription.substring(1,30) }}
          </q-td>
<!--          <q-td>-->
<!--            <q-chip  square :color="+props.row.Status ===1 ? 'positive' :'negative'" text-color="white" :icon="+props.row.Status ===1 ?'done' : 'clear'" size="13px">-->
<!--              {{ (+props.row.Status === 1) ? 'Açık' :'Kapalı' }}-->
<!--            </q-chip>-->
<!--          </q-td>-->
          <!--          <q-td class="text-center">-->
          <!--            {{ props.row.EndDateTime }}-->
          <!--          </q-td>-->
          <!--          <q-td>-->
          <!--            {{ baseSetting.date.formatDate(props.row.created_at,'YYYY-MM-DD H:m:s') }}-->
          <!--          </q-td>-->
          <!--          <q-td :class="+props.row.restaurant_id === +restaurant.restaurant_id ? ' text-center' : ' disabled text-center'" >-->
          <!--            <q-btn flat round color="blue-grey-9"    @click="addCustomer(props.row.id)" > <q-icon name="group_add" /> </q-btn>-->
          <!--            <q-btn flat round color="blue-grey-9"  @click="onEdit(props.row.id)" ><i class="fas fa-edit"></i></q-btn>-->
          <!--            <q-btn flat round color="primary"  @click="onDelete(props.row.id)" ><i class="fas fa-trash-alt"></i></q-btn>-->
          <!--          </q-td>-->
        </q-tr>

      </template>

    </q-table>

  </div>
</template>

<script>
import {  computed, ref } from   "vue"
import { date } from "quasar"
import Echo from 'laravel-echo'
import Pusher  from "pusher-js";
window.Pusher = Pusher

const eventColumns = [
  { name: 'id', align:'center', label: 'ID', field: 'id' },
  { name: 'customer', align: 'center', label: 'Müşteri Ad & Soyad', field: 'customer', sortable: true },
  { name: 'email', align: 'center', label: 'E-posta', field: 'email', sortable: true },
  { name: 'phone', align: 'center', label: 'Telefon', field: 'phone', sortable: true },
  { name: 'EventName', align: 'center', label: 'Etkinlik Adı', field: 'EventName', sortable: true },
  { name: 'EventDescription', align: 'center', label: 'Açıklama', field: 'EventDescription', sortable: true },
  { name: 'guestCustomer', align: 'center', label: 'Kişi sayısı', field: 'guestCustomer', sortable: true },
  // { name: 'Status', align: 'center', label: 'Durumu', field: 'Status', sortable: true },

]

export default {
  name: "Reservations",
  setup() {

    return {
      pagination: {
        rowsPerPage: 9
      },
      restaurant: JSON.parse(localStorage.getItem('restUserDetail')),
      baseSetting: ref({
        showFormDialog: false,
        showCustomerDialog: false,
        eventColumns,
        date
      }),

    }
  },
  methods: {
    // listen() {
    //   window.Echo.channel('channel').listen('ReservationsEvent', payload => {
    //     console.log('Here')
    //     console.log(payload)
    //   })
    // }
  },
  mounted() {
   // this.$store.dispatch('ReservationsModule/get')
   //  window.Echo.channel('channel')
   //    .listen('ReservationsEvent',(e) => {
   //      console.log(e)
   //    })
   //  this.listen()

    // window.Echo = new Echo({
    //   broadcaster: 'pusher',
    //   key: 'local',
    //   cluster: 'mt1',
    //   wsHost: 'localhost',
    //   wsPort: 6001,
    //   forceTLS: true,
    //   disableStats: true
    // })
    // window.Echo.channel('channel').listen('ReservationsEvent', (e) => {
    //   console.log(e.message)
    // })
  },
  computed: {
    reservations(){
      return this.$store.getters['ReservationsModule/reservations']
    }
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
}
</style>
