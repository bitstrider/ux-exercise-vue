import Vue from 'vue';
import VueRouter from 'vue-router';

import { LoadingState } from 'src/config/loading-state';
import Navigation from 'components/Navigation/navigation';
import Loader from 'components/Loader/loader';
import Vehicle from 'src/components/Vehicles/vehicle'

Vue.use(VueRouter);

import 'src/config/http';
import routes from 'src/routes';
import 'src/style.scss';

export const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
});


// chart plugin boilerplate from https://github.com/ignoreintuition/d3vue/blob/master/src/main.js
import * as d3 from 'd3';
import charts from 'src/util/v-charts'

Vue.use(charts);
Object.defineProperty(Vue.prototype, '$d3', {value: d3});


new Vue({
  router,
  components: {
    Navigation,
    Loader,
    Vehicle,
  },

  data(){
    return {
      isLoading: false
    };
  },

  created(){
    LoadingState.$on('toggle', (isLoading) => {
      this.isLoading = isLoading;
    });
  }
}).$mount('#app');
