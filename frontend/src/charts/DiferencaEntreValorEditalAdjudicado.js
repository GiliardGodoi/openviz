import { localeFormat } from '../utils/format'
import { ordinalLegend } from '../viz/legends'
import { tickValuesByPow } from '../utils/ticks'
import {
  calculateCategoricalDomain,
} from '../utils/domains'

import {
  defineSVGAreaChart,
  drawPoints,
  drawAxis,
} from '../viz/scatterplot'

export default class DiferencaEntreValorEditalAdjudicado {
  constructor () {
    this.data = null
    this.X = item => (item.vlLicitacao || 0.01)
    this.Y = item => (item.vlTotalAdquiridoLicitacao || 0.01)
    this.color = item => item.dsModalidadeLicitacao
    this.colorRange = d3.schemeCategory10

    this.IDcontainer = '#DiferencaEntreValorEditalAdjudicado'

    this.size = {
      width: 750,
      height: 500,
    }

    this.margin = {
      top: 20,
      right: 10,
      bottom: 30,
      left: 80,
    }
  }

  calculateXYDomain (data) {
    if (Array.isArray(data)) {
      const Xextent = d3.extent(data, this.X)
      const Yextent = d3.extent(data, this.Y)
      const extent = d3.extent(Xextent.concat(Yextent))
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
    const colorDomain = calculateCategoricalDomain(data, this.color)
    const { width, height } = this.size

    this.xScale = d3.scaleLog()
      .range([0, width])
      .domain(XYDomain)
      .clamp(true)

    this.yScale = d3.scaleLog()
      .range([height, 0])
      .domain(XYDomain)
      .clamp(true)

    this.ordinalScale = d3.scaleOrdinal()
      .range(this.colorRange)
      .domain(colorDomain)

    const ticksValuesArray = tickValuesByPow(XYDomain)

    const xAxis = d3.axisBottom()
      .scale(this.xScale)
      .tickFormat(localeFormat.format('$.0s'))
      .tickValues(ticksValuesArray)

    const yAxis = d3.axisLeft()
      .scale(this.yScale)
      .tickFormat(localeFormat.format('$,.2f'))
      .tickValues(ticksValuesArray)

    this.SVG = defineSVGAreaChart({
      selector: this.IDcontainer,
      size: this.size,
      margin: this.margin,
    })
    drawPoints({
      data,
      container: this.SVG,
      cy: d => this.yScale(this.Y(d)),
      cx: d => this.xScale(this.X(d)),
      fill: d => this.ordinalScale(this.color(d)),
      radius: 3,
      opacity: 0.5,
    })
    drawAxis({
      axis: yAxis,
      container: this.SVG,
      position: [0, 0],
      classname: 'axis axis--y',
    })

    drawAxis({
      axis: xAxis,
      container: this.SVG,
      position: [0, this.size.height + 2],
      classname: 'axis axis-x',
    })
  }
}
