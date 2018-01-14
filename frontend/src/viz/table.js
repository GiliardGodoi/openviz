
export default class ChartTable {
  constructor () {
    this.data = []
    this.wrapper = ''
    this.columnNames = []
    this.columnLabels = []
  }

  setData (data) {
    this.data = data
  }

  setColumnNames (column) {
    this.columnNames = column
  }
}
