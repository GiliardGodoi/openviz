
const localeFormat = d3.formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['R$', ''],
  numerals: ['0', '1', '2', '3','4', '5', '6', '7', '8', '9'],
  percent: '%',
})

const localeTimeFormat = d3.timeFormatLocale({
  dateTime: '%a %b %e %X %Y',
  date: '%m/%d/%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
})

const formatMillisecond = localeTimeFormat.format('.%L')
const formatSecond = localeTimeFormat.format(':%S')
const formatMinute = localeTimeFormat.format('%I:%M')
const formatHour = localeTimeFormat.format('%I %p')
const formatDay = localeTimeFormat.format('%a %d')
const formatWeek = localeTimeFormat.format('%b %d')
const formatMonth = localeTimeFormat.format('%B')
const formatYear = localeTimeFormat.format('%Y')

const multiFormat = function multiFormat (date) {
  if (d3.timeSecond(date) < date) {
    return formatMillisecond(date)
  } else if (d3.timeMinute(date) < date) {
    return formatSecond(date)
  } else if (d3.timeHour(date) < date) {
    return formatMinute(date)
  } else if (d3.timeDay(date) < date) {
    return formatHour(date)
  } else if (d3.timeMonth(date) < date) {
    if (d3.timeWeek(date) < date) {
      return formatDay(date)
    }
    return formatWeek(date)
  } else if (d3.timeYear(date) < date) {
    return formatMonth(date)
  }
  return formatYear(date)
}

module.exports.localeFormat = localeFormat
module.exports.localeTimeFormat = localeTimeFormat
module.exports.multiFormat = multiFormat
