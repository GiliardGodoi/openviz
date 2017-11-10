import Formatter from "./formatter.js";


export default class ScatterPlot {
    constructor(container = ""){
        
        this._data_ = null;
        this.width;
        this.height
        this.margin;

        this.chartGroup;
        this.circleGroup;
        this.svg;

        this.xScale;
        this.yScale;
        this.colorScale;
        this.radiusScale;

        this.colorSchema = ["#1abc9c", "#2ecc71","#3498db","#f1c40f","#e74c3c", "#8e44ad"];
        this.colorDomain;
        this.yDomain;
        this.xDomain;

        this.xAxis;
        this.yAxis;
        this.isLogScale = true;

        this.ordinalLegend;
        this.svgLegend;

        this.format = new Formatter();

        this.defaultOpacityCircle = 0.5;
    }

    _x_(d){
        return d['dtEdital'];
    }

    _y_(d){
        return d["vlLicitacao"] ;
    }

    _color_(d){
        return d['dsModalidadeLicitacao'];
    }

    _r_(d){
        return 4;
    }

    _key_(d){
        return d["idLicitacao"];
    }



    data(data){
        if(!data){
            return this._data_;
        }else{
            this._data_ = data.map(this.convertDate);
            this._defineColorDomain();
            this._defineXDomain();
            this._defineYDomain();
        }
    }

    _defineYDomain(){
        this.yDomain = [1, d3.max(this._data_, d=> this._y_(d) )];
    }

    _defineXDomain(){
        let extent = d3.extent(this._data_, d => this._x_(d) );
        let newYear =  d3.timeYear(extent[0]); 
        this.xDomain = [];
        this.xDomain[0] = newYear;
        this.xDomain[1] = d3.timeYear.offset(newYear);
    }

    _defineColorDomain(){
        this.colorDomain = this._data_.map( item => this._color_(item) ).filter((item, index, array) => {
            return array.indexOf(item) === index;
        }).sort( (a,b) => {
            return a - b;
        })
    }


    init(){
        this.initMargin();
        this.initSVGElements();
        this.initScale();
        this.initLegend();
    }

    initMargin(){
        this.margin = {top: 20, right: 10, bottom: 60, left: 80};
        this.width = 750 - this.margin.left - this.margin.right;
        this.height = 450 - this.margin.top - this.margin.bottom;
    }

    initSVGElements(){
        this.svg = d3.select("#chart").append("svg").attr("width", (this.width + this.margin.left + this.margin.right)).attr("height",(this.height + this.margin.top + this.margin.bottom));
        this.chartGroup = this.svg.append("g").attr("class", "group-chart").attr("transform", "translate("+[this.margin.left,this.margin.top]+")");

        let clip = this.svg.append("defs")
                        .append("svg:clipPath")
                        .attr("id","clip")
                        .append("svg:rect")
                        .attr("width", this.width+10)
                        .attr("height", this.height+10)
                        .attr("x",-5)
                        .attr("y",-5);
        
        this.circleGroup = this.chartGroup.append("g")
                        .attr("clip-path", "url(#clip)")
                        .style("clip-path", "url(#clip)")
                        .attr("class","circleGroup");
    }

    initScale(){
        this.yScale = d3.scaleLog().range([this.height,0]);
        this.xScale = d3.scaleTime().range([0, this.width]);
        
        this.colorScale = d3.scaleOrdinal().range(this.colorSchema);

        this.radiusScale = function(d){ return 4; };
    }

    initLegend(){
        this.ordinalLegend = d3.legendColor().shape("circle").title("Legenda - Modalidades Licitação").scale(this.colorScale);
    }

    draw(){
        if(!this.data){
            console.log("data is not defined");
            return;
        }
                
        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);
        this.colorScale.domain(this.colorDomain);

        // xAxis
        this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat( this.format.getTimeFormat() );
        
        this.chartGroup.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate("+[0,(this.height + 5)]+")")
                .call(this.xAxis);
        // yAxis
        let interpolate = d3.interpolateRound(this.yDomain[0],this.yDomain[1]);
        this.yAxis = d3.axisLeft().scale(this.yScale).ticks(5).tickFormat( this.format.localeFormat.format("$,.2f"))//.tickValues([0,0.01,0.15,0.2,0.75,1].map(i => interpolate(i) ));
        console.log(this.yAxis.tickArguments());
        this.chartGroup.append("g")
                .attr("class", "axis axis-y")
                .attr("transform", "translate(0,0)")
                .call(this.yAxis);

        this.drawMarks();

        this.svgLegend = d3.select("#legend-display")
                            .append("svg")
                            .attr("height", 200)
                            .append("g")
                            .attr("class", "lengenda")
                            .attr("transform", "translate(20,20)")
                            .call(this.ordinalLegend);
    }

    drawMarks(){
        if(!this.data){
            console.log("data is not defined");
            return;
        }

        let bubbles = this.circleGroup.selectAll(".bubbles").data(this._data_, d => this._key_(d) );
        
        // UPDATE
        bubbles.transition()
                .ease(d3.easeSinInOut)
                .duration(750)
                .attr("cx", d => xScale(x(d)) )
                .attr("cy", d => yScale(y(d)) );
        
        //ENTER
        bubbles.enter()
                .append("circle")
                .attr("class", d => ("bubbles "+this.mapCodeToLetter(this._key_(d)) ))
                .attr("cx", d => this.xScale(this._x_(d)) )
                .attr("cy", this.height )
                .attr("r", 0 )
                .style("fill", d => this.colorScale(this._color_(d)))
                .transition()
                .duration(750)
                .attr("cx", d => this.xScale(this._x_(d)) )
                .attr("cy", d => this.yScale(this._y_(d)) )
                .attr("r",  d => this.radiusScale(this._r_(d)) )
                .style("fill", d => this.colorScale(this._color_(d)))
                .style("opacity", this.defaultOpacityCircle );
        
        // EXIT
        bubbles.exit().remove();
    }

    //HELPERS FUNCTIONS
    convertDate(d){
        d["dtEdital"] = new Date(d["dtEdital"])
        d["dtAbertura"] = new Date(d["dtAbertura"])
    
        return d;
    }

    mapCodeToLetter(codigo){
        const letter = ['A','B','C','D','E','F','G','H','I','J'];
        let number
        let word = '';
        for(let i = 0; i < codigo.length; i++) word += letter[+codigo[i]]
        return word;
    }

}