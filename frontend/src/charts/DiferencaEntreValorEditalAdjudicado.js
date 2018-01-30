import Scatterplot from '../viz/scatterplot'
import { localeFormat } from '../utils/format'

export default class DiferencaEntreValorEditalAdjudicado {
  constructor () {
    this.scatterplot = new Scatterplot()
    this.data = null
    this.X = item => (item.vlLicitacao ? item.vlLicitacao : 1)
    this.Y = item => (item.vlTotalAdquiridoLicitacao ? item.vlTotalAdquiridoLicitacao : 1)
    this.color = item => item.dsModalidadeLicitacao

    this.xScale = null
    this.yScale = null

    this.colorRange = ['#EFB605', '#E58903', '#E01A25', '#C20049', '#991C71', '#66489F', '#2074A0', '#10A66E', '#7EB852']

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

    this.yScale = d3.scaleLog()
      .range([this.size.height, 0])
      .domain(XYDomain)

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

    this.setTitle('Diferença entre Valor Adjudicado* e do Valor do Edital')
    this.scatterplot
      .setSize([width, height])
      .defineSVG(this.container)
      .defineCoordX(this.X)
      .defineCoordY(this.Y)
      .defineColorAccessor(this.color)
      .defineColorDomain(colorDomain)
      .setData(data)
      .drawXAxis(xAxis)
      .setXLabelAxis('Valor do Edital')
      .drawYAxis(yAxis)
      .setYLabelAxis('Valor Adjudicado*')
      .drawMarks()

    this.svg = d3.select('#chart svg')
    const action = this.voronoiActionOnMouseMove()
    this.svg.on('mousemove', action)
  }

  voronoiActionOnMouseMove () {
    let voronoi = null
    let tooltipped = null
    const svg = this.svg
    const marginLeft = 0 // this.margin.left
    const marginRight = 0 // this.margin.right
    const X = d => this.xScale(this.X(d))
    const Y = d => this.yScale(this.Y(d))
    const DATA = this.data

    function removeTooltip (data) {
      console.log(data.idLicitacao)
    }

    function showTooltip (data) {
      console.log(data.idLicitacao)
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
          .selectAll('path')
          .data(voronoi.polygons())
          .enter()
          .append('path')
          .call(redrawPolygon)

      }
      const p = d3.mouse(this)
      let site = null
      p[0] -= marginLeft
      p[1] -= marginRight
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
