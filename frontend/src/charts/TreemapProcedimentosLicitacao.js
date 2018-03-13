import {
  hierarchy,
  treemap,
  drawTreemap,
  defineSVG,
} from '../viz/treemap'
import { modalidadeLicitacaoScale } from '../viz/utils/categoricalScaleToModalidadeLicitacao'

export default class TreemapProcedimentosLicitacao {
  constructor () {
    this.IDContainer = '#treemapProcedimentosLicitacao'
    this.size = {
      width: 700,
      height: 500,
    }

    this.margin = {
      top: 50,
      right: 10,
      bottom: 20,
      left: 80,
    }
    this.init()
  }

  init () {
    const widthSVG = this.size.width + this.margin.left + this.margin.right
    const heightSVG = this.size.height + this.margin.top + this.margin.bottom
    const translation = [this.margin.left, this.margin.top]
    this.SVG = defineSVG({
      translation,
      selector: this.IDContainer,
      size: {
        width: widthSVG,
        height: heightSVG,
      },
    })

    this.nest = d3.nest()
      .key(d => d.dsModalidadeLicitacao)
      .key(d => d.nmEntidade)
  }

  prepareData (data) {
    const entries = this.nest.entries(data)
    const object = entries.reduce((prev, atual) => {
      prev.values.push(atual)
      return prev
    }, { key: 'root', values: [] })
    return hierarchy({
      data: object,
      children: d => d.values,
      sum: d => d.vlLicitacao,
      sort: (a, b) => b.data.vlLicitacao - a.data.vlLicitacao,
    })
  }

  build (data) {
    const { size } = this
    const color = modalidadeLicitacaoScale()
    const nodes = this.prepareData(data)
    const root = treemap([size.width, size.height])(nodes)
    drawTreemap({
      container: this.SVG,
      tree: root,
      fill: (d) => {
        const modalidade = d.data.dsModalidadeLicitacao
        return color(modalidade)
      },
    })
  }
}
