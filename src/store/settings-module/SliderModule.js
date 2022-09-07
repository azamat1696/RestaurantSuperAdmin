import {api} from "boot/axios";
import {Notify} from "quasar";
import {ErrorHandlePrint} from "src/Utils/ErrorHandlePrint";
const prefixUrl = "sliders"

const state = {
  slider : []
}
const mutations = {
  SET_ITEM(state,item) {
    state.slider.push(item);
  },
  SET_ITEMS(state,items){
    state.slider = items
  },
  SET_REPLACE(state,item){
    state.slider.forEach(function (el,i) {
      if(el.id === item.id ){
        state.slider[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.slider.length; i++)
    {
    if (state.slider[i].id === id)
     {
      state.slider.splice(i,1)
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
     ErrorHandlePrint(er)
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
       ErrorHandlePrint(er)
     })
  },
  get({commit}) {
     api.get(prefixUrl).then(res => {
       commit('SET_ITEMS',res.data)
     }).catch(er => {
       ErrorHandlePrint(er)
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
     ErrorHandlePrint(er)
   });
  }
}
const getters = {
   sliders: (state) => {
     return state.slider
   },
  sliderById: (state) => (id) => {
    return state.slider.find(el => +el.id === +id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
