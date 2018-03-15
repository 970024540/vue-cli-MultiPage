//专门定义axios请求方法

import * as api from './api';
import axios from '../../config/http';
import qs from 'querystring';


export const requestpingDuo = params => {
    return axios.get(api.pingDuo+qs.stringify(params)).then(res => res.data);
};
