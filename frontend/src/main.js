// import ScatterPlot from "./chart/scatterplot.js"
// import BubblePack from "./chart/bubblepack.js"
// import Treemap from "./chart/treemap.js"
// import Bubbleforce from "./chart/bubbleforce.js"
// import ClusterForce from "./chart/clusterforce.js"
// import Barchart from './chart/barchartmultiple.js'

const drawTable = function drawTable () {

}

const drawChart = function drawChart () {
  const nome = 'grafico de barras'
  return nome
}


const logger = function logger (message) {
  const print = true
  if (print) console.log(message)
}

const btnCleanAction = function btnCleanAction () {
  $('select.form-control').val('invalid')
  $('input.form-control').val(null)
}

const btnSearchAction = function btnSearchAction () {
  const params = $.param($('.form-control'))
  console.log(params)
}

const inputMaskToMoney = function inputMaskToMoney (event) {
  event.preventDefault();
  let letsKeyPressed = event.key
  let target = $(event.target)
  let val = target.val()
    
  if (letsKeyPressed >= 0 || letsKeyPressed <= 9) {
    logger(`last key pressed: ${letsKeyPressed}`)
    target.val(val + letsKeyPressed)
  }
}

const autocompleteActive = function autocompleteActive () {
  const source = [
    { label: 'SANTO ANTÔNIO DA PLATINA', id: '412410' },
    { label: 'JACAREZINHO', id: '411180' },
    { label: 'WENCESLAU BRAZ', id: '412850' },
    { label: 'CORNÉLIO PROCÓPIO', id: '410640' }
  ]

  $('#_inputMunicipio').autocomplete({
    source,
    delay: 500,
    minLength: 3,
  })
}

const inputMaskToMoneyActive = function inputMaskToMoneyActive () {
  $('#_inputValorLicitacaoMin, #_inputValorLicitacaoMax').keydown(inputMaskToMoney)
}

const datepickerActive = function datepickerActive () {
  $('#_inputDataEditalMin, #_inputDataEditalMax, #_inputDataAberturaMin, #_inputDataAberturaMax')
    .datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      showOtherYears: true,
      selectOtherYears: true,
      changeMonth: true,
      changeYear: true,
      minDate: new Date(2013, 0, 1),
      maxDate: new Date(),
      dateFormat: 'dd/mm/yy',
    })
}

window.onload = function onload () {
  $('#fullpage').fullpage({
    scrollBar: true,
  })
  $(datepickerActive)
  $(autocompleteActive)
  $(inputMaskToMoneyActive)

  $('#_btnClean').click(btnCleanAction)
  $('#_btnSearch').click(drawChart)
}
