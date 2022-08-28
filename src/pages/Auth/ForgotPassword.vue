<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">

          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
               Şifre Al
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
             @submit="onSubmitLogin"
            >
              <q-input
                type="email"
                filled
                v-model="email"
                label="E-posta"
                lazy-rules
              />
              <div class="flex justify-between">
                <q-btn label="Giriş Sayfası"   color="primary" :to="{name: 'login'}" />
                <q-btn label="Şifre Al"    color="primary" type="submit" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import {Notify} from "quasar";
export default {
  name: "Login",
  setup() {
    return {
      email: ref('azamat@gmail.com'),
    }
  },
  methods: {
    onSubmitLogin(){
      let formData = new FormData()
      formData.append('email',this.email)
      this.$store.dispatch('AuthModule/forgotPassword',formData).then( res => {
         if (res){
           Notify.create({
             type:'positive',
             position:'top-right',
             message: 'Şifreniz başarıyla yenilenmiştir. Lütfen E-postanızı kontrol ediniz'
           })
           this.$router.push({name: 'login'})
         }
      })
    }
  }
}
</script>

<style scoped>
.bg-image {
  background-image: linear-gradient(135deg, #471699 0%, #04313E 100%);
}
</style>
