import {api} from "boot/axios";
import {Notify} from "quasar";
import {ErrorHandlePrint} from "src/Utils/ErrorHandlePrint";
const prefixUrl = "events"

const state = {
  events : [],
  selectedCustomers: []
}
const mutations = {
  SET_ITEM(state,item) {
    state.events.push(item);
  },
  SET_ITEMS(state,items){
    state.events = items
  },
  SET_REPLACE(state,item){
    state.events.forEach(function (el,i) {
      if(el.id === item.id ){
        state.events[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.events.length; i++)
    {
      if (state.events[i].id === id)
      {
        state.events.splice(i,1)
        break;
      }
    }
  },
  SET_SELECTED_CUSTOMERS(state,item)
  {
    state.selectedCustomers = item
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
  },
  createEventCustomer({commit},payload){
    return api.post(prefixUrl+'/customer-registration',payload).then( res => {
       commit('SET_SELECTED_CUSTOMERS',res.data)
      return true
    }).catch(er => {
      ErrorHandlePrint(er)
    })
  },
  getEventCustomer({commit}){
    api.get('customer-registrations').then(res => {
      commit('SET_SELECTED_CUSTOMERS',res.data)
    }).catch(er => {
       ErrorHandlePrint(er)
    })
  }
}
const getters = {
  events: (state) => {
    return state.events
  },
  elById: (state) => (id) => {
    return state.events.find(el => +el.id === +id)
  },
  registeredCustomers: (state) => {
    return state.selectedCustomers
  },
  registeredCustomersById: (state) => (eventId) => {
    return state.selectedCustomers.filter( el => +el.id === +eventId  ).map( el => +el.customer_id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
