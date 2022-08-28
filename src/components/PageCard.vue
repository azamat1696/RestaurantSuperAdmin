<template>
  <q-card class="col-md-2 col-sm-3 col-xs-5 q-ma-xs" >
    <q-img :src="detail.iconPath"  />
    <q-card-section>
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis text-blue-grey-8 text-weight-600 text-uppercase">
          <div class=" text-subtitle1 text-bold" >
            {{detail.title}}
          </div>
          <router-link :to="{name: detail.route} "  >
            <q-btn
              fab
              icon="add"
              class="absolute"
              style="top: 0; right: 7px; background-color: #F44336 !important; color: #ffffff "
            />
          </router-link>

        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

<script>
export default {
  name: "PageCard",
  props: ['detail']
}
</script>

<style scoped>

</style>
