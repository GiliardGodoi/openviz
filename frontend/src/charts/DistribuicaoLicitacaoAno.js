import Scatterplot from '../viz/scatterplot'
import { localeFormat, multiFormat } from '../utils/format'

export default class DistribuicaoLicitacaoAno {
  constructor () {
    this.scatterplot = new Scatterplot()

    this.X = item => new Date(item.dtEdital)
    this.Y = item => (item.vlLicitacao ? item.vlLicitacao : 1)
    this.color = item => item.dsModalidadeLicitacao

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

  build (data) {
    const xDomain = this.calculateXDomain(data)
    const yDomain = this.calculateYDomain(data)
    const colorDomain = this.calculateColorDomain(data)

    const xScale = d3.scaleTime().range([0, 750]).domain(xDomain)
    const xAxis = d3.axisBottom().scale(xScale).tickFormat(multiFormat)

    const yScale = d3.scaleLog().range([450, 0]).domain(yDomain)
    const yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(localeFormat.format('$,.2f'))

    this.scatterplot.defineSVG(this.container)
      .defineCoordX(this.X)
      .defineCoordY(this.Y)
      .defineColorAccessor(this.color)
      .defineColorDomain(colorDomain)
      .setData(data)
      .drawYAxis(yAxis)
      .setYLabelAxis('Valor da Licitação')
      .drawXAxis(xAxis)
      .setXLabelAxis('Data de Publicação do Edital')
      .drawMarks()
  }
}
