import Scatterplot from '../viz/scatterplot'
import { localeFormat } from '../utils/format'
import { ordinalLegend } from '../viz/legends'

export default class DiferencaEntreValorEditalAdjudicado {
  constructor () {
    this.scatterplot = new Scatterplot()
    this.data = null
    this.X = item => (item.vlLicitacao ? item.vlLicitacao : 1)
    this.Y = item => (item.vlTotalAdquiridoLicitacao ? item.vlTotalAdquiridoLicitacao : 1)
    this.color = item => item.dsModalidadeLicitacao

    this.xScale = null
    this.yScale = null

    this.colorRange = ['#1abc9c', '#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#8e44ad']

    this.container = '#chart'
    this.svg = null

    this.size = {
      width: 750,
      height: 500,
    }

    this.margin = {
      top: 20,
      right: 10,
      bottom: 60,
      left: 80,
    }
  }

  calculateColorDomain (data) {
    if (Array.isArray(data)) {
      const colorDomain = data.map(item => this.color(item))
        .filter((item, index, array) => array.indexOf(item) === index)
        .sort((a, b) => a - b)
      return colorDomain
    }
    throw TypeError('Data must to be an Array')
  }

  calculateXYDomain (data) {
    if (Array.isArray(data)) {
      const XminMax = d3.extent(data, this.X)
      const YminMax = d3.extent(data, this.Y)
      const extent = d3.extent(XminMax.concat(YminMax))
      return extent
    }
    throw TypeError('Data must to be an Array')
  }

  setTitle (title) {
    d3.select(this.container)
      .append('h5')
      .style('color', '#3B3B3B')
      .style('text-align', 'center')
      .text(title)

    return this
  }

  build (data) {
    this.data = data

    const XYDomain = this.calculateXYDomain(data)
    const colorDomain = this.calculateColorDomain(data)

    this.xScale = d3.scaleLog()
      .range([0, this.size.width])
      .domain(XYDomain)
      .clamp(true)

    this.yScale = d3.scaleLog()
      .range([this.size.height, 0])
      .domain(XYDomain)
      .clamp(true)

    this.ordinalScale = d3.scaleOrdinal()
      .range(this.colorRange)
      .domain(colorDomain)

    const legend = ordinalLegend({ scale: this.ordinalScale })

    const ticksValuesArray = [1, 100, 1000, 10000, 100000, 10000, 100000, 1000000, 1000000, 10000000]

    const xAxis = d3.axisBottom()
      .scale(this.xScale)
      .tickFormat(localeFormat.format('$,.2f'))
      .tickValues(ticksValuesArray)

    const yAxis = d3.axisLeft()
      .scale(this.yScale)
      .tickFormat(localeFormat.format('$,.2f'))
      .tickValues(ticksValuesArray)

    const { width, height } = this.size

    this.setTitle('Diferença entre Valor Adjudicado* e o Valor do Edital')
    this.scatterplot
      .setSize([width, height])
      .defineSVG(this.container)
      .defineCoordX(this.X)
      .defineCoordY(this.Y)
      .defineColorAccessor(this.color)
      .defineColorScale(this.ordinalScale)
      .setData(data)
      .drawXAxis(xAxis)
      .setXLabelAxis('Valor do Edital')
      .drawYAxis(yAxis)
      .setYLabelAxis('Valor Adjudicado*')
      .drawMarks()

    // this.svg = d3.select('#chart svg')
    // const action = this.voronoiActionOnMouseMove()
    // this.svg.on('mousemove', action)
    d3.select('#legend-display')
      .append('svg')
      .attr('class', 'legend')
      .call(legend)
  }

  voronoiActionOnMouseMove () {
    let voronoi = null
    let tooltipped = null
    const { svg } = this
    const marginLeft = this.margin.left
    const marginTop = this.margin.top
    const X = d => this.xScale(this.X(d))
    const Y = d => this.yScale(this.Y(d))
    const DATA = this.data

    function removeTooltip (data) {
      console.log('remove tooltip')
    }

    function showTooltip (data) {
      console.log(data)
    }

    function redrawPolygon (polygon) {
      polygon.attr('d', d => (d ? `M${d.join('L')}Z` : null))
    }

    return function action () {
      if (!voronoi) {
        console.log('computing the voronoi…')
        voronoi = d3.voronoi().x(X).y(Y)(DATA)
        svg.append('g')
          .attr('class', 'polygons')
          .attr('transform', `translate(${[marginLeft, marginTop]})`)
          .selectAll('path')
          .data(voronoi.polygons())
          .enter()
          .append('path')
          .call(redrawPolygon)
      }

      const p = d3.mouse(this)
      let site = null
      p[0] -= marginLeft
      p[1] -= marginTop
      if (p[0] < 0 || p[1] < 0) {
        site = null
      } else {
        site = voronoi.find(p[0], p[1], 50)
      }
      if (site !== tooltipped) {
        if (tooltipped) removeTooltip(tooltipped.data)
        if (site) showTooltip(site.data)
        tooltipped = site
      }
    }
  }
}
