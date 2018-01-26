import Scatterplot from '../viz/scatterplot'

export default class DistribuicaoLicitacaoAno {
  constructor () {
    this.scatterplot = new Scatterplot()

    this.X = item => new Date(item.dtEdital)
    this.Y = item => item.vlLicitacao
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

    this.scatterplot.defineSVG(this.container)
      .defineCoordX(this.X)
      .defineCoordY(this.Y)
      .defineColorAccessor(this.color)
      .defineXDomain(xDomain)
      .defineYDomain(yDomain)
      .defineColorDomain(colorDomain)
      .setData(data)
      .draw()
  }
}
