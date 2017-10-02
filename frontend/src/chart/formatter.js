

export default class Formatter {
    constructor(){
        this.localeTimeFormat = d3.timeFormatLocale({
            "dateTime" : "%a %b %e %X %Y",
            "date" : "%d/%m/%Y",
            "time" : "%H : %M : %S",
            "periods" : ["AM", "PM"],
            "days" : ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
            "shortDays" : ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            "months" : ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
            "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        });
        this.myFormat = d3.formatLocale({
            "decimal": ",",
            "thousands": ".",
            "grouping": [3],
            "currency": ["R$", ""],
            "dateTime": "%a %b %e %X %Y",
            "date": "%m/%d/%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days" : ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
            "shortDays" : ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            "months" : ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
            "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
          });

          this.formatMillisecond = localeTimeFormat.format(".%L");
          this.formatSecond = localeTimeFormat.format(":%S");
          this.formatMinute = localeTimeFormat.format("%I:%M");
          this.formatHour = localeTimeFormat.format("%I %p");
          this.formatDay = localeTimeFormat.format("%a %d");
          this.formatWeek = localeTimeFormat.format("%b %d");
          this.formatMonth = localeTimeFormat.format("%B");
          this.formatYear = localeTimeFormat.format("%Y");
        
    }

    multiFormat(date){
        return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
    }    
}