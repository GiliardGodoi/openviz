import { isFunction } from "util";

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

const defineAutocomplete = function defineAutocomplete () {
  $('#_inputMunicipio').autocomplete({
    source: null,
    delay: 300,
    minLength: 2,
    classes: {
      'ui-menu': 'list-group',
      'ui-menu-item': 'list-group-item',
    },
    disabled: true,
  })
}

/** Referência para jquery.mask
 * https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html
 * No objeto options pode ser configurados os seguintes eventos:
 * onChange: function (value, event, input, options)
 * onKeyPress
 * onComplete
 * onInvalid
 */
const enableMaskOnInputVlLicitacao = function maskOnInputVlLicitacao () {
  const options = {
    reverse: true,
  }
  $('#_inputValorLicitacaoMin, #_inputValorLicitacaoMax').mask('000.000.000.000.000,00', options)
}

const enableDatapicker = function datepickerActive (ANO = '2013') {
  $('#_inputDataEditalMin, #_inputDataEditalMax, #_inputDataAberturaMin, #_inputDataAberturaMax')
    .datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      showOtherYears: false,
      selectOtherYears: false,
      changeMonth: true,
      changeYear: true,
      minDate: new Date(ANO, 0, 1),
      maxDate: new Date(ANO, 11, 31),
      defaultDate: new Date(ANO, 0, 1),
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      dateFormat: 'dd/mm/yy',
    })
}

const enableAutocomplete = function enableAutocomplete (
  source,
  callback = null
) {
  $('#_inputMunicipio').autocomplete('option', 'source', source)
  $('#_inputMunicipio').autocomplete('option', 'disabled', false)
  if (isFunction(callback)) {
    callback()
  }
}

const disableAutocomplete = function disableAutocomplete () {
  $('#_inputMunicipio').autocomplete('option', 'disabled', true)
}

const enableForm = function enableForm (params) {
  $('.form-control').attr('readonly', null).attr('disabled', null)
  enableDatapicker()
  enableMaskOnInputVlLicitacao()
}

/* OS EVENTOS DEVEM SER A ÚLTIMA COISA A SEREM DEFINIDAS
 pois eles farão uso de todas as outras funções definidas acima.
*/

const eventClickBtnSearch = function eventClickBtnSearch () {
  let values = $('.form-control').serializeArray() || []
  values = values.reduce((previous, current, index) => {
    const key = current.name ? current.name : index
    const newObj = { ...previous }
    if (current.value) {
      newObj[key] = current.value
    }
    return newObj
  }, {})
}

const eventClickBtnClean = function eventClickBtnClean () {
  $('input.form-control').val(null)
  $('select.form-control').val('blank')
  $('.form-control').not('select#_inputAno').attr('readonly', '')
  $('select#_inputDescricaoModalidade.form-control').attr('disabled', '')
  $('#_inputDataEditalMin, #_inputDataEditalMax, #_inputDataAberturaMin, #_inputDataAberturaMax').datepicker('destroy')

  disableAutocomplete()
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
      enableAutocomplete(source, enableForm)
      console.log(response)
    }).fail((response, status) => {
      console.log(`request fail: ${url}\nStatus: ${status}`)
    })
  } else {
    console.log(`não fazer nada por enquanto. valor invalido: ${val}`)
  }
}

const eventChangeInputVlLicitacao = function eventChangeInputVlLicitacao (event) {

}

const eventChangeInputsDate = function eventChangeInputsDate (event) {

}

const eventActionDrawTable = function eventActionDrawTable (event) {

}

const eventActionDrawChart = function eventActionDrawChart (event) {

}

window.onload = function onload () {
  $('#fullpage').fullpage({
    scrollBar: true,
  })
  defineAutocomplete()
  $('#_btnSearch').click(eventClickBtnSearch)
  $('#_btnClean').click(eventClickBtnClean)
  $('#_inputAno').change(eventOnChangeInputAno)
}
