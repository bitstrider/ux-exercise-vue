// adapted from https://github.com/ignoreintuition/d3vue/blob/master/src/v-charts/index.js
import {router} from 'src/main'

export default {
  install: function(Vue) {
    Vue.prototype.$helpers = {
      chart: {
        d3: {},
        ds: {},

        /**
         * $helpers.chart.scatterPlot
         * bind data to a scatter plot.
         * @param {string} d3 - reference to d3 object.
         * @param {string} ds - dataset for the graph.
         * @param {Object} options - options for bar graph.
         * @param {string} options.selector - selector name to place the graph.
         * @param {string} options.metric - value you are measuring.
         * @param {string} options.dim - value you will be categorizing the data by.
         * @param {string} options.width - width of the chart.
         * @param {string} options.height - height of the chart.
         * @param {string} options.title - title of the chart.
         */
        scatterPlot: function(d3, ds, options) {
          //var metric = options.metric;
          var svg = this.init(d3, ds, options.selector);
          var offset = options.title ? 20 : 0;
          var maxVal = Math.max.apply(Math, this.ds.map(function(o) {
            return o[options.metric];
          }));

          var minVal = Math.min.apply(Math, this.ds.map(function(o) {
            return o[options.metric];
          }));

          var maxVal2 = Math.max.apply(Math, this.ds.map(function(o) {
            return o[options.metric2];
          }));

          var minVal2 = Math.min.apply(Math, this.ds.map(function(o) {
            return o[options.metric2];
          }));

          var g = svg.selectAll('circle')
            .data(this.ds);

          var yScale = this.d3.scaleLinear()
            .domain([minVal, maxVal])
            .range([options.height, 0]);

          var yAxis = this.d3.axisLeft()
            .scale(yScale);

          var xScale = this.d3.scaleLinear()
            .domain([minVal2, maxVal2])
            .range([0, options.width]);

          var xAxis = this.d3.axisBottom()
            .scale(xScale)

          svg.selectAll('g').remove();

          if (options.title) this.addTitle(options.title, svg, options.width);

          g.enter()
            .append('circle')
            .attr('r', '4')
            .attr('class', 'point')
            .merge(g)
            .attr('cx', (d, /* i */) => {
              return (xScale(d[options.metric2])) + 60
            })
            .attr('cy', d => {
              return yScale(d[options.metric]);
            })
            .style('fill','gray')
            .style('stroke','black')

            .on('mouseover', function (d, /*i*/) {

              // Use D3 to select element, change color and size
              d3.select(this)
                .attr('r', '8')
                .style('fill','orange')
                .style('stroke','orange')
                .style("opacity", .5);

              const cy = yScale(d[options.metric]);
              const cx = (xScale(d[options.metric2])) + 60;


              svg.append('text')
                .attr('x', cx)
                .attr('y', cy)
                .attr('class', 'tt')
                .attr('fill', "orange")
                .attr('text-anchor',"middle")
                .attr('font-size','12px')
                .text(d.name);


            })

            .on('mouseout', function(/* d */) {
              d3.select(this)
                .attr('r', '4')
                .style('fill','gray')
                .style('stroke','black')
                .style("opacity", 1);

              svg.selectAll('.tt').remove();
            })

            // navigate to Person page for selected person
            .on('click', (d) => {
              router.push(`/people/${d.id}`)
            })

            .attr('transform', 'translate(0,' + offset + ')')

            this.drawAxis(options.height, svg, xAxis, yAxis, offset);

            svg.exit().remove();
        },

        /* Helper Function */
        init: function(d3, ds, selector) {
          this.d3 = d3;
          this.ds = ds;
          return this.d3.select(selector)
        },

        initOrdinalScale: function(dim, width) {
          var domainArr = [];
          var rangeArr = [];

          this.ds.forEach((t) => {
            domainArr.push(t[dim])
          })
          this.ds.forEach((t, i) => {
            rangeArr.push(width * i / this.ds.length)
          })

          var xScale = this.d3.scaleOrdinal()
            .domain(domainArr)
            .range(rangeArr);
          return xScale;
        },

        drawAxis: function(height, svg, xAxis, yAxis, offset) {
          offset = offset || 0;
          svg.append('g')
            .attr('transform', 'translate(50,' + offset + ')')
            .call(yAxis);

          svg.append('g')
            .attr('transform', 'translate(70,' + (height + offset + 5) + ')')
            .call(xAxis);
        },


        addTitle: function(t, svg, w) {
          svg.append('text')
            .attr('x', w / 2)
            .attr('text-anchor', 'middle')
            .attr('y', 0)
            .attr('font-size','20px')
            .text(t);
        }
      }
    }
  }
}
