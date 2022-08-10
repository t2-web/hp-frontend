import axios from 'axios';
import { env } from '@/constants';

export const http = axios.create({
  baseURL: env.app.apiUrl,
  timeout: 60000,
});

// let isAlreadyFetchingAccessToken = false;
// let subscribers = [];

// const onAccessTokenFetched = access_token => {
//   const mappedSubcribers = [...subscribers];
//   mappedSubcribers.forEach(callback => callback(access_token));
//   subscribers = [];
// };

// const addSubscriber = callback => {
//   subscribers.push(callback);
// };

// const resetStateAndDisconnect = _.debounce(() => {
//   store.dispatch('auth/resetState');
// }, 2000);

// Add a request interceptor
http.interceptors.request.use(
  config => {
    config.headers.common['Accept-Language'] =
      window.localStorage.getItem('locale') || env.app.locale;

    // const accessToken = store.getters['wallet/getAccessToken'];
    // if (accessToken) {
    //   config.headers.Authorization = accessToken;
    // }
    return config;
  },
  error => Promise.reject(error),
);

// Add a response interceptor
http.interceptors.response.use(
  response => {
    // Return JSON data
    if (response.data) {
      return response.data;
    }
    return response;
  },
  error => {
    // const { config } = error;
    // const originalRequest = config;
    const err = (error.response && error.response.data) || error;
    if (error.response && error.response.status === 401) {
      // if (error.response && error.response.status != 401) {

      // if (!isAlreadyFetchingAccessToken) {
      //   isAlreadyFetchingAccessToken = true;
      //   store
      //     .dispatch('wallet/refreshAccessToken')
      //     .then(({ access_token }) => {
      //       isAlreadyFetchingAccessToken = false;
      //       onAccessTokenFetched(access_token);
      //     })
      //     .catch(() => {
      //       resetStateAndDisconnect();
      //       return Promise.reject(err);
      //     });
      // }

      // const retryOriginalRequest = new Promise(resolve => {
      //   addSubscriber(async access_token => {
      //     originalRequest.headers.Authorization = `Bearer ${access_token}`;
      //     const res = await axios(originalRequest);
      //     if (res.data) {
      //       resolve(res.data);
      //     }
      //     resolve(res);
      //     // resolve(axios(originalRequest));
      //   });
      // });
      // return retryOriginalRequest;
      return Promise.reject(err);
    }

    if (error.response && error.response.status) {
      err.status = error.response.status;
    }

    return Promise.reject(err);
  },
);
export default http;
