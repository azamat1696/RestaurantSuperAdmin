import { api } from 'boot/axios'
import { Notify } from "quasar";
import {ErrorHandlePrint} from "src/Utils/ErrorHandlePrint";
const state = {
  userDetail : {},
  panelAuthToken : ''
}
const mutations = {
 setToken(state,token){
  this.state.panelAuthToken = token
},
  setUserDetail(state,user){
    state.userDetail = user
  },
  clearToken(state){
    state.panelAuthToken=''
    state.userDetail = {}
  }

}

const actions = {
   login({commit,dispatch},payload){
   return api.post('/user/login',payload).then( res => {
     api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
     commit('setToken',res.data.token)
     commit('setUserDetail',res.data.userDetail)
     // Local Storage
     localStorage.setItem('panelAuthToken',res.data.token)
     localStorage.setItem('userDetail',JSON.stringify(res.data.userDetail))
     localStorage.setItem('loginUserEmail',res.data.userDetail.email)
     Notify.create({
       color: 'positive',
       position: 'top-right',
       progress: true,
       timeout: 1000,
       message: 'Giriş Başarılı',
       icon: 'done'
     })
     this.$router.push('/').catch(er => {
       console.log("Error on login",er)
     })
   }).catch( er => {
     Notify.create({
       color : 'negative',
       position : 'center',
       progress : true,
       timeout : 1500,
       message : 'Sistem Hatası : '+er.message,
       icon : 'done'
     })
     ErrorHandlePrint(er)
   }).finally(fi => {
     console.log("Finally----")
   })
 },
   logout({commit}){
    commit('clearToken')
     localStorage.removeItem('panelAuthToken')
     localStorage.removeItem('userDetail')
     localStorage.removeItem('loginUserEmail')
     this.$router.replace('/auth/login').catch( er => {
       console.log(er)
     })
   },
  initAuth({commit,dispach}){
  let token = localStorage.getItem('panelAuthToken');
  if(token)
  {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token
    commit('setToken',token);
    this.$router.go(1)
    commit('setUserDetail',JSON.parse(localStorage.getItem('userDetail')))
  }
  else {
    this.$router.push('/auth/login').catch((er) => {
      console.log(er)});
    return false
  }
  },
  register({commit},payload){
     return api.post('/user/register',payload).then( res => {
       api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
       commit('setToken',res.data.token)
       commit('setUserDetail',res.data.userDetail)
       // Local Storage
       localStorage.setItem('panelAuthToken',res.data.token)
       localStorage.setItem('userDetail',JSON.stringify(res.data.userDetail))
       localStorage.setItem('loginUserEmail',res.data.userDetail.email)
       Notify.create({
         color: 'positive',
         position: 'top-right',
         progress: true,
         timeout: 1000,
         message: 'Giriş Başarılı',
         icon: 'done'
       })
       this.$router.push('/').catch(er => {
         console.log("Error on login",er)
       })
     }).catch( er => {
       Notify.create({
         color : 'negative',
         position : 'center',
         progress : true,
         timeout : 1500,
         message : 'Sistem Hatası : '+er.message,
         icon : 'done'
       })
       ErrorHandlePrint(er)
     }).finally(fi => {
       console.log("Finally----")
     })
  },
  forgotPassword({commit},payload){
     return api.post('forgot-password',payload).then(res => {
        return true
     }).catch(er => {
       Notify.create({
         type:'negative',
         message: er.message,
         position:'bottom-right',
         progress:true
       })
     })
  }
}
const getters = {
userDetailGetter : (state) => {
  return state.userDetail
}
}
export default {
  namespaced : true,
  state,
  mutations,
  actions,
  getters
}
