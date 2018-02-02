import Scatterplot from '../viz/scatterplot'
import { localeFormat, multiFormat } from '../utils/format'
import { ordinalLegend } from '../viz/legends'

export default class DistribuicaoLicitacaoAno {
  constructor () {
    this.scatterplot = new Scatterplot()

    this.X = item => new Date(item.dtEdital)
    this.Y = item => (item.vlLicitacao ? item.vlLicitacao : 1)
    this.color = item => item.dsModalidadeLicitacao
    this.colorRange = d3.schemeCategory10
    this.container = '#chart'
    this.DATA = null
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

  calculateXDomain (data) {
    if (Array.isArray(data)) {
      const extent = d3.extent(data, d => this.X(d))
      return extent
    }
    throw TypeError('Data must to be an Array')
  }

  calculateYDomain (data) {
    if (Array.isArray(data)) {
      const yDomain = [1, d3.max(data, d => this.Y(d))]
      return yDomain
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
    const xDomain = this.calculateXDomain(data)
    const yDomain = this.calculateYDomain(data)
    const colorDomain = this.calculateColorDomain(data)

    this.colorScale = d3.scaleOrdinal()
      .range(this.colorRange)
      .domain(colorDomain)

    const xScale = d3.scaleTime().range([0, 750]).domain(xDomain)
    const xAxis = d3.axisBottom().scale(xScale).tickFormat(multiFormat)

    const yScale = d3.scaleLog().range([450, 0]).domain(yDomain)
    const yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(localeFormat.format('$,.2f'))
    const legend = ordinalLegend({ scale: this.colorScale })

    this.setTitle('Distribuição das Licitações')

    this.scatterplot.defineSVG(this.container)
      .defineCoordX(this.X)
      .defineCoordY(this.Y)
      .defineColorAccessor(this.color)
      .defineColorScale(this.colorScale)
      .setData(data)
      .drawYAxis(yAxis)
      .setYLabelAxis('Valor Edital Licitação')
      .drawXAxis(xAxis)
      .setXLabelAxis('Data de Publicação do Edital')
      .drawMarks()

    d3.select('#legend-display')
      .append('svg')
      .attr('class', 'legend')
      .call(legend)
  }
}
