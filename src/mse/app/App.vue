<template>
  <div id="app">
    <img src="../../assets/logo.png">
        <h1>1页面</h1>
        <button @click="btnClick2">点我请求数据拼多多</button>
        <ul v-for="(item,index) in pinDuoList">
            <li>{{item.goods_name}}</li>
        </ul>
    <router-view/>
  </div>
</template>

<script>
import {requestpingDuo,requesttaobao} from '../../api/main'
export default {
  name: 'App',
  data(){
      return {
          pinDuoList:[]
      }
  },
  methods:{
    btnClick2(){
        let params={
            opt_type:1,
            offset:0,
            size:50
        }
        requestpingDuo(params).then(res=>{
            if(res){
                this.pinDuoList=res.goods_list;
            }
        })
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
