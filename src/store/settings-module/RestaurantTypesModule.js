import {api} from "boot/axios";
import {Notify} from "quasar";
const prefixUrl = "restaurant-types"

const state = {
  restTypes : []
}
const mutations = {
  SET_ITEM(state,item) {
    state.restTypes.push(item);
  },
  SET_ITEMS(state,items){
    state.restTypes = items
  },
  SET_REPLACE(state,item){
    state.restTypes.forEach(function (el,i) {
      if(el.id === item.id ){
        state.restTypes[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.restTypes.length; i++)
    {
      if (state.restTypes[i].id === id)
      {
        state.restTypes.splice(i,1)
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
  restTypes: (state) => {
    return state.restTypes
  },
  elById: (state) => (id) => {
    return state.restTypes.find(el => +el.id === +id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
