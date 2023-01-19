import {api} from "boot/axios";
import {Notify} from "quasar";
import {ErrorHandlePrint} from "src/Utils/ErrorHandlePrint";
const prefixUrl = "reservations"

const state = {
  reservations : []
}
const mutations = {
  SET_ITEM(state,item) {
    state.reservations.push(item);
  },
  SET_ITEMS(state,items){
    state.reservations = items
  },
  SET_REPLACE(state,item){
    state.reservations.forEach(function (el,i) {
      if(el.id === item.id ){
        state.reservations[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.reservations.length; i++)
    {
      if (state.reservations[i].id === id)
      {
        state.reservations.splice(i,1)
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
  reservations: (state) => {
    return state.reservations
  },
  elById: (state) => (rest_id) => {
    return state.reservations.find(el => +el.id === +rest_id.restaurant_id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
