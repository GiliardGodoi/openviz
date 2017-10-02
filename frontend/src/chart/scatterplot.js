import formatter from "./formatter.js";


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

        this.colorDomain;

        this.xAxis;
        this.yAxis;

        this.defaultOpacityCircle = 0.5;
    }

    x(d){
        return d['dtEdital'];
    }

    y(d){
        return d["vlLicitacao"] ;
    }

    color(d){
        return d['dsModalidadeLicitacao'];
    }

    r(d){
        return 4;
    }

    key(d){
        return d["idLicitacao"];
    }

    data(_data){
        if(!_data){
            return this.data;
        }else{
            this._data_ = _data.map(this.convertDate);
            this.colorDomain = _data.filter((item, index, array) => {
                return array.indexOf(item) === index;
            })
        }
        
        console.log('data setup');
    }

    init(){
        this.initMargin();
        this.initSVGElements();
        this.initScale();
    }

    initMargin(){
        this.margin = {top: 20, right: 20, bottom: 60, left: 60};
        this.width = 700 - this.margin.left - this.margin.right;
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
        
        this.colorScale = d3.scaleOrdinal().range(["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"]);

        this.radiusScale = function(d){ return 4; };
    }

    draw(){
        if(!this.data){
            console.log("data is not defined");
            return;
        }
        let extent = d3.extent(this._data_, d => this.x(d) );
        let newYear =  d3.timeYear(extent[0]); 
        this.xDomain = [];
        this.xDomain[0] = newYear;
        this.xDomain[1] = d3.timeYear.offset(newYear);        
        this.xScale.domain(this.xDomain);

        this.yDomain = [0.01, d3.max(this._data_, d=> this.y(d) )];
        this.yScale.domain(this.yDomain);
        this.colorScale.domain(this.colorDomain);

        this.drawMarks();
    }

    drawMarks(){
        if(!this.data){
            console.log("data is not defined");
            return;
        }

        let bubbles = this.circleGroup.selectAll(".bubbles").data(this._data_, d => this.key(d) );
        
        // UPDATE
        bubbles.transition()
                .ease(d3.easeSinInOut)
                .duration(750)
                .attr("cx", d => xScale(x(d)) )
                .attr("cy", d => yScale(y(d)) );
        
        //ENTER
        bubbles.enter()
                .append("circle")
                .attr("class", d => ("bubbles "+this.mapCodeToLetter(this.key(d)) ))
                .attr("cx", d => this.xScale(this.x(d)) )
                .attr("cy", this.height )
                .attr("r", 0 )
                .style("fill", d => this.colorScale(this.color(d)))
                .transition()
                .duration(750)
                .attr("cx", d => this.xScale(this.x(d)) )
                .attr("cy", d => this.yScale(this.y(d)) )
                .attr("r",  d => this.radiusScale(this.r(d)) )
                .style("fill", d => this.colorScale(this.color(d)))
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