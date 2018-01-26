import {localeFormat, localeTimeFormat, multiFormat} from './utils/format'

export default class Scatterplot {
  constructor () {
    this.DATA = null

    this.size = {
      width: 750,
      height: 450,
    }

    this.margin = {
      top: 20,
      right: 10,
      bottom: 60,
      left: 80,
    }

    this.SVG = null
    this.chartGroup = null
    this.circleGroup = null
    this.svgLegend = null

    this.X = d => d.x
    this.Y = d => d.y
    this.color = d => (d ? d.color : 'black')
    this.radius = d => (d ? d.r : 4)

    this.xAxis = null
    this.yAxis = null

    this.xDomain = null
    this.yDomain = null
    this.colorDomain = null

    this.colorRange = ['#1abc9c', '#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#8e44ad']
    this.xRange = [0, this.size.width]
    this.yRange = [this.size.height, 0]
    this.radiusRange = [0, 15]

    this.yScale = d3.scaleLog().range(this.yRange)
    this.xScale = d3.scaleTime().range(this.xRange)
    this.colorScale = d3.scaleOrdinal().range(this.colorRange)
    this.radiusScale = () => 4
  }


  setData (data) {
    this.DATA = data
    return this
  }

  setSize (size = [this.size.width, this.size.height]) {
    if (!Array.isArray(size)) {
      return this
    }

    const [w, h] = size
    if (w) this.size.width = w
    if (h) this.size.height = h

    return this
  }

  setMargins (margin) {
    const {
      top,
      bottom,
      right,
      left,
    } = margin

    if (top) this.margin.top = top
    if (bottom) this.margin.bottom = bottom
    if (right) this.margin.right = right
    if (left) this.margin.left = left

    return this
  }

  // setYScale (scaleName) {
  //   return this
  // }

  // setXScale (scaleName) {
  //   return this
  // }

  // setColorScale (scaleName) {
  //   return this
  // }

  // setRadiusScale (scaleName) {
  //   return this
  // }

  // setColorRange (range) {
  //   return this
  // }

  // setXRange (range) {
  //   return this
  // }

  // setYRange (range) {
  //   return this
  // }

  // setRadiusRange (range) {
  //   return this
  // }

  defineSVG (selector = 'body') {
    const WIDTH = this.size.width + this.margin.left + this.margin.right
    const HEIGHT = this.size.height + this.margin.top + this.margin.bottom
    const translateX = this.margin.left
    const translateY = this.margin.top

    this.SVG = d3.select(selector)
      .append('svg')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)

    this.chartGroup = this.SVG.append('g')
      .attr('class', 'group-chart')
      .attr('transform', `translate(${[translateX, translateY]})`)

    this.SVG.append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', this.size.width + 10)
      .attr('height', this.size.height + 10)
      .attr('x', -5)
      .attr('y', -5)

    this.circleGroup = this.chartGroup.append('g')
      .attr('clip-path', 'url(#clip)')
      .style('clip-path', 'url(#clip)')
      .attr('class', 'circle-group')

    return this
  }

  defineXDomain (domain) {
    this.xDomain = domain
    this.xScale.domain(this.xDomain)

    return this
  }

  defineYDomain (domain) {
    this.yDomain = domain
    this.yScale.domain(this.yDomain)

    return this
  }

  defineColorDomain (domain) {
    this.colorDomain = domain
    this.colorScale.domain(this.colorDomain)

    return this
  }

  defineCoordX (xAccessor) {
    this.X = xAccessor
    return this
  }

  defineCoordY (yAccessor) {
    this.Y = yAccessor
    return this
  }

  defineColorAccessor (colorAccessor) {
    this.color = colorAccessor
    return this
  }

  defineRadiusAccessor (radiusAcessor) {
    this.radius = radiusAcessor
    return this
  }

  defineKeyAccessor (keyAccessor) {
    return this
  }

  defineBubbleClassAccessor (classAcessor) {
    return this
  }

  drawAxis () {
    this.drawXAxis().drawYAxis()
    return this
  }

  drawXAxis () {
    this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(multiFormat)
    const translateXAxis = this.size.height + 5
    this.chartGroup.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${[0, translateXAxis]})`)
      .call(this.xAxis)

    return this
  }

  drawYAxis () {
    this.yAxis = d3.axisLeft().scale(this.yScale).ticks(5).tickFormat(localeFormat.format('$,.2f'))

    this.chartGroup.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', 'translate(0,0)')
      .call(this.yAxis)

    return this
  }

  drawMarks () {
    if (!this.DATA) {
      throw TypeError('Não é possível contruir o gráfico sem os dados')
    }

    const cx = d => this.xScale(this.X(d))
    const cy = d => this.yScale(this.Y(d))
    const r = d => this.radiusScale(this.radius(d))
    const fill = d => this.colorScale(this.color(d))
    const opacity = 0.5

    const bubbles = this.circleGroup.selectAll('.bubble')
      .data(this.DATA)

    // UPDATE
    bubbles.transition()
      .ease(d3.easeSinInOut)
      .duration(750)
      .attr('cx', cx)
      .attr('cy', cy)

    // ENTER
    bubbles.enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', cx)
      .attr('cy', this.size.height)
      .attr('r', 0)
      .style('fill', fill)
      .transition()
      .duration(750)
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', r)
      .style('fill', fill)
      .style('opacity', opacity)

    bubbles.exit().remove()

    return this
  }

  drawLegend () {
    return this
  }

  draw () {
    this.drawAxis()
      .drawMarks()
    return this
  }

  calculateVoronoiDiagram () {
    return this
  }
}
