import { isNaN, log } from 'util'

/*
 * RULES
 */
const hasSpecialCharacter = valor => /[\{\[\($%&*\\/\)\]\}]/gi.test(valor)
const hasDateFormater = date => /\d{2}\/\d{2}\/\d{4}/.test(date)
const isDefinedValueForNroAno = year => ['2013', '2014', '2015', '2016', '2017'].indexOf(year) >= 0
const isDefinedValueForDsModalidade = valor => ['blank', '1', '2', '3', '4', '5', '6'].indexOf(valor) >= 0
const isNullValue = value => value === null
const isNaNValue = value => (isNaN(value))
const isEmpty = value => value.length === 0
const isUndefined = value => value === undefined

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
    showMessage('Look! cdIBGE is empty')
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

export function testDtEdital (params) {
  const { dtEditalMin, dtEditalMax } = params
  if (hasDateFormater(dtEditalMin) || hasDateFormater(dtEditalMax)) {
    return true
  }
  return false
}

export function testDtAbertura (params) {
  const { dtAberturaMin, dtAberturaMax } = params
  if (hasDateFormater(dtAberturaMin) && hasDateFormater(dtAberturaMax)) {
    log(10)
  }
  return true
}
