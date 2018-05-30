
const modalidades = [
  'Processo Dispensa',
  'Processo Inexigibilidade',
  'Pregão',
  'Tomada de Preços',
  'Convite',
  'Concorrência',
  'Leilão',
  'Concurso',
  'Regime Diferenciado de Contratações - RDC',
]

const colorRange = d3.schemeCategory10

function scaleOrdinalToModalidadeLicitacao () {
  const scale = d3.scaleOrdinal()
    .range(colorRange)
    .domain(modalidades)

  return scale
}

module.exports.modalidadeLicitacaoScale = scaleOrdinalToModalidadeLicitacao
