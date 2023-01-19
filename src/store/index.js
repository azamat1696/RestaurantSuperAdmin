import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import AuthModule from './auth-module/AuthModule'
import CitiesModule from "src/store/settings-module/CitiesModule";
import DistrictModule from "src/store/settings-module/DistrictModule";
import RestaurantTypesModule from "src/store/settings-module/RestaurantTypesModule";
import RestaurantsModule from "src/store/restaurants/RestaurantsModule";
import CustomersModule from "src/store/customers/CustomersModule";
import EventsModule from "src/store/events/EventsModule";
import RestUsersModule from "src/store/restaurant-users/RestUsersModule";
import SuperUserModule from "src/store/super-user/SuperUserModule";
import SliderModule from "src/store/settings-module/SliderModule";
import ReservationsModule from "src/store/reservations/ReservationsModule";
// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      AuthModule,
      CitiesModule,
      DistrictModule,
      RestaurantTypesModule,
      RestUsersModule,
      RestaurantsModule,
      CustomersModule,
      EventsModule,
      SuperUserModule,
      SliderModule,
      ReservationsModule
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
