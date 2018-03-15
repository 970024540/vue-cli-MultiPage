import axios from 'axios';
import NProgress from 'nprogress';  
import 'nprogress/nprogress.css';
//axios 基本配置
axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Cache-Control'] = "no-cache";
axios.defaults.headers.common['Pragma'] = "no-cache";



//添加一个请求拦截器
axios.interceptors.request.use(function(config){
    //在请求发出之前进行一些操作
    NProgress.start();
    return config;
  },function(error){
    NProgress.done();
    //Do something with request error
    return Promise.reject(error);
});

  //添加一个响应拦截器
  axios.interceptors.response.use(function(res){
    //在这里对返回的数据进行处理
    NProgress.done();
    return res;
  },function(error){
    NProgress.done();
    if (error.response) {
        switch (error.response.status) {
            case 401:
                console.log('接口返回401，请查看是否未登录。跳至登录页面')
        }
    }
    //Do something with response error
    return Promise.reject(error);
  })

  export default axios;
  