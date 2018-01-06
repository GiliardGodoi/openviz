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

const actionAutocomplete = function actionAutocomplete (params) {
  const source = [
    { label: 'SANTO ANTÔNIO DA PLATINA', id: '412410' },
    { label: 'JACAREZINHO', id: '411180' },
    { label: 'WENCESLAU BRAZ', id: '412850' },
    { label: 'CORNÉLIO PROCÓPIO', id: '410640' },
  ]

  $('#_inputMunicipio').autocomplete({
    source,
    delay: 500,
    minLength: 3,
  })
}

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


const enableForm = function enableForm (params) {
  $('.form-control').attr('readonly', null).attr('disabled', null)
  enableDatapicker()
  enableMaskOnInputVlLicitacao()
}

window.onload = function onload () {
  $('#fullpage').fullpage({
    scrollBar: true,
  })
  $('#_btnSearch').click(enableForm)
  $('#_btnSearch').click(eventClickBtnSearch)
  $('#_btnClean').click(eventClickBtnClean)
  $('#_inputAno').change(eventOnChangeInputAno)
}
