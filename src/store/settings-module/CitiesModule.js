import {api} from "boot/axios";
import {Notify} from "quasar";
const prefixUrl = "cities"

const state = {
  cities : []
}
const mutations = {
  SET_ITEM(state,item) {
    state.cities.push(item);
  },
  SET_ITEMS(state,items){
    state.cities = items
  },
  SET_REPLACE(state,item){
    state.cities.forEach(function (el,i) {
      if(el.id === item.id ){
        state.cities[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.cities.length; i++)
    {
    if (state.cities[i].id === id)
     {
      state.cities.splice(i,1)
      break;
     }
    }
  }
}
const actions = {
 create({commit},payload){
   return  api.post(prefixUrl,payload).then(res => {
     commit('SET_ITEM', res.data);
     Notify.create({
       position:"top-right",
       type: 'positive',
       message: 'Kayıt Başarılı'
     });
     return true
   }).catch( er => {
     console.log(er.response);
   })
 },
  update({commit},payload){

     return api.post(prefixUrl+"/"+payload.get('id'),payload).then(res => {
       commit('SET_REPLACE',res.data);
       Notify.create({
         position: 'top-right',
         type: 'positive',
         message:'Kayıt Başarıyla Güncellendi'
       });
       return true
     }).catch(er => {
       console.log(er);
     })
  },
  get({commit}) {
     api.get(prefixUrl).then(res => {
       commit('SET_ITEMS',res.data)
     }).catch(er => {
       console.log("Hata Country Model >>>>>>>>>",er)
     })
  },
  destroy({commit},id){

   api.delete(prefixUrl + "/" + id).then(res => {
     commit('SET_REMOVE',id);
     Notify.create({
       position: 'top-right',
       type:'positive',
       message: 'Kayıt Başarıyla Silindi'
     });
   }).catch(er => {
     console.log(er)
   });
  }
}
const getters = {
   cities: (state) => {
     return state.cities
   },
  elById: (state) => (id) => {
    return state.cities.find(el => +el.id === +id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
