import { zeroToMaxDomain } from '../viz/utils/domains'
import { modalidadeLicitacaoScale } from '../viz/utils/categoricalScaleToModalidadeLicitacao'
import {
  drawBars,
  defineSVG,
  histogram,
} from '../viz/histogram'

export default class QuantidadeLicitacoes {
  constructor () {
    this.IDcontainer = '#quantidadeLicitacaoChart'
    this.X = d => (d.vlLicitacao || 0)

    this.size = {
      width: 500,
      height: 300,
    }

    this.margin = {
      top: 50,
      right: 10,
      bottom: 20,
      left: 80,
    }

    this.init()
  }

  init () {
    this.xScale = d3.scaleLinear()
      .range([0, this.size.width])

    this.yScale = d3.scaleLinear()
      .range([this.size.height, 0])
  }

  build (data) {
    const xDomain = zeroToMaxDomain(data, this.X)
    const HEIGHT = this.size.height
    const XScale = this.xScale
    const YScale = this.yScale
    const colorScale = modalidadeLicitacaoScale()

    this.SVG = defineSVG({
      selector: this.IDcontainer,
      size: this.size,
      margin: this.margin,
    })

    const bins = histogram({
      value: this.X,
      domain: xDomain,
      thresholds: d3.thresholdScott,
    })(data)

    const Y = b => b.length
    const yDomain = zeroToMaxDomain(bins, Y)

    XScale.domain(xDomain)
    YScale.domain(yDomain)

    drawBars({
      bins,
      container: this.SVG,
      height: b => (HEIGHT - YScale(Y(b))),
      width: b => (XScale(b.x1) - XScale(b.x0) - 1),
      x: 1,
      translate: b => `translate(${[XScale(b.x0), YScale(Y(b))]})`,
      color: colorScale,
    })
  }
}
