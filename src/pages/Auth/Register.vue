<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">

          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
               Kayıt ol
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
             @submit="onSubmitLogin"
            >
              <q-input
                type="text"
                filled
                v-model="name"
                label="İsim"
                lazy-rules
              />
              <q-input
                type="email"
                filled
                v-model="email"
                label="E-posta"
                lazy-rules
              />

              <q-input
                :type="isPwd ? 'password' : 'text'"
                filled
                v-model="password"
                label="Şifre"
                lazy-rules
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="flex justify-between">
                <q-btn label="Giriş Sayfası"   color="primary" :to="{name: 'login'}" />

                <q-btn label="Kayıt ol"  type="submit"   color="primary"  />
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
export default {
  name: "Login",
  setup() {
    return {
      isPwd: ref(true),
      email: ref(''),
      name: ref(''),
      password: ref('')
    }
  },
  methods: {
    onSubmitLogin(){
      let formData = new FormData()
      formData.append('name',this.name)
      formData.append('email',this.email)
      formData.append('password',this.password)
      this.$store.dispatch('AuthModule/register',formData).then( res => {
        console.log(res)
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
