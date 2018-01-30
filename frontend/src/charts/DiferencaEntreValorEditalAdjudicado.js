import Scatterplot from '../viz/scatterplot'
import { localeFormat } from '../utils/format'

export default class DiferencaEntreValorEditalAdjudicado {
  constructor () {
    this.scatterplot = new Scatterplot()

    this.X = item => (item.vlLicitacao ? item.vlLicitacao : 1)
    this.Y = item => (item.vlTotalAdquiridoLicitacao ? item.vlTotalAdquiridoLicitacao : 1)
    this.color = item => item.dsModalidadeLicitacao

    this.container = '#chart'
    this.DATA = null

    this.size = {
      width: 500,
      height: 500,
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

  build (data) {
    const XYDomain = this.calculateXYDomain(data)
    const colorDomain = this.calculateColorDomain(data)

    const xScale = d3.scaleLog().range([0, this.size.width]).domain(XYDomain)
    const yScale = d3.scaleLog().range([this.size.height, 0]).domain(XYDomain)

    const xAxis = d3.axisBottom().scale(xScale).tickFormat(localeFormat.format('$,.2f')).tickValues([1, 100, 1000, 10000, 100000, 10000, 100000, 1000000, 1000000, 10000000])
    const yAxis = d3.axisLeft().scale(yScale).tickFormat(localeFormat.format('$,.2f')).tickValues([1, 100, 1000, 10000, 100000, 10000, 100000, 1000000, 1000000, 10000000])
    const { width, height } = this.size

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
  }
}
