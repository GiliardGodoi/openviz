

export default class Treemap {
    constructor(){
        this._data = {};
        this.root;
        this.treemapLayout;
        this.svg;

        this.colorScale;
        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
        this.keys
    }

    data(data){
        this._data.key = "total"
        this._data.values = d3.nest().key( d => d["dsModalidadeLicitacao"]).entries(data);
        this.root = d3.hierarchy(this._data, d => {
            return d.values;
        }).sum( d => {
            return d["vlLicitacao"];
        }).sort(function(a, b) { 
            return b['data']["vlLicitacao"] - a['data']["vlLicitacao"] || a['data']["vlLicitacao"] - b['data']["vlLicitacao"] ; 
        });
        // console.log("data",this._data.values);

        this.keys = this._data.values.map( d => d.key );
        this.colorScale = d3.scaleOrdinal().range(this.colorSchema).domain(this.keys);
    }

    init(){
        this.treemapLayout = d3.treemap().size([850, 500]).paddingOuter(5).tile(d3.treemapBinary);
        this.treemapLayout(this.root);

        this.svg = d3.select("#chart")
                    .append("svg")
                        .attr("width", (850))
                        .attr("height",(500))
                    .append("g")
                        .attr("class", "group-chart");
    }

    draw(){
        this.svg.selectAll("rect")
                .data(this.root.leaves())
                .enter()
                .append("rect")
                .attr("x", d => d.x0 )
                .attr("y", d => d.y0)
                .attr("width", d => (d.x1 - d.x0) )
                .attr("height", d => (d.y1 - d.y0) )
                .attr("class","tree-layout")
                .attr("fill", d => this.colorScale(d.data["dsModalidadeLicitacao"]) )
        // console.log("root ",this.root.descendants());

    }
}