
export default class BarChartModalidadeAoLongoAno {
    constructor(){
        this._data_ = null;
        this._meses_ = ['jan', 'fev', 'mar', 'abr', 'maio', 'jun', 'jul', 'ago', 'set', 'out','nov', 'dez']
        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];

        this.width = 900;
        this.height = 600;
        this.miniHeight = null;
        this.miniWidth = null;
        this.padding = 2;

        this.svg = null;

        this.xDomain = null;
        this.yDomain = null;

        this.colorScale = null;
        this.yScale = null;
        this.xScale = null;
    }

    _defineMiniChartSize(){
        this.miniWidth = Math.min(Math.floor(this.width / 4),200)
        this.miniHeight = Math.min(Math.floor(this.height / 3 ),160 )
    }

    _defineYDomain(data){
        let maxNumber = tree.reduce( function(previous, current, index){
            let numArray = current.values.map(item => item.value ).map(item => item.quantidade )
            let maxOfNumArray = Math.max.apply(null,numArray);
            if(previous < maxOfNumArray) previous = maxOfNumArray;
            return previous;
        }, 0);

        this.yDomain = [0, maxNumber]
    }

    _defineYScale(){
        this.yScale = d3.scaleLinear().domain(this.yDomain).range([])
    }

    _defineXScale(){
        
    }

    _y(v){
        return (v.value.quantidade % 2 ? 50 : 25) + 15;
    }

    _x(v){
        return 0;
    }

    data(data){
        this._modalidades_ = d3.set(data, d => d['dsModalidadeLicitacao']).values();
        this._data_ = d3.nest()
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
        console.log(data);
        // console.log(this._data_);
        // console.log(this._modalidades_);
    }
    
    init(){
        this.svg = d3.select("#chart")
                    .append("svg")
                        .attr("width", (this.width))
                        .attr("height",(this.height))
                    .append("g")
                        .attr("class", "group-chart");
        this.colorScale = d3.scaleOrdinal().domain(this._modalidades_).range(this.colorSchema);
    }

    draw(){
        let _this = this;
        let innerWidth = Math.min(Math.floor(this.width / 4),200)
        let innerHeight = Math.min(Math.floor(this.height / 3 ),160 )
        this.svg.selectAll("g")
                .data(this._data_)
                .enter()
                .append("g")
                .attr("class", "mini-chart")
                .each( function(d, i){
                    let x = (i % 4);
                    let y = (i - x) % 3;
                    let mini = d3.select(this);
                    mini.attr("transform", "translate("+[(innerWidth * x), (innerHeight * y) ]+")");
                    mini.append("rect").attr("width", innerWidth).attr("height", innerHeight)
                        .attr("fill", (x+y) % 2 ? "yellow" : "steelblue" )
                    // mini.selectAll("rect")
                    //     .data(d.values )
                    //     .enter()
                    //     .append("rect")
                    //     .attr("x", (v, i) => 31 * i )
                    //     .attr("y", (v, i) => {
                    //         return innerHeight - _this._y(v);
                    //     })
                    //     .attr("width", 30 )
                    //     .attr("height", v => _this._y(v) )
                    //     .attr("fill", v => _this.colorScale(v.key));
                    // console.log(`(x: ${x}, y: ${y})`);
                    console.log(d);
                });
    }
}