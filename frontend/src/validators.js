import { isNaN } from 'util'
/*
 * RULES
 */
const hasSpecialCharacter = valor => /[\{\[\($%&*\\/\)\]\}]/gi.test(valor)
const isDefinedYear = year => ['2013', '2014', '2015', '2016', '2017'].indexOf(year) >= 0
const isDefinedValueForDsModalidade = valor => ['blank', '1', '2', '3', '4', '5', '6'].indexOf(valor) >= 0
const isntNullValue = value => value !== null
const isntNaNValue = value => !(isNaN(value))
const isntEmpty = value => value.length !== 0

/**
 * Mostra uma messagem sobre o erro de validação especifico.
 * @param {string} message Mensagem a ser exibida
 * @param {string} inputID ID do elemento para mostrar a mensagem
 */
const showMessage = function showMessage (message, inputID) {
  const element = $(inputID)
  if (element) element.focus()
  alert(`Mensagem de Validação:\n${message}`)
}

export function testCodIBGE (cdIBGE = '') {
  return true
}

/**
 * Valida se o parâmetro nrAno está definido entre os anos de pesquisa
 * @param {string} nrAno
 */
export function testNroAno (nrAno) {
  if (isDefinedYear(nrAno)) {
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
    showMessage('O campo Descrição do Objeto não deve contér caracteres especiais', '#_inputDescricaoObjeto')
    return false
  }
  return true
}

export function testVlLicitacao (params) {
  return true
}

export function testDtEdital (params) {
  return true
}

export function testDtAbertura (params) {
  return true
}
