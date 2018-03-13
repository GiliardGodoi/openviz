const SIZE = [800, 400]

function hierarchy (params) {
  const {
    data,
    children,
    sum,
    sort,
  } = params

  let root = d3.hierarchy(data, children)

  if (sum) root = root.sum(sum)
  if (sort) root = root.sort(sort)

  return root
}

function defineSVG (params) {
  const {
    selector,
    size,
    translation,
  } = params
  const SVG = d3.select(selector)
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height)
    .append('g')
    .attr('class', 'chart treemap-chart')
    .attr('transform', `translate(${translation})`)
  return SVG
}

function treemap (size) {
  const sizeTree = size || SIZE
  return d3.treemap()
    .size(sizeTree)
    .paddingOuter(1)
    .paddingRight(2)
    .round(true)
    .tile(d3.treemapResquarify)
}

function drawTreemap (params) {
  const {
    container,
    tree,
    fill,
  } = params

  const nodes = container.selectAll('g')
    .data(tree.leaves())
    .enter()
    .append('g')
    .attr('transform', d => `translate(${[d.x0, d.y0]})`)

  nodes.append('rect')
    .attr('class', 'tree-leaves')
    .attr('width', 0)
    .attr('height', 0)
    .transition()
    .duration(3000)
    .delay(1000)
    .attr('width', d => Math.max(0, d.x1 - d.x0))
    .attr('height', d => Math.max(0, d.y1 - d.y0))
    .attr('fill', fill)
  return nodes
}

module.exports.hierarchy = hierarchy
module.exports.defineSVG = defineSVG
module.exports.treemap = treemap
module.exports.drawTreemap = drawTreemap
