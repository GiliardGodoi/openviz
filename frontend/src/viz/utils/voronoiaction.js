// this.svg = d3.select('#chart svg')
// const action = this.voronoiActionOnMouseMove()
// this.svg.on('mousemove', action)

module.exports.voronoiActionOnMouseMove = function voronoiOnMouseMove () {
  let voronoi = null
  let tooltipped = null
  const { svg } = this
  const marginLeft = this.margin.left
  const marginTop = this.margin.top
  const X = d => this.xScale(this.X(d))
  const Y = d => this.yScale(this.Y(d))
  const DATA = this.data

  function removeTooltip () {
  }

  function showTooltip () {
  }

  function redrawPolygon (polygon) {
    polygon.attr('d', d => (d ? `M${d.join('L')}Z` : null))
  }

  return function action () {
    if (!voronoi) {
      voronoi = d3.voronoi().x(X).y(Y)(DATA)
      svg.append('g')
        .attr('class', 'polygons')
        .attr('transform', `translate(${[marginLeft, marginTop]})`)
        .selectAll('path')
        .data(voronoi.polygons())
        .enter()
        .append('path')
        .call(redrawPolygon)
    }

    const p = d3.mouse(this)
    let site = null
    p[0] -= marginLeft
    p[1] -= marginTop
    if (p[0] < 0 || p[1] < 0) {
      site = null
    } else {
      site = voronoi.find(p[0], p[1], 50)
    }
    if (site !== tooltipped) {
      if (tooltipped) removeTooltip(tooltipped.data)
      if (site) showTooltip(site.data)
      tooltipped = site
    }
  }
}
