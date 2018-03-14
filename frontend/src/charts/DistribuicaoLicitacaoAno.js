import { localeFormat, multiFormat } from '../viz/utils/format'
import { tickValuesByPow } from '../viz/utils/ticks'
import { modalidadeLicitacaoScale } from '../viz/utils/categoricalScaleToModalidadeLicitacao'
import { drawTitle } from '../viz/utils/titlesANDtext'
import {
  calculateDomain,
  calculateLogDomain,
} from '../viz/utils/domains'

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
    this.IDContainer = '#DistribuicaoLicitacaoAno'
    this.SVG = null
    this.DATA = null

    this.size = {
      width: 900,
      height: 210,
    }

    this.margin = {
      top: 50,
      right: 10,
      bottom: 20,
      left: 80,
    }
  }

  build (data) {
    const xDomain = calculateDomain(data, this.X)
    const yDomain = calculateLogDomain(data, this.Y)

    const colorScale = modalidadeLicitacaoScale()

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

    drawTitle({
      container: this.SVG,
      text: 'Distribuição das Licitações ao Longo do Ano',
      position: [
        (this.margin.left + 30), 20],
    })
  }
}
