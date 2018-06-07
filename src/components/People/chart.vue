<!-- adapted from https://github.com/ignoreintuition/d3vue/blob/master/src/components/index.vue -->
<template>
  <div class="content">
    <div class="segment">
      <svg class="chart" id="chart" width="400" height="250"></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScatterPlot',
  props: ["dataSet"],

  // re-render chart when dataSet is changed
  watch: {
    dataSet: function(newVal, oldVal) { // watch it
      console.log(`adding ${newVal.length - oldVal.length} points to plot`)
      this.renderCharts();
    }
  },

  data () {
    return {
      //dataSet: [],
      options: {
        dim: 'name',
        height: 175,
        width: 250
      }
    }
  },
  mounted: function() {
    this.renderCharts();
  },
  beforeUpdate: function(){
    this.renderCharts();
  },
  methods: {
    renderCharts: function (){
      this.options.selector = '#chart',
      this.options.metric = 'height',
      this.options.metric2 = 'mass',
      this.options.title = "Height (cm) vs Mass (kg)"

      this.$helpers.chart.scatterPlot(this.$d3, this.dataSet, this.options);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.segment {
  width: 100%;
  float: left;
  align-content:center;
}
.chart {
  padding: 20px;
  display: block;
  margin: auto;
  /* background: #EEFFFF; */
}
</style>
