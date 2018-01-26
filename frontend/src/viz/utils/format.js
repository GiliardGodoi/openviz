

export default class Formatter {
  constructor () {
    this.localeTimeFormat = d3.timeFormatLocale({
      dateTime: '%a %b %e %X %Y',
      date: '%d/%m/%Y',
      time: '%H : %M : %S',
      periods: ['AM', 'PM'],
      days: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
      shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    })

    this.localeFormat = d3.formatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['R$', ''],
      dateTime: '%a %b %e %X %Y',
      date: '%m/%d/%Y',
      time: '%H:%M:%S',
      periods: ['AM', 'PM'],
      days: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
      shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    })

    this.formatMillisecond = this.localeTimeFormat.format('.%L')
    this.formatSecond = this.localeTimeFormat.format(':%S')
    this.formatMinute = this.localeTimeFormat.format('%I:%M')
    this.formatHour = this.localeTimeFormat.format('%I %p')
    this.formatDay = this.localeTimeFormat.format('%a %d')
    this.formatWeek = this.localeTimeFormat.format('%b %d')
    this.formatMonth = this.localeTimeFormat.format('%B')
    this.formatYear = this.localeTimeFormat.format('%Y')
  }

  multiFormat (date) {
    const _this = this
    return (d3.timeSecond(date) < date ? _this.formatMillisecond
      : d3.timeMinute(date) < date ? _this.formatSecond
        : d3.timeHour(date) < date ? _this.formatMinute
          : d3.timeDay(date) < date ? _this.formatHour
            : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? _this.formatDay : _this.formatWeek)
              : d3.timeYear(date) < date ? _this.formatMonth
                : _this.formatYear)(date)
  }

  getFormater (spec) {
    return this.localeFormat.format(spec)
  }

  getTimeFormat () {
    const _this = this
    return function muiltiTimeFormat (date) {
      return (d3.timeSecond(date) < date ? _this.formatMillisecond
        : d3.timeMinute(date) < date ? _this.formatSecond
          : d3.timeHour(date) < date ? _this.formatMinute
            : d3.timeDay(date) < date ? _this.formatHour
              : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? _this.formatDay : _this.formatWeek)
                : d3.timeYear(date) < date ? _this.formatMonth
                  : _this.formatYear)(date)
    }
  }
}
