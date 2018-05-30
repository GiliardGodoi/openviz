// import { localeFormat, multiFormat } from '../viz/utils/format'
import { modalidadeLicitacaoScale } from '../viz/utils/categoricalScaleToModalidadeLicitacao'
import { defineSVG } from '../viz/linechart'

export default class LineChartQuantidadeLicitacao {
  constructor () {
    this.IDContainer = '#lineChartQuantidadeLicitacao'

    this.color = item => item.dsModalidadeLicitacao
    this.getMonth = item => new Date(item.dtEdital).getMonth()

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

  prepareData (data = []) {
    const nest = d3.nest()
      .key(this.color)
      .key(this.getMonth)
      .sortKeys((a, b) => a - b)
      .rollup(leaves => leaves.length)

    const entries = nest.entries(data)
    return entries
  }

  init () {
    this.SVG = defineSVG({
      selector: this.IDContainer,
      size: this.size,
      margin: this.margin,
    })
  }

  getXScale () {
    const outputRange = [0, this.size.width]
    // const inputDomain = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']

    const scale = d3.scaleLinear()
      .range(outputRange)
      .domain([0, 11])
    return scale
  }

  getYScale () {
    const outputRange = [this.size.height, 0]
    const inputDomain = [0, 100]
    const scale = d3.scaleLinear()
      .range(outputRange)
      .domain(inputDomain)
    return scale
  }

  build (data) {
    this.init()
    const classedData = this.prepareData(data)
    const group = this.SVG.select('.linechart')

    const xScale = this.getXScale()
    const yScale = this.getYScale()
    const colorScale = modalidadeLicitacaoScale()
    const X = d => xScale(d.key)
    const Y = d => yScale(d.value)


    const lineGenerator = d3.line()
      .curve(d3.curveMonotoneX)
      .x(X)
      .y(Y)
      .defined(d => (d || 0))

    function lineDraw (d) {
      const { key, values } = d
      const g = d3.select(this)

      g.datum(values)
        .append('path')
        .attr('d', lineGenerator)
        .attr('stroke', () => colorScale(key))
        .attr('stroke-width', '3')
    }

    function drawPoints (pointData) {
      const selection = d3.select(this)
      const { key, values } = pointData

      selection.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', '.point')
        .attr('cx', X)
        .attr('cy', Y)
        .attr('r', 3)
        .attr('fill', () => colorScale(key))
    }

    group.selectAll('g')
      .data(classedData)
      .enter()
      .append('g')
      .attr('class', 'line')
      .style('fill', 'none')
      .each(lineDraw)

    group.append('g')
      .attr('class', 'dots')
      .selectAll('.dot')
      .data(classedData)
      .enter()
      .append('g')
      .attr('class', 'dot')
      .each(drawPoints)

    const xAxis = d3.axisBottom().scale(xScale)
    const yAxis = d3.axisLeft().scale(yScale)

    group.append('g')
      .attr('transform', `translate(${[0, this.size.height]})`)
      .call(xAxis)
    group.append('g')
      .attr('transform', 'translate(0,0)')
      .call(yAxis)
  }
}
