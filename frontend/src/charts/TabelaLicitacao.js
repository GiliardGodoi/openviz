import ChartTable from '../viz/table'

export default class TabelaLicitacao {
  constructor () {
    this.tabelaLicitacao = new ChartTable()
    this.data = null
    this.columnNames = [
      'Município',
      'Entidade',
      'Modalidade',
      'Nro. Licitação',
      'Descrição do Objeto',
      'Valor da Licitação',
    ]
    this.columnLabel = [
      'nmMunicipio',
      'nmEntidade',
      'dsModalidadeLicitacao',
      'nrLicitacao',
      'dsObjeto',
      'vlLicitacao',
    ]
    this.wrapperthis = 'div.table'
    this.quantidadePorPagina = 50
    this.quantidadePaginas = 1
  }

  setWrapper (container) {
    this.wrapperthis = container
    return this
  }

  build (data) {
    if (!Array.isArray(data)) {
      return this
    }
    this.data = data
    const tamanhoDados = data.length
    this.quantidadePaginas = Math.ceil(tamanhoDados / this.quantidadePorPagina)

    this.tabelaLicitacao
      .setColumnNames(this.columnNames)
      .setColumnLabels(this.columnLabel)
      .drawAt(this.wrapperthis)
      .setData(this.data)
      .drawHead()
      .drawBody()
    return this
  }
}
