// import ScatterPlot from './chart/scatterplot'
// import BubblePack from './chart/bubblepack'
// import Treemap from './chart/treemap'
// import Bubbleforce from './chart/bubbleforce'
// import ClusterForce from './chart/clusterforce'
// import Barchart from './chart/barchartmultiple'

const compareStringValuesAsDate = function compareStringValuesAsDate (dtOne, dtTwo) {
  return false
}

const submit = function submit (params) {

}

const submitForm = function submitForm (params) {

}

const submitInputNroAno = function submitInputNroAno (params) {

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

<<<<<<< HEAD
/** Habilita mascara para input #_inputVlLicitacao
=======
/** Referência para jquery.mask
 * https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html
>>>>>>> cf6368ec34bae3c32915485743dc10941570c66d
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

const eventClickBtnSearch = function eventClickBtnSearch () {
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
      console.log(response)
    }).fail((response, status) => {
      console.log(`request fail: ${url}\nStatus: ${status}`)
    })
  } else {
    console.log(`não fazer nada por enquanto. valor invalido: ${val}`)
  }
}

// const eventChangeInputVlLicitacao = function eventChangeInputVlLicitacao (event) {

// }

// const eventChangeInputsDate = function eventChangeInputsDate (event) {

// }

const eventActionDrawTable = function eventActionDrawTable (event) {

}

const eventActionDrawChart = function eventActionDrawChart (event) {

}

window.onload = function onload () {
  $('#fullpage').fullpage({
    scrollBar: true,
  })
  defineAutocomplete()
  defineDatepicker()
  // Eventos de alguns componentes devem ser definidos uma única vez
  $('#_btnSearch').click(eventClickBtnSearch)
  $('#_btnClean').click(eventClickBtnClean)
  $('#_inputAno').change(eventOnChangeInputAno)
}
