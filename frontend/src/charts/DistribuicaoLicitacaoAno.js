import { localeFormat, multiFormat } from '../utils/format'
import { ordinalLegend } from '../viz/legends'
import { tickValuesByPow } from '../utils/ticks'
import {
  calculateDomain,
  calculateCategoricalDomain,
  calculateLogDomain,
} from '../utils/domains'

import {
  defineSVGAreaChart,
  drawPoints,
  drawAxis,
} from '../viz/scatterplot'

export default class DistribuicaoLicitacaoAno {
  constructor () {
    this.X = item => new Date(item.dtEdital)
    this.Y = item => (item.vlLicitacao ? item.vlLicitacao : 1)
    this.color = item => item.dsModalidadeLicitacao
    this.colorRange = d3.schemeCategory10
    this.IDContainer = '#DistribuicaoLicitacaoAno'
    this.SVG = null
    this.DATA = null

    this.size = {
      width: 900,
      height: 210,
    }

    this.margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 80,
    }
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
    const xDomain = calculateDomain(data, this.X)
    const yDomain = calculateLogDomain(data, this.Y)
    const colorDomain = calculateCategoricalDomain(data, this.color)

    const colorScale = d3.scaleOrdinal()
      .range(this.colorRange)
      .domain(colorDomain)

    const legend = ordinalLegend({ scale: this.colorScale, shapePadding: 5 })

    const tickValues = tickValuesByPow(yDomain)
    const xScale = d3.scaleTime()
      .range([0, this.size.width])
      .domain(xDomain)
    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat(multiFormat)

    const yScale = d3.scaleLog()
      .range([this.size.height, 0])
      .domain(yDomain)
    const yAxis = d3.axisLeft()
      .scale(yScale).tickValues(tickValues)
      .tickFormat(localeFormat.format('$,.2f'))


    this.SVG = defineSVGAreaChart({
      selector: this.IDContainer,
      size: this.size,
      margin: this.margin,
    })

    drawAxis({
      axis: xAxis,
      container: this.SVG,
      position: [0, this.size.height],
      classname: 'axis axis-x',
    })

    drawAxis({
      axis: yAxis,
      container: this.SVG,
      position: [0, 0],
      classname: 'axis axis-y',
    })

    drawPoints({
      data,
      container: this.SVG,
      cy: d => yScale(this.Y(d)),
      cx: d => xScale(this.X(d)),
      fill: d => colorScale(this.color(d)),
      radius: 3,
      opacity: 0.5,
    })

    // d3.select('#distribuicao-legenda')
    //   .append('svg')
    //   .attr('class', 'legend')
    //   .call(legend)
  }
}
