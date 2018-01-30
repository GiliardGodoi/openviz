export default class ChartTable {
  constructor () {
    this.data = []
    this.wrapper = ''
    this.columnNames = []
    this.columnLabels = []
    this.table = null
  }

  setData (data) {
    this.data = data
    return this
  }

  setColumnNames (column) {
    this.columnNames = column
    return this
  }

  setColumnLabels (labels) {
    this.columnLabels = labels
    return this
  }

  drawAt (container = null) {
    if (!container) throw TypeError('Parametro invalido!')
    this.wrapper = container
    this.table = d3.select(this.wrapper).append('table').attr('class', 'table table-hover')
    return this
  }

  drawHead () {
    this.table.append('thead')
      .append('tr')
      .selectAll('th')
      .data(this.columnNames)
      .enter()
      .append('th')
      .text(d => d)
    return this
  }

  drawBody () {
    const labels = this.columnLabels
    function drawRows (d) {
      d3.select(this)
        .selectAll('td')
        .data(labels)
        .enter()
        .append('td')
        .text(label => d[label])
    }
    this.table.append('tbody')
      .selectAll('tr')
      .data(this.data)
      .enter()
      .append('tr')
      .each(drawRows)
    return this
  }
}
