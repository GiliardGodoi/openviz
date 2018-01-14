import Formatter from './formatter'


export default class ScatterPlot {
  constructor () {
    this.DATA = null
    this.width = null
    this.height = null
    this.margin = null

    this.chartGroup = null
    this.circleGroup = null
    this.svg = null

    this.xScale = null
    this.yScale = null
    this.colorScale = null
    this.radiusScale = null

    this.colorSchema = ['#1abc9c', '#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#8e44ad']
    this.colorDomain = null
    this.yDomain = null
    this.xDomain = null

    this.xAxis = null
    this.yAxis = null
    this.isLogScale = true

    this.ordinalLegend = null
    this.svgLegend = null

    this.format = new Formatter()

    this.defaultOpacityCircle = 0.5
  }

  x (d) {
    return d.dtEdital
  }

  y (d) {
    return d.vlLicitacao
  }

  color (d) {
    return d.dsModalidadeLicitacao
  }

  r (d) {
    return 4
  }

  key (d) {
    return d.idLicitacao
  }


  data (data) {
    if (!data) {
      return this.DATA
    }
    this.DATA = data.map(this.convertDate)
    this.defineColorDomain()
    this.defineXDomain()
    this.defineYDomain()
    return this
  }

  defineYDomain () {
    this.yDomain = [1, d3.max(this.DATA, d => this.y(d))]
  }

  defineXDomain () {
    const extent = d3.extent(this.DATA, d => this.x(d))
    const newYear = d3.timeYear(extent[0])
    this.xDomain = []
    this.xDomain[0] = newYear
    this.xDomain[1] = d3.timeYear.offset(newYear)
  }

  defineColorDomain () {
    this.colorDomain = this.DATA.map(item => this.color(item))
      .filter((item, index, array) => array.indexOf(item) === index)
      .sort((a, b) => a - b)
  }


  init () {
    this.initMargin()
    this.initSVGElements()
    this.initScale()
    this.initLegend()
  }

  initMargin () {
    this.margin = {
      top: 20, right: 10, bottom: 60, left: 80,
    }
    this.width = 750 - this.margin.left - this.margin.right
    this.height = 450 - this.margin.top - this.margin.bottom
  }

  initSVGElements () {
    this.svg = d3.select('#chart').append('svg').attr('width', (this.width + this.margin.left + this.margin.right)).attr('height', (this.height + this.margin.top + this.margin.bottom))
    this.chartGroup = this.svg.append('g').attr('class', 'group-chart').attr('transform', `translate(${[this.margin.left, this.margin.top]})`)

    this.svg.append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', this.width + 10)
      .attr('height', this.height + 10)
      .attr('x', -5)
      .attr('y', -5)

    this.circleGroup = this.chartGroup.append('g')
      .attr('clip-path', 'url(#clip)')
      .style('clip-path', 'url(#clip)')
      .attr('class', 'circleGroup')
  }

  initScale () {
    this.yScale = d3.scaleLog().range([this.height, 0])
    this.xScale = d3.scaleTime().range([0, this.width])

    this.colorScale = d3.scaleOrdinal().range(this.colorSchema)

    this.radiusScale = function (d) { return 4 }
  }

  initLegend () {
    this.ordinalLegend = d3.legendColor().shape('circle').title('Legenda - Modalidades Licitação').scale(this.colorScale)
  }

  draw () {
    if (!this.data) {
      console.log('data is not defined')
      return
    }

    this.xScale.domain(this.xDomain)
    this.yScale.domain(this.yDomain)
    this.colorScale.domain(this.colorDomain)

    // xAxis
    this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(this.format.getTimeFormat())

    this.chartGroup.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${  [0, (this.height + 5)]  })`)
      .call(this.xAxis)
    // yAxis
    d3.interpolateRound(this.yDomain[0], this.yDomain[1])
    this.yAxis = d3.axisLeft().scale(this.yScale).ticks(5).tickFormat(this.format.localeFormat.format('$,.2f'))// .tickValues([0,0.01,0.15,0.2,0.75,1].map(i => interpolate(i) ));
    console.log(this.yAxis.tickArguments())
    this.chartGroup.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', 'translate(0,0)')
      .call(this.yAxis)

    this.drawMarks()

    this.svgLegend = d3.select('#legend-display')
      .append('svg')
      .attr('height', 200)
      .append('g')
      .attr('class', 'lengenda')
      .attr('transform', 'translate(20,20)')
      .call(this.ordinalLegend)
  }

  drawMarks () {
    if (!this.data) {
      console.log('data is not defined')
      return
    }

    const bubbles = this.circleGroup.selectAll('.bubbles').data(this.DATA, d => this.key(d))

    // UPDATE
    bubbles.transition()
      .ease(d3.easeSinInOut)
      .duration(750)
      .attr('cx', d => this.xScale(this.x(d)))
      .attr('cy', d => this.yScale(this.y(d)))

    // ENTER
    bubbles.enter()
      .append('circle')
      .attr('class', d => (`bubbles ${this.mapCodeToLetter(this.key(d))}`))
      .attr('cx', d => this.xScale(this.x(d)))
      .attr('cy', this.height)
      .attr('r', 0)
      .style('fill', d => this.colorScale(this.color(d)))
      .transition()
      .duration(750)
      .attr('cx', d => this.xScale(this.x(d)))
      .attr('cy', d => this.yScale(this.y(d)))
      .attr('r', d => this.radiusScale(this.r(d)))
      .style('fill', d => this.colorScale(this.color(d)))
      .style('opacity', this.defaultOpacityCircle)

    // EXIT
    bubbles.exit().remove()
  }

  // HELPERS FUNCTIONS
  convertDate (d) {
    d.dtEdital = new Date(d.dtEdital)
    d.dtAbertura = new Date(d.dtAbertura)
    return d
  }

  mapCodeToLetter (codigo) {
    const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    let number
    let word = ''
    for (let i = 0; i < codigo.length; i++) word += letter[+codigo[i]]
    return word
  }
}
