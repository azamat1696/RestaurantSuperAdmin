import { boot } from 'quasar/wrappers'
import VueGoogleMaps from '@fawmi/vue-google-maps'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { app, } ) => {
  // something to do
  app.use(VueGoogleMaps,{
    load: {
      key: 'AIzaSyAPN4OzkHNIs7dcf94xIqfqVNHWWut05dA',
      libraries: "places"
    },
    autobindAllEvents: true,
  })
})
