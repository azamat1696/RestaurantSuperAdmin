import {api} from "boot/axios";
import {Loading, Notify} from "quasar";
import {ErrorHandlePrint} from "src/Utils/ErrorHandlePrint";
const prefixUrl = "super-users";

const state = {
  superUser : []
}
const mutations = {
  SET_ITEM(state,item) {
    state.superUser.push(item);
  },
  SET_ITEMS(state,items){
    state.superUser = items
  },
  SET_REPLACE(state,item){
    state.superUser.forEach(function (el,i) {
      if(el.id === item.id ){
        state.superUser[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.superUser.length; i++)
    {
      if (state.superUser[i].id === id)
      {
        state.superUser.splice(i,1)
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
  superUser: (state) => {
    return state.superUser
  },
  elById: (state) => (id) => {
    return state.superUser.find(el => +el.id === +id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
