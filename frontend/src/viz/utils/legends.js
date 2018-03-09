function ordinalLegend (params) {
  function switchSymbol (symbolName = 'circle') {
    switch (symbolName) {
      case 'circle':
        return d3.symbolCircle
      case 'triangle':
        return d3.symbolTriangle
      case 'star':
        return d3.symbolStar
      case 'square':
        return d3.symbolSquare
      case 'diamond':
        return d3.symbolDiamond
      case 'cross':
        return d3.symbolCross
      case 'wye':
        return d3.symbolWye
      default:
        return d3.symbolCircle
    }
  }

  function ordinalScaleBuild () {
    return d3.scaleOrdinal()
      .domain(['a', 'b', 'c', 'd', 'e'])
      .range(['rgb(153, 107, 195)', 'rgb(56, 106, 197)', 'rgb(93, 199, 76)', 'rgb(223, 199, 31)', 'rgb(234, 118, 47)'])
  }

  const size = params.size || 150
  const shapePadding = params.shapePadding || 5
  const scale = params.scale || ordinalScaleBuild()

  const symbol = switchSymbol(params.symbol)

  const legend = d3.legendColor()
    .shape('path', d3.symbol().type(symbol).size(size)())
    .shapePadding(shapePadding)
    .scale(scale)
  return legend
}

function drawLegend (params) {
  const { container, legend } = params
  const position = params.position || [0, 0]
  const element = container.append('g')
    .attr('class', 'legend-group legend')
    .attr('transform', `translate(${position})`)
    .call(legend)
  return element
}

module.exports.ordinalLegend = ordinalLegend
module.exports.drawLegend = drawLegend
