function setTitleLikeTextOnSVG (params) {
  const { container, text } = params
  const position = params.position || [0, 0]
  const titleElemnt = container.append('text')
    .attr('class', 'chart-title')
    .attr('transform', `translate(${position})`)
    .text(text)

  return titleElemnt
}

function setTitleHTML (params) {
  const { tagElement, text } = params
  const titleElement = d3.select(tagElement)
    .append('h5')
    .attr('class', 'chart-title')
    .style('text-align', 'center')
    .text(text)
  return titleElement
}

module.exports.drawTitle = setTitleLikeTextOnSVG
module.exports.drawTitleHTML = setTitleHTML
