export default class BubbleForce {
    constructor(){
        this.simulation;
        this.width = 850;
        this.height = 500;

        this.svg;

        this._data_;
        this.keys;

        this.xScale;
        this.yScale;
        this.colorScale;
        this.radiusScale;

        this.rDomain;

        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];

    }

    key(d){
        return d["dsModalidadeLicitacao"];
    }

    radius(d){
        return d["vlLicitacao"];
    }

    x(d){
        return d["dsModalidadeLicitacao"];
    }

    data(data){
        this._data_ = data;
        this.keys = this._data_.map( d => d["dsModalidadeLicitacao"] )
        .filter( (item, index, array) => {
            return array.indexOf(item) == index;
        });
        this.rDomain = d3.extent(data, d => d["vlLicitacao"]);
    }

    init(){
        this.initScales();

        this.svg = d3.select("#chart")
                    .append("svg")
                    .attr("width", (this.width))
                    .attr("height",(this.height))
                    .append("g")
                    .attr("class", "group-chart");
                    // .attr("transform", "translate("+[this.width/2, this.height/2]+")");
    }

    initScales(){
        this.radiusScale = d3.scaleSqrt().range([1,50]);
        this.colorScale = d3.scaleOrdinal().range(this.colorSchema);
        this.xScale = d3.scaleBand().range([50,this.width]);
    }

    draw(){
        this.radiusScale.domain(this.rDomain);
        this.colorScale.domain(this.keys);
        this.xScale.domain(this.keys);
        var _this = this;
        this.simulation = d3.forceSimulation(this._data_)
            .force("collision", d3.forceCollide().radius( d => {
                return this.radiusScale(d["vlLicitacao"]) + 0.5 ;
            }))
            .force("x", d3.forceX(this.width).x( d => {
                return this.xScale(d["dsModalidadeLicitacao"]);
            }).strength(1) )
            .force("y", d3.forceY(this.height).y( d => _this.height / 2 ).strength(0.075) )
            .on("tick", () => {
                var u = _this.svg.selectAll("circle").data(this._data_);
                    u.enter()
                    .append("circle")
                    .attr("r", d => {
                        return _this.radiusScale(d["vlLicitacao"]);
                    })
                    .merge(u)
                    .attr("cx", d => d.x )
                    .attr("cy", d => d.y )
                    .attr("fill", d => _this.colorScale(d["dsModalidadeLicitacao"]) );
                    u.exit().remove();
            } );
    }
}