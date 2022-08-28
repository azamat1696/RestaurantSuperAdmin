import {api} from "boot/axios";
import {Loading, Notify} from "quasar";
import {ErrorHandlePrint} from "src/Utils/ErrorHandlePrint";
const prefixUrl = "customers";

const state = {
  customers : []
}
const mutations = {
  SET_ITEM(state,item) {
    state.customers.push(item);
  },
  SET_ITEMS(state,items){
    state.customers = items
  },
  SET_REPLACE(state,item){
    state.customers.forEach(function (el,i) {
      if(el.id === item.id ){
        state.customers[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.customers.length; i++)
    {
      if (state.customers[i].id === id)
      {
        state.customers.splice(i,1)
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
    Loading.show()
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
    }).finally(()=> Loading.hide() )
  },
 async get({commit}) {
  await  api.get(prefixUrl).then(res => {
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
  customers: (state) => {
    return state.customers
  },

  elById: (state) => (id) => {
    return state.customers.find(el => +el.id === +id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
