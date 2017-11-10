/**
 * Classe para construir Multiplos Gráficos de barras
 */

export default class BarChart {
    constructor() {
        this._startingAt = "#chart";

        this._data = null;
        this._modalidades = null;
        
        this._meses = ['jan', 'fev', 'mar', 'abr', 'maio', 'jun', 'jul', 'ago', 'set', 'out','nov', 'dez']
        

        this._width = 900;
        this._height = 600;
        this._innerHeight = null;
        this._innerWidth = null;
        this._padding = 2;

        this._svg = null;

        this._colorRange = null;
        this._yRange = null;
        this._xRange = null;

        this._xDomain = null;
        this._yDomain = null;
        this._colorDomain = null;

        this._colorScale = null;
        this._yScale = null;
        this._xScale = null;
    }

    _x(d) {
        return d.key;
    }

    _y(d) {
        return d.value.quantidade;
    }

    _color(d) {
        return d.key;
    }

    _key(d) {
        return null;
    }

    createAt(startingPoint) {
        this._startingAt = startingPoint;
        return this;
    }

    setSize(sizeChart = []) {
        this._width = sizeChart[0];
        this._height = sizeChart[1];

        return this;
    }

    setMargin(margin = {}) {
        return this;
    }

    setData(data) {
        this._modalidades = d3.set(data, d => d['dsModalidadeLicitacao']).values();

        this._data = d3.nest()
                        .key( d => {
                            let day = new Date(d.dtEdital);
                            return day.getMonth();
                            // return this._meses_[day.getMonth()];
                        })
                        .sortKeys( (a,b) => Number(a) - Number(b)  ) //d3.ascending
                        .key( d => {
                            return d["dsModalidadeLicitacao"]
                        })
                        .rollup( values => {
                            return {
                                "quantidade" : values.length,
                                "totalLicitado"   : d3.sum(values, d => d['vlLicitacao']),
                                "totalAdquirido"  : d3.sum(values, d => d["vlTotalAdquiridoLicitacao"])
                            }
                        })
                        .entries(data);
        return this;
    }

    _defineInnerChartSize() {
        this._innerWidth = Math.min(Math.floor(this._width / 4),200);
        this._innerHeight = Math.min(Math.floor(this._height / 3 ),160 );
    }

    _defineInputDomain(data) {
        this._colorDomain = this._modalidades;
        this._xDomain = this._modalidades;

        /** defining the y domain for inners charts
         * Primeiro iremos encontrar o maior valor entre todas as quantidades de licitações entre todos os meses
         * Lembre-se que data possui uma estrutura hierárquica devido ao processamento feito em {setData}
        */
        let maxNumber = data.reduce( function(previous, current, index){
            let numArray = current.values.map(item => item.value ).map(item => item.quantidade )
            let maxOfNumArray = Math.max.apply(null,numArray);
            if(previous < maxOfNumArray) previous = maxOfNumArray;
            return previous;
        }, 0);
        this._yDomain = [0,maxNumber];
    }

    _defineOutputRange() {
        this._colorRange = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
        this._xRange = [0,this._innerWidth];
        this._yRange = [0, (this._innerHeight - 10)];
    }

    _defineScales() {
        this._colorScale = d3.scaleOrdinal().domain(this._colorDomain).range(this._colorRange);

        this._yScale = d3.scaleLinear().domain(this._yDomain).range(this._yRange);

        this._xScale = d3.scaleBand().domain(this._xDomain).range(this._xRange);
    }

    _defineAxis() {
        
    }

    _createSVGElement() {
        this.svg = d3.select(this._startingAt)
        .append("svg")
            .attr("width", this._width)
            .attr("height", this._height )
        .append("g")
            .attr("class", "group-chart");
    }

    _drawAxisElement() {

    }

    _drawChartElements() {
        let _this = this;
        this.svg.selectAll("g")
                .data(this._data)
                    .enter()
                .append("g")
                    .attr("class", "mini-chart")
                    .each( function(d, i){
                                let x = (i % 4);
                                let y = (i - x) % 3;
                                let mini = d3.select(this);
                                mini.attr("transform", "translate("+[(_this._innerWidth * x), (_this._innerHeight * y) ]+")");
                                // mini.append("rect").attr("width", innerWidth).attr("height", innerHeight)
                                //     .attr("fill", (x+y) % 2 ? "yellow" : "steelblue" )

                                // mini.append("g").attr("transform", "translate(15,30)").append("text").text(_this._meses[d.key])

                                mini.selectAll("rect")
                                        .data(d.values)
                                        .enter()
                                    .append("rect")
                                        .attr("x", (v, i) => _this._xScale(_this._x(v)) )
                                        .attr("y", (v, i) => {
                                            return _this._innerHeight - _this._yScale(_this._y(v));
                                            // return _this._yScale(_this._y(v));
                                        })
                                        .attr("width", 30 )
                                        .attr("height", v => _this._yScale(_this._y(v)) )
                                        .attr("fill", v => _this._colorScale(_this._color(v) ) );
                        console.log(`(x: ${x}, y: ${y})`);

                    });
    }

    draw() {
        this._defineInnerChartSize();
        this._defineInputDomain(this._data);
        this._defineOutputRange();
        this._defineScales();
        this._defineAxis();

        this._createSVGElement();
        this._drawAxisElement();
        this._drawChartElements();
    }



}
