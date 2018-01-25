/*
 * RULES
 */
const hasSpecialCharacter = valor => /[\{\[\($%&*\\/\)\]\}]/gi.test(valor)
const isDefinedValueForNroAno = year => ['2013', '2014', '2015', '2016', '2017'].indexOf(year) >= 0
const isDefinedValueForDsModalidade = valor => [
  'blank',
  'Processo Dispensa',
  'Processo Inexigibilidade',
  'Pregão', 'Tomada de Preços',
  'Convite',
  'Concorrência',
  'Leilão', 'Concurso',
  'Regime Diferenciado de Contratações - RDC',
].indexOf(valor) >= 0

const isNullValue = value => value === null
const isNaNValue = value => value === Number(NaN)
const isEmpty = value => value.length === 0
const isUndefined = value => value === undefined

const hasBrazilianDateFormat = date => /\d{2}\/\d{2}\/\d{4}/.test(date)
const parseDateFromString = (date) => {
  const day = Number(date.substring(0, 2))
  const month = Number(date.substring(3, 5)) - 1
  const year = Number(date.substring(6))
  return new Date(year, month, day)
}
const compareDates = (dtMin, dtMax) => {
  const dateMin = parseDateFromString(dtMin)
  const dateMax = parseDateFromString(dtMax)
  return dateMin < dateMax
}
/**
 * Mostra uma messagem sobre o erro de validação especifico.
 * @param {string} message Mensagem a ser exibida
 * @param {string} inputID ID do elemento para mostrar a mensagem
 */
const showMessage = function showMessage (message, inputID = null) {
  if (inputID) $(inputID).focus()
  alert(`Mensagem de Validação:\n${message}`)
}

export function testCodIBGE (cdIBGE = '') {
  if (isUndefined(cdIBGE)) {
    showMessage('Look! cdIBGE is undefined')
  }
  if (isNullValue(cdIBGE)) {
    showMessage('Look! cdIBGE is Null')
    return false
  }
  if (isNaNValue(cdIBGE)) {
    showMessage('Look! cdIBGE is NaN')
    return false
  }
  if (isEmpty(cdIBGE)) {
    showMessage('Look! cdIBGE is Empty')
    return false
  }
  if (hasSpecialCharacter(cdIBGE)) {
    showMessage('Look! cdIBGE has special characters')
    return false
  }

  return true
}

/**
 * Valida se o parâmetro nrAno está definido entre os anos de pesquisa
 * @param {string} nrAno
 */
export function testNroAno (nrAno) {
  if (isDefinedValueForNroAno(nrAno)) {
    return true
  }
  showMessage('O parâmetro "Ano" é obrigatório!', '#_inputAno')
  return false
}

/**
 * Valida campo Descricao da Modalidade (dsModalidade).
 * Verifica se o valor passado está dentre os especificados.
 * @param {string} dsModalidade String representando um valor especificado
 */
export function testDsModalidade (dsModalidade) {
  if (isDefinedValueForDsModalidade(dsModalidade)) {
    return true
  }
  showMessage('Valor do campo "Descrição da Modalidade" não é válido', '#_inputDescricaoModalidade')
  return false
}

/**
 * Valida o campo descrição do objeto (dsObjeto) por:
 * @param {string} dsObjeto Descrição do Objeto
 */
export function testDsObjeto (dsObjeto) {
  if (hasSpecialCharacter(dsObjeto)) {
    showMessage('O campo Descrição do Objeto não deve conter caracteres especiais', '#_inputDescricaoObjeto')
    return false
  }
  return true
}

export function testVlLicitacao (params) {
  const { vlLicitacaoMin, vlLicitacaoMax } = params
  if (hasSpecialCharacter(vlLicitacaoMin) &&
      hasSpecialCharacter(vlLicitacaoMax)) {
    showMessage('O campo vlLicitacao não pode ter caracteres especiais', '#_inputVlLicitacaoMin,#_inputVlLicitacaoMax')
    return false
  }
  return true
}

export function testDates (dtMin = '', dtMax = '', callback = () => {}) {
  const dateMin = dtMin
  const dateMax = dtMax
  let validationResultDateMin = true
  let validationResultDateMax = true
  if (dateMin) {
    validationResultDateMin = hasBrazilianDateFormat(dateMin)
  }
  if (dateMax) {
    validationResultDateMax = hasBrazilianDateFormat(dateMax)
  }
  if (validationResultDateMin && validationResultDateMax) {
    return true
  }
  callback()
  return false
}

export function testDtEdital (params) {
  const { dtEditalMin, dtEditalMax } = params
  let validationResult = testDates(dtEditalMin, dtEditalMax, () => {
    showMessage('Look! Data Edital seems invalid!')
  })
  if (dtEditalMin &&
      dtEditalMax &&
      validationResult
  ) {
    validationResult = compareDates(dtEditalMin, dtEditalMax)
    if (validationResult) {
      return true
    }
    showMessage('Look! Data Edital Min é maior que Data Edital Max')
    return false
  }
  return validationResult
}

export function testDtAbertura (params) {
  const { dtAberturaMin, dtAberturaMax } = params
  let validationResult = testDates(dtAberturaMin, dtAberturaMax, () => {
    showMessage('Look! Data Abertura seems invalid!')
  })
  if (dtAberturaMin &&
      dtAberturaMax &&
      validationResult
  ) {
    validationResult = compareDates(dtAberturaMin, dtAberturaMax)
    if (validationResult) {
      return true
    }
    showMessage('Look! Data Abertura Min é maior que Data Abertura Max')
    return false
  }
  return validationResult
}
