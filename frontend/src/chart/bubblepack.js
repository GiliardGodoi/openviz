

export default class BubblePack {
    constructor(){
        this._data = {};
        this.root;
        this.packLayout;
        this.svg;
    }

    data(data){
        this._data.key = "total"
        this._data.values = d3.nest().key( d => d["dsModalidadeLicitacao"]).entries(data);
        this.root = d3.hierarchy(this._data, d => {
            return d.values;
        }).sum( d => {
            return d["vlLicitacao"];
        }).sort(function(a, b) { return b["vlLicitacao"] - a["vlLicitacao"]; });
        console.log(this._data);
    }

    init(){
        this.packLayout = d3.pack().size([500, 500]).padding(1);
        this.packLayout(this.root);

        this.svg = d3.select("#chart")
                    .append("svg")
                        .attr("width", (500))
                        .attr("height",(500))
                    .append("g")
                        .attr("class", "group-chart");
    }

    draw(){
        this.svg.selectAll("circle")
                .data(this.root.descendants())
                .enter()
                .append("circle")
                .attr("cx", d => d.x )
                .attr("cy", d => d.y )
                .attr("r", d => d.r )
                .attr("class","bubble")
        // console.log(this.root.descendants());

    }
}