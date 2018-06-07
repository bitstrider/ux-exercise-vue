import Vue from 'vue';

import { starWarsResource } from 'src/util/resources';

import template from './vehicle.html';

// a reuseable component for fetching and rendering a single vehicle
export default Vue.component('vehicle', {
  template,

  props: ['url'],

  data() {
    return {
      vehicle: {}
    };
  },

  created(){
    this.fetchPost();
  },

  methods: {
    fetchPost(){

      // this.url will be in the format https://swapi.co/api/vehicles/:id/
      // it contains the baseUrl, but axios understands and works accordingly
      return starWarsResource.get(this.url)
        .then((response) => {
          this.vehicle = response.data;
        })
        .catch((errorResponse) => {
          // Handle error...
          console.log('API responded with:', errorResponse);
        });
    }
  }
});
