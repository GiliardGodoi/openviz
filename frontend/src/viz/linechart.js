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

function defineSVG ({
  selector,
  size,
  margin,
}) {
  const translateX = margin.left || MARGIN.left
  const translateY = margin.top || MARGIN.top

  const totalWidth = (size.width + margin.left + margin.right) ||
    (SIZE.width + MARGIN.left + MARGIN.right)
  const totalHeight = (size.height + margin.top + margin.bottom) ||
    (SIZE.height + MARGIN.top + MARGIN.bottom)

  const SVG = d3.select(selector)
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight)

  SVG.append('g')
    .attr('class', 'chart linechart')
    .attr('transform', `translate(${[translateX, translateY]})`)
  return SVG
}

module.exports.defineSVG = defineSVG
