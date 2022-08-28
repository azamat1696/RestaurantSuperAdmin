import {api} from 'boot/axios';
import {Notify} from "quasar";

const prefixUrl = 'districts';
const state = {
   districts : []
}

const mutations = {
  SET_ITEM(state,item){
   state.districts.push(item)
 },
  SET_ITEMS(state,items) {
    state.districts = items
  },
  SET_REPLACE(state,item){
    state.districts.forEach(function (el,i) {
      if(el.id === item.id ){
        state.districts[i] = item;
      }
    })

  },
  SET_REMOVE(state,id){
    for (let i=0; i < state.districts.length; i++)
    {
      if (state.districts[i].id === id)
      {
        state.districts.splice(i,1)
        break;
      }
    }
  }
}

const actions = {
create({commit},payload){
  return api.post(prefixUrl,payload).then(res => {
    commit('SET_ITEM',res.data)
    Notify.create({
      position:"top-right",
      type: 'positive',
      message: 'Kayıt Başarılı'
    });
    return true
  })
},
  async get({commit}){
    return   await  api.get(prefixUrl).then(res => {

      commit('SET_ITEMS',res.data)
    }).catch(er =>{
      console.log("Hata District model  >>>>", er)
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
  destroy({commit},id){
    api.delete(prefixUrl + "/" + id).then(res => {
      commit('SET_REMOVE',id);
      return true
    }).catch(er => {
      console.log(er)
    });
  }
}

const getters = {
  getRecords : (state) => {
    return state.districts
  },
  getRecordsById : (state) => (id) => {
     return state.districts.filter( e =>  +e.city_id ===  +id )
  },
  getRecordById : (state) => (id) => {
    return state.districts.find( e =>  +e.id ===  +id )
  },


}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
