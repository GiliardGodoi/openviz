const SIZE = {
  width: 750,
  height: 450,
}

const MARGIN = {
  top: 20,
  right: 10,
  bottom: 60,
  left: 80,
}

const X = d => d.x
const Y = d => d.y
const COLOR_SCALE = () => 'steelblue'
const RADIUS_SCALE = () => 3

const CIRCLE_GROUP = 'circle-group'
const CHART_GROUP = 'group-chart'

function defineSVGAreaChart ({
  selector,
  size,
  margin,
}) {
  const WIDTH = size.width || SIZE.width
  const HEIGHT = size.height || SIZE.height
  const translateX = margin.left || MARGIN.left
  const translateY = margin.top || MARGIN.top

  const TotalWidth = size.width + margin.left + margin.right
  const TotalHeight = size.height + margin.top + margin.bottom

  const SVG = d3.select(selector)
    .append('svg')
    .attr('width', TotalWidth)
    .attr('height', TotalHeight)

  const chartGroup = SVG.append('g')
    .attr('class', CHART_GROUP)
    .attr('transform', `translate(${[translateX, translateY]})`)

  SVG.append('defs')
    .append('svg:clipPath')
    .attr('id', 'clip')
    .append('svg:rect')
    .attr('width', WIDTH + 10)
    .attr('height', HEIGHT + 10)
    .attr('x', -5)
    .attr('y', -5)

  chartGroup.append('g')
    .attr('clip-path', 'url(#clip)')
    .style('clip-path', 'url(#clip)')
    .attr('class', CIRCLE_GROUP)

  return SVG
}

function drawPoints ({
  data,
  container,
  cy,
  cx,
  radius,
  fill,
  opacity,
}) {
  const CX = cx || X
  const CY = cy || Y
  const R = radius || RADIUS_SCALE
  const FILL = fill || COLOR_SCALE
  const OPACITY = opacity || 1
  const SVG = container
  const height = SVG.attr('height')

  const bubbles = SVG.select(`.${CIRCLE_GROUP}`)
    .selectAll('.bubble')
    .data(data)

  // UPDATE
  bubbles.transition()
    .ease(d3.easeSinInOut)
    .duration(750)
    .attr('cx', CX)
    .attr('cy', CY)

  // ENTER
  bubbles.enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('cx', CX)
    .attr('cy', height)
    .attr('r', 0)
    .style('fill', FILL)
    .transition()
    .duration(750)
    .attr('cx', CX)
    .attr('cy', CY)
    .attr('r', R)
    .style('fill', FILL)
    .style('opacity', OPACITY)

  bubbles.exit().remove()

  return SVG
}

function drawAxis ({
  axis,
  container,
  position,
  classname,
}) {
  const axisDrawed = container.select(`.${CHART_GROUP}`)
    .append('g')
    .attr('transform', `translate(${position})`)
    .attr('class', classname)
    .call(axis)
  return axisDrawed
}

module.exports.defineSVGAreaChart = defineSVGAreaChart
module.exports.drawPoints = drawPoints
module.exports.drawAxis = drawAxis
