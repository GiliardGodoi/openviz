import DistribuicaoLicitacaoAno from './charts/DistribuicaoLicitacaoAno'
import DiferencaEntreValorEditalAdjudicado from './charts/DiferencaEntreValorEditalAdjudicado'
import QuantidadeLicitacoes from './charts/QuantidadeLicitacoes'
import TreemapProcedimentosLicitacao from './charts/TreemapProcedimentosLicitacao'
import { validateParams } from './viz/utils/validators'

const graficos = [
  new DistribuicaoLicitacaoAno(),
  new DiferencaEntreValorEditalAdjudicado(),
  new QuantidadeLicitacoes(),
  new TreemapProcedimentosLicitacao(),
]

const submitForm = function submitForm (params) {
  const { cdIBGE, nrAno, ...dataReq } = params
  const url = `http://localhost:8080/licitacoes/${cdIBGE}/${nrAno}`
  $.getJSON(
    url,
    dataReq,
    (response, status) => {
      if (status === 'success') {
        if (response.success) {
          const { data } = response
          graficos.forEach(grafico => grafico.build(data))
        }
      }
    }
  )
}

/** Cria autocomplete para o campo #_inputMunicipio
 * Ver também:
 *  - enableAutocomplete
 *  - disableAutocomplete
 */
const defineAutocomplete = function defineAutocomplete () {
  $('#_inputMunicipio').autocomplete({
    source: null,
    delay: 300,
    minLength: 2,
    appendTo: '#autocompleteMunicipio',
    classes: {
      'ui-menu': 'list-group',
      'ui-menu-item': 'list-group-item',
    },
    disabled: true,
    select: (event, ui) => {
      const inputCodIBGE = $('#_inputCodIBGE')
      if (ui.item.id) {
        inputCodIBGE.val(ui.item.id)
      } else {
        throw ErrorEvent('Não foi possivel atribuir valor para inputCodIBGE')
      }
    },
  })
}

const defineDatepicker = function defineDatepicker () {
  $('#_inputDataEditalMin, #_inputDataEditalMax, #_inputDataAberturaMin, #_inputDataAberturaMax')
    .datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      showOtherYears: false,
      selectOtherYears: false,
      changeMonth: true,
      changeYear: false,
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      dateFormat: 'dd/mm/yy',
      disabled: true,
    })
}

/**
 * Habilita mascara para input #_inputVlLicitacao
 * No objeto options pode ser configurados os seguintes eventos:
 * onChange: function (value, event, input, options)
 * onKeyPress
 * onComplete
 * onInvalid
 * Referencia [jquery.mask](https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html)
 */
const enableMaskOnInputVlLicitacao = function maskOnInputVlLicitacao () {
  const options = {
    reverse: true,
  }
  $('#_inputValorLicitacaoMin, #_inputValorLicitacaoMax').mask('000.000.000.000.000,00', options)
}

const enableDatepicker = function datepickerActive (params) {
  const ano = Number(params.ano)
  if (ano) {
    const minDate = new Date(ano, 0, 1)
    const maxDate = new Date(ano, 11, 31)
    $('#_inputDataEditalMin, #_inputDataEditalMax, #_inputDataAberturaMin, #_inputDataAberturaMax')
      .datepicker('option', {
        minDate,
        maxDate,
      })
    $('#_inputDataEditalMin, #_inputDataAberturaMin')
      .datepicker('option', { defaultDate: minDate })
    $('#_inputDataEditalMax, #_inputDataAberturaMax')
      .datepicker('option', { defaultDate: new Date(ano, 11, 1) })
  }
  $('#_inputDataEditalMin, #_inputDataEditalMax, #_inputDataAberturaMin, #_inputDataAberturaMax')
    .datepicker('option', 'disabled', false)
}

const disableDatepicker = function disableDatepicker () {
  $('#_inputDataEditalMin, #_inputDataEditalMax, #_inputDataAberturaMin, #_inputDataAberturaMax')
    .datepicker('option', 'disabled', true)
}

const enableAutocomplete = function enableAutocomplete (params) {
  if (params.source) { $('#_inputMunicipio').autocomplete('option', 'source', params.source) }
  $('#_inputMunicipio').autocomplete('option', 'disabled', false)
}

const disableAutocomplete = function disableAutocomplete () {
  $('#_inputMunicipio').autocomplete('option', 'disabled', true)
}
/**
 * Habilita o formulário para entrada dos dados.
 * @param {*} params O parâmetro deve conter os atributo source e ano no mínimo.
 */
const enableForm = function enableForm (params) {
  const { source, ano } = params
  $('.form-control').attr('readonly', null).attr('disabled', null)
  enableDatepicker({ ano })
  enableAutocomplete({ source })
  enableMaskOnInputVlLicitacao()
}

/* OS EVENTOS DEVEM SER A ÚLTIMA COISA A SEREM DEFINIDAS
 pois eles farão uso de todas as outras funções definidas acima.
*/

/**
 * Evento a ser disparado quando do click do Botão de pesquisa
 */

const eventClickBtnSearch = function eventClickBtnSearch () {
  let params = $('.form-control').serializeArray() || []
  params = params.filter(item => item.value)
    .reduce((previous, item, index) => {
      const current = { ...previous }
      const value = item.value ? item.value : ''
      const name = item.name ? item.name : String(index)
      current[name] = value
      return current
    }, {})
  validateParams(params, submitForm)
}

const eventClickBtnClean = function eventClickBtnClean () {
  $('input.form-control').val(null)
  $('select.form-control').val('blank')
  $('.form-control').not('select#_inputAno').attr('readonly', '')
  $('select#_inputDescricaoModalidade.form-control').attr('disabled', '')

  disableAutocomplete()
  disableDatepicker()
}

const eventOnChangeInputAno = function eventOnChangeInputAno (event) {
  event.preventDefault()
  const input = event.target
  const val = $(input).val()
  const anos = ['2013', '2014', '2015', '2016', '2017']
  if (anos.indexOf(val) >= 0) {
    const url = `http://localhost:8080/licitacao/municipios/${val}`
    $.ajax({
      url,
      dataType: 'json',
      method: 'GET',
    }).done((response) => {
      const source = response.data.municipios
        .map(item => ({ label: item.nmMunicipio, id: item.cdIBGE }))
      enableForm({ source, ano: val })
    }).fail((response, status) => {
      console.log(`request fail: ${url}\nStatus: ${status}`)
    })
  } else {
    throw Error(`não fazer nada por enquanto. valor invalido: ${val}`)
  }
}

window.onload = function onload () {
  // $('#fullpage').fullpage({
  //   scrollBar: true,
  // })
  defineAutocomplete()
  defineDatepicker()
  // Eventos de alguns componentes devem ser definidos uma única vez
  $('#_btnSearch').click(eventClickBtnSearch)
  $('#_btnClean').click(eventClickBtnClean)
  $('#_inputAno').change(eventOnChangeInputAno)
  // submitForm({
  //   cdIBGE: '412410',
  //   nrAno: '2017',
  // })
}
