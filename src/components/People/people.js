import Vue from 'vue';

import { starWarsResource } from 'src/util/resources';
import template from './people.html';
import * as d3 from 'd3';

import Chart from './chart'

import {extractId} from 'src/util/helpers'

const animation = 'flipInX';
const animationDelay = 25; // in ms

export default Vue.extend({
  template,

  data() {
    return {
      peopleFilter: '',
      people: []
    };
  },

  components: {Chart},

  computed: {
    filteredPeople() {
      return this.people.filter((person) => person.name.toLowerCase().indexOf(this.peopleFilter.toLowerCase()) !== -1);
    },

    peopleSummary() {
      let sums  =this.people.reduce((last, p, i) => {
        let next = Object.assign(last, { count: i + 1 })
        next.sumHeight += isNaN(p.height) ? 0 : Number(p.height);
        next.sumMass += isNaN(p.mass) ? 0 : Number(p.mass);
        return next;
      },{
        sumHeight: 0,
        sumMass: 0,
        count: 0,
        gender: {},
      });

      sums.avgHeight = d3.format(",.1f")(sums.sumHeight / sums.count) + ' cm'
      sums.avgMass = d3.format(",.1f")(sums.sumMass / sums.count) + ' kg'
      return sums
    },

    //generate dataset for d3 scatterplot
    chartedPeople() {
      return this.people.map(p => {
        return {
          name:p.name,
          id:p.id,
          height:isNaN(p.height) ? 0 : Number(p.height),
          mass:isNaN(p.mass) ? 0 : Number(p.mass)
        }
      });
    }
  },

  created(){
    this.fetchPeople();
  },

  methods: {
    fetchPeople(page){
      if (!page) {
        this.people = [];
      }
      return starWarsResource.get('/people/' + (page ? `?page=${page}`: ''))
        .then((response) => {
          let newPeople = response.data.results.map(p => Object.assign(p, {id: extractId(p.url)}))
          this.people = this.people.concat(newPeople);

          if (response.data.next) {
            let nextPage = page ? ++page : 2;
            return this.fetchPeople(nextPage)
          }
        })
        .catch((errorResponse) => {
          // Handle error...
          console.log('API responded with:', errorResponse);
        });
    },

    // Methods for transitions
    handleBeforeEnter(el) {
      el.style.opacity = 0;
      el.classList.add('animated');
    },

    handleEnter(el) {
      const delay = el.dataset.index * animationDelay;
      setTimeout(() => {
        el.style.opacity = 1;
        el.classList.add(animation);
      }, delay);
    }
  }
});
