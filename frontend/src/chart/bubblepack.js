import Formatter from "./formatter.js";

export default class BubblePack {
    constructor(){
        this._data = {};
        this.root;
        this.nodes;

        this.focus;
        this.view;

        this.margin = 0;
        this.width = 500;
        this.height = 500;
        this.diameter;

        this.packLayout;
        this.svg;
        this.groupChart;
        this.circles;
        this.drawedNodes;

        this.colorDomain;
        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"]
        this.colorScale;

        //legend
        this.svgLegend;
        this.ordinalLegend;

        //format number
        this.format = new Formatter().getFormater("$,.2f");
    }

    _color(d){
        return d["dsModalidadeLicitacao"];
    }

    _size(d){
        return d["vlModalidadeLicitacao"];
    }

    _key(d){
        return d["dsModalidadeLicitacao"];
    }

    data(data){
        this._data.key = "total"
        this._data.values = d3.nest()
                            .key( d => this._key(d) )
                            .entries(data);

        this.root = d3.hierarchy(this._data, d => {
            return d.values;
        }).sum( d => {
            return d["vlLicitacao"];
        }).sort( (a, b) => b["dsModalidadeLicitacao"] - a["dsModalidadeLicitacao"] ).sort(function(a, b) { return b["vlLicitacao"] - a["vlLicitacao"]; });

        this.colorDomain = data.map( d => d["dsModalidadeLicitacao"] )
        .filter( (item, pos, array) => {
            return array.indexOf(item) == pos;
        });

        console.log("data ::>> ", this._data);
        console.log("root ::>> ", this.root);
    }

    init(){        
        this.svg = d3.select("#chart")
                    .append("svg")
                        .attr("width", (this.width + this.margin))
                        .attr("height",(this.height + this.margin ));
        this.groupChart = this.svg.append("g")
                        .attr("class", "group-chart")
                        .attr("transform", "translate("+ [(this.width / 2), (this.width / 2)] +")");
        
        this.diameter = this.width;

        this.packLayout = d3.pack().size([this.width + this.margin, this.height + this.margin]).padding(1);
        
        this.packLayout(this.root);
        
        this.nodes = this.root.descendants();
        this.focus = this.root;

        this.colorScale = d3.scaleOrdinal().range(this.colorSchema).domain(this.colorDomain);

        this.initLegend();
    }

    initLegend(){
        this.ordinalLegend = d3.legendColor().shape("circle").title("Legenda - Modalidades Licitação").scale(this.colorScale);
    }

    draw(){
        const _this = this;
        this.circles = this.groupChart.selectAll("circle")
                .data(this.nodes)
                .enter()
                .append("circle")
                .attr("class", d => {
                    return d.parent ? ( d.children ? " bubble bubble-middle" : "bubble bubble-leaf") : "bubble bubble-root";
                })
                .attr("fill", d => {
                    return (d.children) ? null : this.colorScale(this._color(d.data)) ;
                })
                .on("click", d => {
                    if(d.height == 0 ){
                        if(this.focus !== d.parent ){
                            this.zoom(d.parent);
                            d3.event.stopPropagation();
                            this.showInfo(d.parent);
                        }
                    }else if(this.focus !== d){
                        this.zoom(d);
                        d3.event.stopPropagation();
                        this.showInfo(d);
                    }
                    // console.log(d);
                });
        
        this.svg.style("background", "white")
                .on("click", function(){
                    _this.zoom(_this.root);
                    _this.removeInfo();
                    // console.log(_this.root);
                })
        
        this.drawedNodes = this.svg.selectAll("circle");
        
        this.zoomTo([this.root.x, this.root.y, this.root.r * 2]); // [ posicao.X , posicao.Y, posicao.RAIO * 2 OU diameter ]

        this.svgLegend = d3.select("#legend-display")
                            .append("svg")
                            .attr("height", 200)
                            .append("g")
                            .attr("class", "lengenda")
                            .attr("transform", "translate(20,20)")
                            .call(this.ordinalLegend);
    }

    zoom(d){
        this.focus = d;
        const _this = this;
        var transition = d3.transition()
            .duration(750)
            .tween("zoom", d => {
                var i = d3.interpolateZoom(this.view,[this.focus.x,this.focus.y, this.focus.r * 2]);
                return function(t){
                    // t pode ser um parâmetro que representa tempo de 0 segundos até 1 segundo
                    return _this.zoomTo(i(t));
                }
            });
    }

    zoomTo(v){
        var k = this.diameter / v[2];
        this.view = v;
        // this.drawedNodes.attr("transform", d => {
        this.circles.attr("transform", d => {
            return "translate("+[ ((d.x - v[0]) * k ), ((d.y - v[1]) * k) ]+")";
        }).attr("r", d => d.r * k);
        
    }

    showInfo(d){
        // console.log(d);
        // console.log(this.format(d.value));
        let modalidade = d.data.key ? d.data.key : null ;
        let quantidade = d.data.values.length ? d.data.values.length : "";
        let valor = d.value ? this.format(d.value) : "";
        // let t = d3.transition().duration(500); // .transition(t)
        let card = d3.select("#card-display").style("display", "none")
        
        card = card.append("div").attr("class", "card info-card");
        card.append("div").attr("class","card-header").style("background-color", this.colorScale(modalidade));

        let body = card.append("div").attr("class", "card-body");
        body.append("p").text(`Modalidade: ${modalidade}`);
        body.append("p").text(`Quantidade: ${quantidade}`);
        body.append("p").text(`Total Licitado: ${valor}`);

        $("#card-display").fadeIn("slow");
    }

    removeInfo(){
        console.log("removing info card");
        $("#card-display").fadeOut();
        setTimeout( () => d3.selectAll(".info-card").remove(), 500 );
    }
}